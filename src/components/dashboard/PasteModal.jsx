
import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { parsePasteData } from '../../utils/parsers';
import { ASSET_CLASSES } from '../../utils/constants';

const PasteModal = ({ isOpen, onClose, onImport, accountId }) => {
    const [text, setText] = useState('');
    const [parsed, setParsed] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setText('');
            setParsed([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);
        const result = parsePasteData(val);
        setParsed(result);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            setText(content);
            const result = parsePasteData(content);
            setParsed(result);
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    const handleTypeChange = (idx, newType) => {
        const newParsed = [...parsed];
        newParsed[idx] = { ...newParsed[idx], type: newType, recognized: 'manual' };
        setParsed(newParsed);
    };

    const handleSave = () => {
        if (parsed.length === 0) return;
        onImport(accountId, parsed);
        onClose();
    };

    // Recognition summary counts
    const tickerCount = parsed.filter(r => r.recognized === 'ticker').length;
    const keywordCount = parsed.filter(r => r.recognized === 'keyword').length;
    const defaultCount = parsed.filter(r => r.recognized === 'default').length;
    const manualCount = parsed.filter(r => r.recognized === 'manual').length;
    const needsReview = defaultCount; // only truly unrecognized items

    const getRecognitionBadge = (row) => {
        if (row.recognized === 'ticker') {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Known
                </span>
            );
        }
        if (row.recognized === 'keyword') {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Inferred
                </span>
            );
        }
        if (row.recognized === 'manual') {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Manual
                </span>
            );
        }
        // 'default' - not recognized
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <HelpCircle className="w-2.5 h-2.5" /> Review
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Smart Paste Import</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Upload CSV or Paste Data</label>

                        {/* File Upload Button */}
                        <div className="mb-3">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="csv-upload"
                            />
                            <label
                                htmlFor="csv-upload"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 cursor-pointer transition-all"
                            >
                                <Upload className="w-4 h-4" /> Upload CSV File
                            </label>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">or paste manually</span>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-32 p-3 text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 outline-none mt-3"
                            placeholder={`Ticker   Value\nVTI      15000\nVXUS     5000`}
                            value={text}
                            onChange={handleTextChange}
                        />
                        <p className="text-xs text-zinc-500 mt-2">Copy two columns (Name/Ticker and Value) and paste them here.</p>
                    </div>

                    {parsed.length > 0 && (
                        <div>
                            {/* Recognition Summary Banner */}
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                    Preview ({parsed.length} items)
                                </h4>
                                <div className="flex items-center gap-2 text-xs">
                                    {tickerCount > 0 && (
                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                            <CheckCircle2 className="w-3 h-3" /> {tickerCount} recognized
                                        </span>
                                    )}
                                    {keywordCount > 0 && (
                                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                                            <CheckCircle2 className="w-3 h-3" /> {keywordCount} inferred
                                        </span>
                                    )}
                                    {manualCount > 0 && (
                                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                                            <CheckCircle2 className="w-3 h-3" /> {manualCount} manual
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Needs review alert */}
                            {needsReview > 0 && (
                                <div className="flex items-start gap-2 p-3 mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-xs text-amber-800 dark:text-amber-200">
                                        <span className="font-bold">{needsReview} item{needsReview > 1 ? 's' : ''} need{needsReview === 1 ? 's' : ''} review.</span>
                                        {' '}We didn't recognize {needsReview > 1 ? 'these tickers' : 'this ticker'} — they've been defaulted to "US Broad Market". Please verify the asset class using the dropdown.
                                    </div>
                                </div>
                            )}

                            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Value</th>
                                            <th className="px-4 py-2">Asset Class</th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {parsed.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className={`${row.recognized === 'default' ? 'bg-amber-50/40 dark:bg-amber-900/10' : 'bg-white dark:bg-zinc-900'}`}
                                            >
                                                <td className="px-4 py-2 font-medium font-mono text-xs">{row.name}</td>
                                                <td className="px-4 py-2">${row.value.toLocaleString()}</td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={row.type}
                                                        onChange={(e) => handleTypeChange(idx, e.target.value)}
                                                        className={`w-full bg-transparent border-none outline-none cursor-pointer text-sm ${row.recognized === 'default' ? 'text-amber-700 dark:text-amber-300 font-semibold' : 'text-zinc-700 dark:text-zinc-300'}`}
                                                    >
                                                        {Object.values(ASSET_CLASSES).map(a => (
                                                            <option key={a.id} value={a.id}>{a.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">{getRecognitionBadge(row)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={parsed.length === 0}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Import {parsed.length} Items
                        {needsReview > 0 && <span className="ml-1.5 text-xs opacity-75">({needsReview} unverified)</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasteModal;
