
import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = 'BGY3ZcXD_fo8KXdYg5Wm8C9uM1kB0PgojoZsqRiRavixiikMCPqWW56fW4FlpGcGAhi8liLnXNbJkAL37cDvfeY'; 

// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const subscribeToPush = async (userId?: string) => {
  if (!('serviceWorker' in navigator)) {
    console.error("Push Error: Service Worker not supported.");
    return false;
  }

  if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
     console.error("Push Error: Push Notifications require HTTPS (or localhost). Current origin is insecure.");
     return false;
  }

  try {
    // 1. Check Permission State
    if (Notification.permission === 'denied') {
      console.error("Push Error: Permission is explicitly denied.");
      return false;
    }

    // 2. Wait for SW
    const registration = await navigator.serviceWorker.ready;
    console.log("Push Service: SW Ready", registration);

    if (!registration.pushManager) {
      console.error("Push Error: PushManager not available (Are you on HTTP?)");
      return false;
    }

    // 3. Subscribe to Browser Push Manager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // 2. Save to Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({ 
        endpoint: subscription.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!))),
        user_id: userId || null
      }, { onConflict: 'endpoint' });

    if (error) {
        console.error("Supabase Save Error:", error);
        alert("Database Error: " + error.message); // DEBUG: Show user
        return false;
    }
    
    console.log("Subscribed to Push:", subscription.endpoint);
    return true;

  } catch (error: any) {
    console.error("Push Subscription Error:", error);
    alert("Push Error: " + (error.message || String(error))); // DEBUG: Show user
    return false;
  }
};
