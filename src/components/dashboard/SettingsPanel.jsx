
import React, { useRef } from 'react';
import { Settings, Save, Download, Upload, MousePointerClick, Activity, Heart, AlertCircle, Trash2, Coffee, Palette, Check, Sun, Moon } from 'lucide-react';
import Card from '../ui/Card';
import { COLOR_PALETTES } from '../../utils/palettes';

import { usePWAInstall } from '../../hooks/usePWAInstall';

const SettingsPanel = ({
    handleExportData,
    handleImportData,
    loadDemoData,
    startTour,
    resetAllData,
    colorPalette = 'botanical',
    setColorPalette,
    isDarkMode,
    toggleTheme
}) => {
    const fileInputRef = useRef(null);
    const { isSupported, isInstalled, triggerInstall, isIOS } = usePWAInstall();

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Settings</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Customize your visual palette, manage local backups, and control application state.</p>
            </div>

            {/* APPEARANCE & COLOR PALETTE */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Appearance & color palette</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Select a curated data-visualization palette for charts, asset tags, and surfaces.</p>
                    </div>
                    {toggleTheme && (
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                            <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(COLOR_PALETTES).map((pal) => {
                        const isSelected = colorPalette === pal.id;
                        return (
                            <button
                                key={pal.id}
                                type="button"
                                onClick={() => setColorPalette && setColorPalette(pal.id)}
                                className={`text-left p-3.5 rounded-lg border transition-all flex flex-col justify-between gap-2.5 ${
                                    isSelected
                                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/70 shadow-2xs'
                                        : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                            {pal.name}
                                        </span>
                                        {isSelected && (
                                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900">
                                                <Check className="w-2.5 h-2.5" />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center -space-x-1">
                                        {pal.swatches.map((hex, i) => (
                                            <span
                                                key={i}
                                                style={{ backgroundColor: hex }}
                                                className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-zinc-900"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    {pal.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </Card>

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
