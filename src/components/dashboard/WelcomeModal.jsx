import React from 'react';
import { LayoutDashboard, MousePointerClick, Activity } from 'lucide-react';

const WelcomeModal = ({ show, onLoadDemo, onStartTour, onDismiss }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4">
                            <LayoutDashboard className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Welcome to Balanced!</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">A tax-efficient portfolio rebalancing tool for serious investors.</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <button
                            onClick={onLoadDemo}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all shadow-sm hover:shadow-md"
                        >
                            <MousePointerClick className="w-4 h-4" /> Load Demo Data
                        </button>
                        <button
                            onClick={onStartTour}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all"
                        >
                            <Activity className="w-4 h-4" /> Take a Tour
                        </button>
                        <button
                            onClick={onDismiss}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                        >
                            Start Fresh
                        </button>
                    </div>

                    <p className="text-xs text-center text-zinc-500 dark:text-zinc-500">This message won't appear again.</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
