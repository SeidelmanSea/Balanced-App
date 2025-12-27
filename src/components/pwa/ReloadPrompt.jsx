
import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (offlineReady || needRefresh) {
            setShow(true);
        }
    }, [offlineReady, needRefresh]);

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 z-[100] animate-in slide-in-from-bottom-5">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                        {offlineReady ? 'App ready to work offline' : 'New content available'}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                        {offlineReady
                            ? 'Balanced has been cached and can now be used without an internet connection.'
                            : 'A new version of Balanced is available. Update now to get the latest features.'}
                    </p>
                    <div className="flex gap-2">
                        {needRefresh && (
                            <button
                                onClick={() => updateServiceWorker(true)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Reload
                            </button>
                        )}
                        <button
                            onClick={close}
                            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
                <button onClick={close} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
