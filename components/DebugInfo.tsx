
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const DebugInfo: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [checks, setChecks] = useState<any>({
        envUrl: !!import.meta.env.VITE_SUPABASE_URL,
        envKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        dbConnection: 'Checking...',
        swStatus: 'Checking...',
        permission: Notification.permission
    });

    useEffect(() => {
        if (!isOpen) return;

        // 1. Check DB
        supabase.from('push_subscriptions').select('count', { count: 'exact', head: true })
            .then(({ error }) => {
                setChecks(prev => ({ ...prev, dbConnection: error ? `Failed: ${error.message}` : '✅ OK' }));
            });

        // 2. Check SW
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                setChecks(prev => ({ ...prev, swStatus: reg ? '✅ Active' : '❌ Missing' }));
            });
        } else {
            setChecks(prev => ({ ...prev, swStatus: '❌ Not Supported' }));
        }

    }, [isOpen]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-1 left-1 z-[9999] text-[10px] text-slate-300 opacity-50 hover:opacity-100 bg-black/50 px-2 py-1 rounded"
            >
                DEBUG
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 text-green-400 p-6 font-mono text-xs overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-white">System Diagnostics</h1>
                <button onClick={() => setIsOpen(false)} className="text-red-500 text-lg">Close [X]</button>
            </div>

            <div className="space-y-2">
                <div className="border border-green-900 p-2 rounded">
                    <h3 className="text-white mb-1">Environment</h3>
                    <div>SUPABASE_URL: {checks.envUrl ? '✅ Set' : '❌ MISSING'}</div>
                    <div>SUPABASE_KEY: {checks.envKey ? '✅ Set' : '❌ MISSING'}</div>
                </div>

                <div className="border border-green-900 p-2 rounded">
                    <h3 className="text-white mb-1">Database</h3>
                    <div>Connection: {checks.dbConnection}</div>
                    <div className="text-slate-500 text-[10px] mt-1">If failed, check connection string or RLS policies.</div>
                </div>

                <div className="border border-green-900 p-2 rounded">
                    <h3 className="text-white mb-1">Browser Capability</h3>
                    <div>Service Worker: {checks.swStatus}</div>
                    <div>Notification Permission: <span className={checks.permission === 'granted' ? 'text-green-500' : 'text-red-500'}>{checks.permission}</span></div>
                    <div>Is Secure (HTTPS): {window.isSecureContext ? '✅ Yes' : '❌ No'}</div>
                </div>
            </div>
        </div>
    );
};
