
import OneSignal from 'react-onesignal';

// 1. Initialize OneSignal (Idempotent)
export const initOneSignal = async () => {
    try {
        // @ts-ignore - Check internal flag to avoid double-init warnings
        if (window.OneSignal && window.OneSignal._initCalled) {
             console.log("OneSignal already initialized.");
             return;
        }

        await OneSignal.init({
            appId: "0b21b40a-9d30-4ff1-ace9-a2cf44b43ee7",
            allowLocalhostAsSecureOrigin: true,
        });
        console.log("OneSignal initialized successfully");
    } catch (error) {
        console.error("OneSignal init error:", error);
    }
};

// 2. Check Permission Status
export const checkPermission = () => {
    return Notification.permission; // 'granted', 'denied', 'default'
};

// 3. Subscribe User to a Program (Tagging)
export const subscribeToProgram = async (programId: string) => {
    try {
        // A. Ensure Push is Enabled
        const isPushEnabled = OneSignal.User.PushSubscription.optedIn;
        if (!isPushEnabled) {
             console.log("User not opted in, requesting permission...");
             await OneSignal.Slidedown.promptPush();
        }

        // B. Apply Data Tag
        await OneSignal.User.addTag("program_id", programId);
        console.log("Subscribed to program:", programId);
        return true;
    } catch (e) {
        console.error("Subscription tagging error:", e);
        // Fallback: Native Prompt
        try { 
            await OneSignal.Slidedown.promptPush(); 
        } catch(e2) { console.error("Native prompt failed:", e2); }
        return false;
    }
};

// 4. Test Notification (Backend Connectivity Check)
export const testNotification = async () => {
    try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        console.log("Sending test request to:", `${supabaseUrl}/functions/v1/send-reminders`);

        const response = await fetch(`${supabaseUrl}/functions/v1/send-reminders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`
            },
            body: JSON.stringify({ test: true })
        });
        
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Server ${response.status}: ${err}`);
        }
        
        const data = await response.json();
        return { success: true, data };
    } catch (error: any) {
        console.error("Test notification failed:", error);
        return { success: false, error: error.message };
    }
};
