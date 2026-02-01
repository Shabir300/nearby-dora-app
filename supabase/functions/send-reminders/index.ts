
// index.ts for Supabase Edge Function 'send-reminders'

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ONESIGNAL_APP_ID = "0b21b40a-9d30-4ff1-ace9-a2cf44b43ee7";
const ONESIGNAL_REST_API_KEY = Deno.env.get("ONESIGNAL_REST_API_KEY"); 

serve(async (req) => {
  try {
    let body: any = {};
    try {
        const text = await req.text();
        if (text) body = JSON.parse(text);
    } catch(e) {
        // Body might be empty
    }
    
    // 1. Get current time in Pakistan Time (UTC+5)
    const now = new Date();
    const pktH = (now.getUTCHours() + 5) % 24;
    const pktM = now.getUTCMinutes();

    let heading = "";
    let content = "";
    
    // Test Mode logic
    if (body.test === true) {
        heading = "🔔 Test Notification";
        content = "This is a test to verify your OneSignal integration is working!";
    }
    // 6:00 PM (18:00)
    else if (pktH === 18 && pktM < 15) {
       heading = "📖 Journey through the Quran";
       content = "Get ready for your Dora Quran session. \"And We have certainly made the Quran easy for remembrance...\" (54:17).";
    }
    // 7:40 PM (19:40)
    else if (pktH === 19 && pktM >= 35 && pktM < 50) {
       heading = "⏳ Starting in 20 Minutes!";
       content = "Tarawih & Dora Quran sessions begin promptly. Ensure you have your Musallah and notepad ready.";
    }
    // 8:00 PM (20:00)
    else if (pktH === 20 && pktM < 15) {
       heading = "🟢 Dora Quran Started";
       content = "Don't worry if you're running a few minutes late—find a spot and join the reflection.";
    }
    else {
        return new Response(JSON.stringify({ 
            message: `No scheduled notification for this time (PKT: ${pktH}:${pktM}) and no test flag sent.` 
        }), { headers: { "Content-Type": "application/json" } });
    }

    // 2. Define the message payload
    let message: any = {
      app_id: ONESIGNAL_APP_ID,
      headings: { en: heading },
      contents: { en: content }
    };

    if (body.test === true) {
        // In test mode, send to EVERYONE to verify connectivity
        message.included_segments = ["All"]; 
    } else {
        // In production, filter by tag
        message.filters = [
            { field: "tag", key: "program_id", relation: "exists" }
        ];
    }

    // 3. Send to OneSignal
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(message)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});