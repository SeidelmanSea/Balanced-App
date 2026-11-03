
import React, { useRef } from 'react';
import { Settings, Save, Download, Upload, MousePointerClick, Activity, Heart, AlertCircle, Trash2, Coffee } from 'lucide-react';
import Card from '../ui/Card';

import { usePWAInstall } from '../../hooks/usePWAInstall';

const SettingsPanel = ({
    handleExportData,
    handleImportData,
    loadDemoData,
    startTour,
    resetAllData
}) => {
    const fileInputRef = useRef(null);
    const { isSupported, isInstalled, triggerInstall, isIOS } = usePWAInstall();

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Settings</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage local portfolio backups, guided tour, and application state.</p>
            </div>

            {/* DATA MANAGEMENT */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Data management</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">All data is stored locally in your browser. Export a JSON snapshot anytime.</p>
                    </div>
                    <Save className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleExportData}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-all"
                    >
                        <Download className="w-3.5 h-3.5" /> Export JSON backup
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all"
                    >
                        <Upload className="w-3.5 h-3.5" /> Import JSON backup
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportData}
                        className="hidden"
                        accept=".json"
                    />
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={loadDemoData}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 transition-all"
                    >
                        <MousePointerClick className="w-3.5 h-3.5" /> Load sample portfolio
                    </button>
                    <button
                        onClick={startTour}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 transition-all"
                    >
                        <Activity className="w-3.5 h-3.5" /> Launch product walkthrough
                    </button>
                </div>
            </Card>

            {/* APP INSTALLATION */}
            {
                isSupported && !isInstalled && (
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Install application</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Install Balanced as a standalone desktop or mobile app with offline support.</p>
                            </div>
                            <Download className="w-4 h-4 text-zinc-400" />
                        </div>
                        {isIOS ? (
                            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs text-zinc-600 dark:text-zinc-400">
                                To install on iOS: Tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-[11px]">⎋</span> and select <strong>"Add to Home Screen"</strong> <span className="inline-block px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-[11px]">⊕</span>
                            </div>
                        ) : (
                            <button
                                onClick={triggerInstall}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-all"
                            >
                                <Download className="w-3.5 h-3.5" /> Install application
                            </button>
                        )}
                    </Card>
                )
            }

            {/* SUPPORT DEVELOPMENT */}
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Support open-source development</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Balanced is free, private, and open-source with zero ads or tracking.</p>
                    </div>
                    <a
                        href="https://buymeacoffee.com/balanced"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all shrink-0"
                    >
                        <Coffee className="w-3.5 h-3.5" /> Support project
                    </a>
                </div>
            </Card>

            {/* DANGER ZONE */}
            <Card className="p-6 border-rose-200/70 dark:border-rose-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Reset local data</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Permanently clear all accounts, holdings, and strategy settings from this browser.</p>
                    </div>
                    <button
                        onClick={resetAllData}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-rose-200 dark:border-rose-800/80 hover:bg-rose-600 hover:border-rose-600 hover:text-white text-rose-600 dark:text-rose-400 transition-all shrink-0"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Reset all data
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPanel;
