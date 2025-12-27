
import React, { useRef } from 'react';
import { Settings, Save, Download, Upload, MousePointerClick, Activity, Heart, AlertCircle, Trash2, Coffee } from 'lucide-react';
import Card from '../ui/Card';

const SettingsPanel = ({
    handleExportData,
    handleImportData,
    loadDemoData,
    startTour,
    resetAllData
}) => {
    const fileInputRef = useRef(null);

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Settings className="w-6 h-6 text-zinc-400" />
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Application Settings</h2>
            </div>

            {/* DATA MANAGEMENT */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Save className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Data Management</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Export your portfolio data or restore from a backup.</p></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleExportData}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                    >
                        <Download className="w-4 h-4" /> Export Backup
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                    >
                        <Upload className="w-4 h-4" /> Import Backup
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportData}
                        className="hidden"
                        accept=".json"
                    />
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={loadDemoData}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 transition-all"
                    >
                        <MousePointerClick className="w-4 h-4" /> Load Demo Data
                    </button>
                </div>
            </Card>

            {/* TOUR LAUNCHER */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Activity className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Product Tour</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Learn how to use Balanced with a guided walkthrough.</p></div>
                </div>
                <button
                    onClick={startTour}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all"
                >
                    <Activity className="w-4 h-4" /> Take a Tour
                </button>
            </Card>

            {/* SUPPORT DEVELOPMENT */}
            <Card className="p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"><Heart className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Support Development</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Balanced is free and open-source. Help keep it that way!</p></div>
                </div>
                <a
                    href="https://buymeacoffee.com/balanced"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-medium transition-all shadow-sm"
                >
                    <Coffee className="w-4 h-4" /> Buy Me a Coffee
                </a>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">Your support helps maintain and improve Balanced for everyone</p>
            </Card>

            {/* DANGER ZONE */}
            <Card className="p-6 border-red-200 dark:border-red-900/30">
                <div className="flex items-center gap-3 mb-6 border-b border-red-100 dark:border-red-900/30 pb-4">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><AlertCircle className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-red-800 dark:text-red-100">Danger Zone</h3><p className="text-xs text-red-600 dark:text-red-400">Irreversible actions that will delete your data.</p></div>
                </div>
                <button
                    onClick={resetAllData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-300 dark:border-red-800 hover:bg-red-500 hover:border-red-500 hover:text-white text-red-600 dark:text-red-400 font-medium transition-all"
                >
                    <Trash2 className="w-4 h-4" /> Reset All Data
                </button>
            </Card>
        </div>
    );
};

export default SettingsPanel;
