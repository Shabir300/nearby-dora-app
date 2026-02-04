// index.ts for Supabase Edge Function 'send-reminders'

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from "https://esm.sh/web-push@3.6.3?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 0. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body: any = {};
    try {
        const text = await req.text();
        if (text) body = JSON.parse(text);
    } catch(e) {
        // Body might be empty (Cron Trigger)
    }
    
    // 1. Setup WebPush
    const vapidParams = {
        subject: 'mailto:admin@nearbydoraquran.com',
        publicKey: 'BGY3ZcXD_fo8KXdYg5Wm8C9uM1kB0PgojoZsqRiRavixiikMCPqWW56fW4FlpGcGAhi8liLnXNbJkAL37cDvfeY',
        privateKey: Deno.env.get('VAPID_PRIVATE_KEY')!
    };
    
    webpush.setVapidDetails(
      vapidParams.subject,
      vapidParams.publicKey,
      vapidParams.privateKey
    );

    // 2. Get current time in Pakistan Time (UTC+5)
    // Supabase Edge Functions run in UTC. To get PKT, add 5 hours.
    const now = new Date();
    const pktH = (now.getUTCHours() + 5) % 24;
    const pktM = now.getUTCMinutes();

    let heading = "";
    let content = "";
    
    // Test Mode logic
    if (body.test === true) {
        heading = "🔔 Test Notification";
        content = "This is a test to verify your scheduler is working!";
    }
    // 6:00 PM (18:00) - Preparation
    else if (pktH === 18 && pktM < 15) {
       heading = "📖 Time to Prepare!";
       content = "Your subscribed Dora Quran starts soon. Check your travel time and head out early to secure a spot!";
    }
    // 7:40 PM (19:40) - Final Call
    else if (pktH === 19 && pktM >= 35 && pktM < 50) {
       heading = "⏳ Starting in 20 Minutes!";
       content = "Dora Quran sessions begin promptly. Ensure you have your Musallah and notepad ready.";
    }
    // 8:00 PM (20:00) - Start Alert
    else if (pktH === 20 && pktM < 10) {
       heading = "🟢 Dora Quran Started";
       content = "The session is now beginning. Please silence your phone and immerse yourself in the Word of Allah.";
    }
    else {
        return new Response(JSON.stringify({ 
            message: `No scheduled notification for this time (PKT: ${pktH}:${pktM}) and no test flag sent.` 
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 3. Fetch Subscriptions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let query = supabase.from('push_subscriptions').select('*');
    const { data: subscriptions, error } = await query;
    let safeSubscriptions = subscriptions;

    if (error) {
        // Fallback: If 'program_name' or other cols are missing in schema cache (PGRST204), select only core fields
        if (error.code === 'PGRST204' || error.message?.includes("Could not find the 'program_name'")) {
             console.warn("Schema mismatch detected, falling back to core fields.");
             const retrySrc = await supabase.from('push_subscriptions').select('id, endpoint, auth, p256dh');
             if (retrySrc.error) throw retrySrc.error;
             safeSubscriptions = retrySrc.data;
        } else {
             throw error;
        }
    }

    console.log(`Scheduler: Found ${safeSubscriptions?.length} subscriptions to notify for: ${heading}`);

    // 4. Send Notifications
    const results = await Promise.allSettled(safeSubscriptions.map(async (sub: any) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth, 
          p256dh: sub.p256dh
        }
      };
      
      const payload = JSON.stringify({ 
          title: heading, 
          body: content, 
          url: "https://nearby.doraquran.pk",
          image: 'https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png'
      });

      return webpush.sendNotification(pushConfig, payload).catch((err: any) => {
        if (err.statusCode === 410) {
            // Delete expired
            supabase.from('push_subscriptions').delete().match({ id: sub.id });
        }
        throw err;
      });
    }));

    const successCount = results.filter(r => r.status === 'fulfilled').length;

    return new Response(
      JSON.stringify({ success: true, sent: successCount, total: safeSubscriptions?.length, time: `${pktH}:${pktM}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});