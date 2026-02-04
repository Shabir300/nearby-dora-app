
import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';
// import OneSignal from 'react-onesignal';

// Custom hook to handle the PWA install prompt
const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIphone = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIphone);

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return { isInstallable, promptInstall, isIOS };
};

export const InstallPrompt: React.FC = () => {
    const { isInstallable, promptInstall, isIOS } = useInstallPrompt();
    const [show, setShow] = useState(false);
    const [step, setStep] = useState<'welcome' | 'install' | 'notifications'>('welcome');

    // Check if running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    useEffect(() => {
        // 1. Check if user has already onboarded
        const hasVisited = localStorage.getItem('hasVisitedApp_v3');

        if (!hasVisited && !isStandalone) {
            // Wait a bit for the app to settle
            const timer = setTimeout(() => setShow(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [isStandalone]);

    useEffect(() => {
        const handleAppInstalled = () => {
            localStorage.setItem('hasVisitedApp_v3', 'true');
            setShow(false);
        };
        window.addEventListener('appinstalled', handleAppInstalled);
        return () => window.removeEventListener('appinstalled', handleAppInstalled);
    }, []);

    const handleStart = () => {
        localStorage.setItem('hasVisitedApp_v3', 'true');
        setStep('install');
    };

    const handleInstall = async () => {
        if (isIOS) {
            // iOS doesn't support programmatic install, so we show instructions in the UI instead of taking an action
            // but we can advance flow if they say they "Did it"? 
            // Better: Stay on this step and show specific iOS UI.
            alert("On iPhone:\n1. Tap the 'Share' icon (square with arrow)\n2. Scroll down and tap 'Add to Home Screen'");
            return;
        }

        if (isInstallable) {
            await promptInstall();
        }
        setStep('notifications');
    };

    const handleEnableNotifications = async () => {
        // ON iOS, you MUST act from a user gesture context.
        // Also on iOS, web push ONLY works in Standalone mode (Added to Home Screen).

        if (isIOS && !isStandalone) {
            alert("⚠️ iOS Requirement:\n\nYou MUST add this app to your Home Screen first to enable notifications.\n\nPlease follow the 'Install App' step.");
            setStep('install'); // Send them back to install step
            return;
        }

        const permission = Notification.permission;

        if (permission === 'denied') {
            alert("⚠️ Notifications are blocked by your browser.\n\nTo enable:\n1. Tap the 'Lock' 🔒 icon in the URL bar.\n2. Tap 'Permissions' or 'Site Settings'.\n3. Tap 'Notifications' -> 'Allow'.\n4. Refresh the page.");
            return;
        }

        if (permission === 'granted') {
            alert("✅ Notifications are already enabled!");
            setShow(false);
            return;
        }

        console.log("Requesting notification permission...");
        try {
            const { subscribeToPush } = await import('../services/push-service');
            const success = await subscribeToPush();
            if (success) {
                // Success
            } else {
                alert("Notifications blocked or failed. Please check settings.");
            }
        } catch (e) {
            console.error("Prompt failed", e);
        }

        // Close modal after attempt
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl m-4 animate-in slide-in-from-bottom duration-500 transition-all">

                {step === 'welcome' && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#065f46] rounded-xl rotate-3 flex items-center justify-center mb-6 shadow-md shadow-[#065f46]/20">
                            <img src="https://crm.pcirealestate.site/wp-content/uploads/2026/01/Logo-DTQ-app.png" alt="Logo" className="w-14 h-14 object-contain brightness-0 invert" />
                        </div>
                        <h2 className="text-2xl font-black text-[#0f172a] mb-2">Welcome to Dora Quran</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Discover nearby programs, track your spiritual journey, and never miss a session.
                        </p>
                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-[#d4af37] text-white font-bold rounded-lg hover:bg-[#b8962e] transition-all shadow-sm active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                )}

                {step === 'install' && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mb-6 text-white text-2xl">
                            {isIOS ? <Icons.Crescent /> : <Icons.MapPin />}
                        </div>
                        <h2 className="text-xl font-black text-[#0f172a] mb-2">Install App</h2>

                        {isIOS ? (
                            <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-left">
                                <p className="text-sm font-bold text-[#0f172a] mb-2">iPhone Users:</p>
                                <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                                    <li>Tap the <span className="font-bold">Share</span> button (box with arrow)</li>
                                    <li>Scroll down & tap <span className="font-bold">Add to Home Screen</span></li>
                                    <li>Tap <span className="font-bold">Add</span> in top right</li>
                                </ol>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm mb-8">
                                Add to your home screen for the best experience. It's fast and works offline!
                            </p>
                        )}

                        <div className="flex flex-col gap-3 w-full">
                            {!isIOS && isInstallable && (
                                <button
                                    onClick={promptInstall}
                                    className="w-full py-4 bg-[#065f46] text-white font-bold rounded-lg shadow-sm active:scale-95"
                                >
                                    Install Now
                                </button>
                            )}

                            {/* For iOS, we just offer a "Done" button since we can't trigger install */}
                            {isIOS && (
                                <button
                                    onClick={() => setStep('notifications')}
                                    className="w-full py-4 bg-[#0f172a] text-white font-bold rounded-lg shadow-sm active:scale-95"
                                >
                                    I've Added It
                                </button>
                            )}

                            {!isIOS && !isInstallable && (
                                <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-500 mb-2 border border-slate-100">
                                    To install: Tap <strong>Menu</strong> (Android) then select <strong>Add to Home Screen</strong>.
                                </div>
                            )}

                            <button
                                onClick={() => setStep('notifications')}
                                className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600"
                            >
                                {isIOS ? 'Skip' : (isInstallable ? 'Maybe Later' : 'Done / Skip')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'notifications' && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#d4af37]/20 rounded-full flex items-center justify-center mb-6 text-[#d4af37] text-2xl">
                            <Icons.Crescent />
                        </div>
                        <h2 className="text-xl font-black text-[#0f172a] mb-2">Detailed Alerts</h2>
                        <p className="text-slate-500 text-sm mb-8">
                            Get reminded about Suhoor, Iftar, and start times for your selected programs.
                        </p>
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={handleEnableNotifications}
                                className="w-full py-4 bg-[#065f46] text-white font-bold rounded-lg shadow-sm active:scale-95"
                            >
                                Turn On Notifications
                            </button>

                            <button
                                onClick={async () => {
                                    alert("Sending test request to server...");
                                    try {
                                        const { subscribeToPush } = await import('../services/push-service');
                                        // Ensure subscribed first
                                        await subscribeToPush();

                                        // Call Edge Function
                                        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/push-sender`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                                            },
                                            body: JSON.stringify({
                                                title: "Test Notification",
                                                body: "If you see this, Native Push is working!",
                                                url: window.location.href
                                            })
                                        });
                                        alert("✅ Signal sent! Check for a notification now.");
                                    } catch (e) {
                                        alert("❌ Failed: " + String(e));
                                    }
                                }}
                                className="text-xs text-slate-400 underline mt-2"
                            >
                                Test Connection
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600"
                            >
                                No Thanks
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
