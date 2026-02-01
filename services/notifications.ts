
import OneSignal from 'react-onesignal';

// Improved initialization to prevent double-calls and specific origin errors
export const initOneSignal = async () => {
    try {
        // @ts-ignore - access internal flag to check if already init
        if (window.OneSignal && window.OneSignal._initCalled) {
             console.log("OneSignal already initialized, skipping.");
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

export const checkPermission = () => {
    return Notification.permission; // 'granted', 'denied', 'default'
};

export const subscribeToProgram = async (programId: string) => {
    try {
        // 1. Ensure user is actually subscribed to Push
        // If not, prompt them
        const isPushEnabled = OneSignal.User.PushSubscription.optedIn;
        if (!isPushEnabled) {
             console.log("User not opted in, prompting...");
             await OneSignal.Slidedown.promptPush();
        }

        // 2. Add the tag
        await OneSignal.User.addTag("program_id", programId);
        console.log("Subscribed to", programId);
        return true;
    } catch (e) {
        console.error("Subscription error:", e);
        // Fallback: Try native prompt if slidedown fails
        try { 
            await OneSignal.Slidedown.promptPush(); 
        } catch(e2) { console.error(e2); }
        return false;
    }
};
