
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from "https://esm.sh/web-push@3.6.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    // 2. Get Request Body
    const { title, body, url, schedule_time } = await req.json();

    // 3. Fetch Subscriptions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw error;

    console.log(`Found ${subscriptions?.length} subscriptions`);

    // 4. Send Notifications
    const results = await Promise.allSettled(subscriptions.map(sub => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth, // Already stored as base64 in DB? Verify decoding if needed.
          p256dh: sub.p256dh
        }
      };
      
      const payload = JSON.stringify({ 
          title, 
          body, 
          url,
          image: 'https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png' // Default beautiful image
      });

      return webpush.sendNotification(pushConfig, payload).catch(err => {
        if (err.statusCode === 410) {
            // Delete expired
            supabase.from('push_subscriptions').delete().match({ id: sub.id });
        }
        throw err;
      });
    }));

    const successCount = results.filter(r => r.status === 'fulfilled').length;

    return new Response(
      JSON.stringify({ success: true, sent: successCount, total: subscriptions.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
