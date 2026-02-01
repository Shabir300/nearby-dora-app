
import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';
import OneSignal from 'react-onesignal';

// Custom hook to handle the PWA install prompt
const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
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

    return { isInstallable, promptInstall };
};

export const InstallPrompt: React.FC = () => {
    const { isInstallable, promptInstall } = useInstallPrompt();
    const [show, setShow] = useState(false);
    const [step, setStep] = useState<'welcome' | 'install' | 'notifications'>('welcome');

    useEffect(() => {
        // Show welcome screen on first visit
        const hasVisited = localStorage.getItem('hasVisitedApp');
        if (!hasVisited) {
            // Wait a bit for the app to settle
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleStart = () => {
        localStorage.setItem('hasVisitedApp', 'true');
        // If installable, show install step, otherwise notification step (or close if native PWA)
        if (isInstallable) {
            setStep('install');
        } else {
            setStep('notifications');
        }
    };

    const handleInstall = async () => {
        await promptInstall();
        setStep('notifications');
    };

    const handleEnableNotifications = async () => {
        try {
            await OneSignal.Slidedown.promptPush();
        } catch (e) { console.error(e); }
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl m-4 animate-in slide-in-from-bottom duration-500">

                {step === 'welcome' && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#065f46] rounded-3xl rotate-3 flex items-center justify-center mb-6 shadow-xl shadow-[#065f46]/20">
                            <img src="https://crm.pcirealestate.site/wp-content/uploads/2026/01/Logo-DTQ-app.png" alt="Logo" className="w-14 h-14 object-contain brightness-0 invert" />
                        </div>
                        <h2 className="text-2xl font-black text-[#0f172a] mb-2">Welcome to Dora Quran</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Discover nearby programs, track your spiritual journey, and never miss a session.
                        </p>
                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-[#d4af37] text-white font-bold rounded-2xl hover:bg-[#b8962e] transition-all shadow-lg active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                )}

                {step === 'install' && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mb-6 text-white text-2xl">
                            <Icons.MapPin /> {/* Using generic icon or add a phone icon later */}
                        </div>
                        <h2 className="text-xl font-black text-[#0f172a] mb-2">Install App</h2>
                        <p className="text-slate-500 text-sm mb-8">
                            Add to your home screen for the best experience. It's fast and works offline!
                        </p>
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={handleInstall}
                                className="w-full py-4 bg-[#065f46] text-white font-bold rounded-2xl shadow-lg active:scale-95"
                            >
                                Install Now
                            </button>
                            <button
                                onClick={() => setStep('notifications')}
                                className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600"
                            >
                                Maybe Later
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
                                className="w-full py-4 bg-[#065f46] text-white font-bold rounded-2xl shadow-lg active:scale-95"
                            >
                                Turn On Notifications
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
