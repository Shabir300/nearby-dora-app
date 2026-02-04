
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from "https://esm.sh/web-push@3.6.3?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 0. Handle CORS Preflight - Critical to do this first and catch any errors
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
    const { title, body, url, schedule_time, filter_endpoint } = await req.json();

    // 3. Fetch Subscriptions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let query = supabase.from('push_subscriptions').select('*');
    if (filter_endpoint) {
        query = query.eq('endpoint', filter_endpoint);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
        // Fallback: If 'program_name' or other cols are missing in schema cache (PGRST204), select only core fields
        if (error.code === 'PGRST204' || error.message?.includes("Could not find the 'program_name'")) {
             console.warn("Schema mismatch detected, falling back to core fields.");
             let retryQuery = supabase.from('push_subscriptions').select('id, endpoint, auth, p256dh');
             if (filter_endpoint) {
                retryQuery = retryQuery.eq('endpoint', filter_endpoint);
             }
             const retrySrc = await retryQuery;
             if (retrySrc.error) throw retrySrc.error;
             
             // Continue with retried data
             // We need to re-assign to subscriptions, but 'const' prevents it. 
             // Refactoring to 'let' above is cleaner, but for this snippet:
             var safeSubscriptions = retrySrc.data;
        } else {
             throw error;
        }
    } else {
        var safeSubscriptions = subscriptions;
    }

    console.log(`Found ${safeSubscriptions?.length} subscriptions (Targeted: ${!!filter_endpoint})`);

    // 4. Send Notifications
    const results = await Promise.allSettled(safeSubscriptions.map(sub => {
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
      JSON.stringify({ success: true, sent: successCount, total: safeSubscriptions.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
