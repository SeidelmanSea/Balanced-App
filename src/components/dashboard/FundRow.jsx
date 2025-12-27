import React from 'react';
import { Trash2, Shield, ChevronDown } from 'lucide-react';
import { ASSET_CLASSES } from '../../utils/constants';
import tickerDatabase from '../../tickerDatabase.json';

const FundRow = React.memo(({ fund, accountId, updateFund, removeFund }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in slide-in-from-left-2 duration-300 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm md:shadow-none md:border-0 md:bg-transparent md:p-0 mb-3 md:mb-0">

            <div className="md:col-span-4">
                <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Fund Name</label>
                <input
                    type="text"
                    placeholder="e.g. VTI"
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                    value={fund.name}
                    onChange={(e) => updateFund(accountId, fund.id, 'name', e.target.value)}
                    onBlur={(e) => {
                        const ticker = e.target.value.trim().toUpperCase();
                        const assetClass = tickerDatabase[ticker];
                        if (assetClass && fund.type !== assetClass) {
                            updateFund(accountId, fund.id, 'type', assetClass);
                        }
                    }}
                />
            </div>

            <div className="md:col-span-4">
                <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Asset Class</label>
                <div className="relative">
                    <select
                        className="w-full pl-3 pr-8 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input
                        type="number"
                        className="w-full pl-6 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={fund.value}
                        onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => updateFund(accountId, fund.id, 'value', e.target.value)}
                    />
                </div>
            </div>

            <div className="md:col-span-1 flex justify-end gap-1">
                <button
                    onClick={() => updateFund(accountId, fund.id, 'isEmergency', !fund.isEmergency)}
                    className={`p-2 rounded-md transition-colors ${fund.isEmergency ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-zinc-300 hover:text-zinc-400'}`}
                    title={fund.isEmergency ? "Fund counts as Emergency Fund" : "Fund counts as Investment"}
                >
                    <Shield className="w-4 h-4" />
                </button>
                <button
                    onClick={() => removeFund(accountId, fund.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    aria-label="Remove Fund"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

export default FundRow;
