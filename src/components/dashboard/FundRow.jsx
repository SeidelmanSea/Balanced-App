import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trash2, Shield, ChevronDown } from 'lucide-react';
import { ASSET_CLASSES } from '../../utils/constants';
import tickerDatabase from '../../tickerDatabase.json';
import CurrencyInput from '../ui/CurrencyInput';

const FundRow = React.memo(({ fund, accountId, updateFund, removeFund }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    const assetMeta = useMemo(() => {
        return Object.values(ASSET_CLASSES).find(a => a.id === fund.type) || ASSET_CLASSES.US_BROAD;
    }, [fund.type]);

    const suggestions = useMemo(() => {
        const q = (fund.name || '').trim().toUpperCase();
        if (!q || q.length < 1) return [];
        const matches = Object.entries(tickerDatabase)
            .filter(([ticker]) => ticker.startsWith(q) && ticker !== q)
            .slice(0, 5)
            .map(([ticker, typeId]) => {
                const asset = Object.values(ASSET_CLASSES).find(a => a.id === typeId);
                return {
                    ticker,
                    typeId,
                    assetName: asset?.name || typeId,
                    color: asset?.color || '#10b981'
                };
            });
        return matches;
    }, [fund.name]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (item) => {
        updateFund(accountId, fund.id, 'name', item.ticker);
        updateFund(accountId, fund.id, 'type', item.typeId);
        setShowSuggestions(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center animate-in slide-in-from-left-2 duration-300 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm md:shadow-none md:border-0 md:bg-transparent md:p-0 mb-3 md:mb-0">

            <div className="md:col-span-4 relative" ref={wrapperRef}>
                <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Fund / Ticker</label>
                <input
                    type="text"
                    placeholder="e.g. VTI, VXUS, BND"
                    className="w-full px-3 py-2 text-sm font-medium bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                    value={fund.name}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                        updateFund(accountId, fund.id, 'name', e.target.value);
                        setShowSuggestions(true);
                    }}
                    onBlur={(e) => {
                        const ticker = e.target.value.trim().toUpperCase();
                        const assetClass = tickerDatabase[ticker];
                        if (assetClass && fund.type !== assetClass) {
                            updateFund(accountId, fund.id, 'type', assetClass);
                        }
                    }}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden py-1">
                        {suggestions.map((item) => (
                            <button
                                key={item.ticker}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectSuggestion(item);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-between transition-colors"
                            >
                                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-100">{item.ticker}</span>
                                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.assetName}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="md:col-span-4">
                <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Asset Class</label>
                <div className="relative">
                    <span
                        className="w-2.5 h-2.5 rounded-full absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
                        style={{ backgroundColor: assetMeta?.color || '#10b981' }}
                    />
                    <select
                        className="w-full pl-8 pr-8 py-2 text-sm font-medium bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all"
                        value={fund.type}
                        onChange={(e) => updateFund(accountId, fund.id, 'type', e.target.value)}
                    >
                        {Object.values(ASSET_CLASSES).map((asset) => (
                            <option key={asset.id} value={asset.id}>
                                {asset.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            <div className="md:col-span-3 relative">
                <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Value ($)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-medium">$</span>
                    <CurrencyInput
                        className="w-full pl-6 pr-3 py-2 text-sm font-semibold tabular-nums bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                        value={fund.value}
                        onChange={(val) => updateFund(accountId, fund.id, 'value', val)}
                    />
                </div>
            </div>

            <div className="md:col-span-1 flex justify-end gap-1">
                <button
                    type="button"
                    onClick={() => updateFund(accountId, fund.id, 'isEmergency', !fund.isEmergency)}
                    className={`p-2 rounded-lg transition-colors ${fund.isEmergency ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' : 'text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400'}`}
                    title={fund.isEmergency ? "Shielded as Emergency Reserve" : "Click to shield as Emergency Reserve"}
                >
                    <Shield className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => removeFund(accountId, fund.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Remove Fund"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

export default FundRow;
