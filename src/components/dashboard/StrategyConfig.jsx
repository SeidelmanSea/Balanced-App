
import React from 'react';
import { SlidersHorizontal, Shield, LayoutDashboard, CheckCircle2, Calendar, Activity, Target, Lock, PieChart as PieChartIcon, Undo2, AlertTriangle, Plus, X, Percent } from 'lucide-react';
import Card from '../ui/Card';
import { TAX_STRATEGIES, REBALANCE_MODES, ASSET_CLASSES, EQUITY_PRESETS } from '../../utils/constants';
import { getSuggestedBondAllocation } from '../../utils/finance';

const StrategyConfig = ({
    userAge,
    yearsToRetirement,
    retirementYear,
    setRetirementYear,
    emergencyFund,
    setEmergencyFund,
    taxStrategy,
    setTaxStrategy,
    bondAllocation,
    setBondAllocation,
    cashAllocation,
    setCashAllocation,
    bondStrategyMode,
    setBondStrategyMode,
    equityStrategy,
    setEquityStrategy,
    isAddingAsset,
    setIsAddingAsset,
    updateEquityStrategy,
    addEquityAsset,
    removeEquityAsset,
    resetEquityStrategy
}) => {
    const currentYear = new Date().getFullYear();
    const numericAge = parseInt(userAge) || 0;
    const totalEquityAllocation = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
    const isEquityValid = Math.abs(totalEquityAllocation - 100) < 0.1;
    const isCustomMode = bondStrategyMode === 'custom';

    const bondStrategies = [
        { id: 'smart', name: 'Target Date (Smart)', value: getSuggestedBondAllocation(numericAge), desc: `Glide path targeting retirement in ${retirementYear} (${yearsToRetirement} years away)` },
        { id: 'aggressive', name: 'Aggressive (Age - 20)', value: Math.max(0, numericAge - 20), desc: 'Focuses on maximum growth.' },
        { id: 'moderate', name: 'Moderate (Age - 10)', value: Math.max(0, numericAge - 10), desc: 'Standard rule of thumb.' },
        { id: 'conservative', name: 'Conservative (Age Match)', value: Math.min(100, numericAge), desc: 'Lower risk, preserves capital.' },
    ];

    const availableAssets = Object.values(ASSET_CLASSES).filter(a => a.id !== 'cash' && a.id !== 'money_market' && a.id !== 'bonds' && equityStrategy[a.id] === undefined);

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-6 h-6 text-zinc-400" />
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Portfolio Configuration</h2>
            </div>

            {/* EMERGENCY FUND CONFIGURATION */}
            <Card className="p-6 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"><Shield className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Emergency Fund Target</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Set aside cash before investing. This target is separate from your portfolio.</p></div>
                </div>
                <div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-zinc-500">$</span></div>
                        <input
                            type="number"
                            min="0"
                            value={emergencyFund}
                            onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                            onChange={(e) => {
                                const val = e.target.value;
                                setEmergencyFund(val === '' ? '' : parseInt(val));
                            }}
                            onWheel={(e) => e.target.blur()}
                            className="block w-full pl-7 pr-12 py-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Funds in accounts marked as "Emergency Fund" will count towards this goal.</p>
                </div>
            </Card>

            {/* TAX STRATEGY SELECTOR */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><LayoutDashboard className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Asset Location Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Control how assets are distributed across your taxable and tax-advantaged accounts.</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.values(TAX_STRATEGIES).map(strategy => (
                        <button
                            key={strategy.id}
                            onClick={() => setTaxStrategy(strategy.id)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${taxStrategy === strategy.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-zinc-900'}`}
                        >
                            {taxStrategy === strategy.id && <div className="absolute top-3 right-3 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>}
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`p-2 rounded-md ${taxStrategy === strategy.id ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                    <strategy.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className={`font-bold mb-1 ${taxStrategy === strategy.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{strategy.name}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{strategy.desc}</div>
                        </button>
                    ))}
                </div>
            </Card>

            {/* BOND ALLOCATION */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Calendar className="w-5 h-5" /></div>
                    <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Macro Allocation (Bonds vs. Stocks)</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Determine your risk tolerance based on your age and timeline.</p></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => {
                            if (isCustomMode) {
                                setBondStrategyMode('smart');
                                setBondAllocation(getSuggestedBondAllocation(parseInt(userAge) || 0));
                            }
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all relative overflow-hidden ${!isCustomMode ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-zinc-900'}`}
                    >
                        {!isCustomMode && <div className="absolute top-2 right-2 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>}
                        <div className="flex justify-center mb-2"><Activity className={`w-6 h-6 ${!isCustomMode ? 'text-emerald-600' : 'text-zinc-400'}`} /></div>
                        <div className={`font-bold ${!isCustomMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>Strategy Based</div>
                        <div className="text-xs text-zinc-500 mt-1">Adjusts automatically with age</div>
                    </button>

                    <button
                        onClick={() => setBondStrategyMode('custom')}
                        className={`p-4 rounded-xl border-2 text-center transition-all relative overflow-hidden ${isCustomMode ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-zinc-900'}`}
                    >
                        {isCustomMode && <div className="absolute top-2 right-2 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>}
                        <div className="flex justify-center mb-2"><Lock className={`w-6 h-6 ${isCustomMode ? 'text-emerald-600' : 'text-zinc-400'}`} /></div>
                        <div className={`font-bold ${isCustomMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>Fixed Allocation</div>
                        <div className="text-xs text-zinc-500 mt-1">Set a specific percentage</div>
                    </button>
                </div>

                {!isCustomMode ? (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-white dark:bg-zinc-900 p-2 rounded-full border border-zinc-200 dark:border-zinc-700"><Target className="w-5 h-5 text-emerald-600" /></div>
                                <div><h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Current Bond Allocation</h4><p className="text-xs text-zinc-500 dark:text-zinc-400">Lower % = Higher Risk / Higher % = Lower Risk</p></div>
                            </div>
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{bondAllocation}%</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Retirement Year</label>
                                <input
                                    type="number"
                                    min={currentYear}
                                    max={currentYear + 50}
                                    value={retirementYear}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val)) setRetirementYear(val);
                                    }}
                                    className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                                <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                                    {yearsToRetirement} years to retirement (assuming age 65). Used for Target Date strategy.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Allocation Strategies</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {bondStrategies.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => { setBondStrategyMode(s.id); setBondAllocation(s.value); }}
                                            className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden ${bondStrategyMode === s.id ? 'bg-emerald-5 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1"><span className={`text-xs font-bold ${bondStrategyMode === s.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{s.name}</span><span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">{s.value}%</span></div>
                                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight">{s.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in">
                        <div className="flex flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-10 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center">
                            <div>
                                <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Fixed Three-Part Allocation</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">Set your target allocation across bonds, cash equivalents, and stocks. Must total 100%.</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                                {/* Bonds */}
                                <div className="flex flex-col items-center">
                                    <label className="text-xs font-medium text-zinc-500 mb-2">Bonds</label>
                                    <div className="relative w-full">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={bondAllocation}
                                            onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') {
                                                    setBondAllocation('');
                                                    return;
                                                }
                                                let intVal = parseInt(val);
                                                if (isNaN(intVal)) intVal = 0;
                                                if (intVal > 100) intVal = 100;
                                                setBondAllocation(intVal);
                                            }}
                                            className="block w-full px-3 pr-8 py-3 text-xl font-bold text-center border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                        />
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none"><span className="text-zinc-400 text-sm font-medium">%</span></div>
                                    </div>
                                </div>

                                {/* Cash & Equivalents */}
                                <div className="flex flex-col items-center">
                                    <label className="text-xs font-medium text-zinc-500 mb-2">Cash & Equiv.</label>
                                    <div className="relative w-full">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={cashAllocation}
                                            onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') {
                                                    setCashAllocation('');
                                                    return;
                                                }
                                                let intVal = parseInt(val);
                                                if (isNaN(intVal)) intVal = 0;
                                                if (intVal > 100) intVal = 100;
                                                setCashAllocation(intVal);
                                            }}
                                            className="block w-full px-3 pr-8 py-3 text-xl font-bold text-center border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-lg focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 outline-none transition-all"
                                        />
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none"><span className="text-zinc-400 text-sm font-medium">%</span></div>
                                    </div>
                                </div>

                                {/* Equity (Auto-calculated) */}
                                <div className="flex flex-col items-center">
                                    <label className="text-xs font-medium text-zinc-500 mb-2">Equity</label>
                                    <div className="relative w-full">
                                        <div className="block w-full px-3 pr-8 py-3 text-xl font-bold text-center border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                            {Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0))}
                                        </div>
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none"><span className="text-emerald-400 text-sm font-medium">%</span></div>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 mt-1">Auto-calculated</p>
                                </div>
                            </div>
                            {((bondAllocation || 0) + (cashAllocation || 0)) > 100 && (
                                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">
                                    Bonds + Cash cannot exceed 100%
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* EQUITY STRATEGY */}
            <Card className="p-6 overflow-visible">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><PieChartIcon className="w-5 h-5" /></div>
                        <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Equity Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Customize your stock portfolio breakdown.</p></div>
                    </div>
                    <button onClick={resetEquityStrategy} title="Reset to Default" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Undo2 className="w-4 h-4" /></button>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Popular Strategies</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {EQUITY_PRESETS.map(preset => {
                            const isMatch = Object.keys(preset.allocation).length === Object.keys(equityStrategy).length && Object.keys(preset.allocation).every(key => equityStrategy[key] === preset.allocation[key]);
                            return (
                                <button key={preset.name} onClick={() => setEquityStrategy(preset.allocation)} className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden ${isMatch ? 'bg-emerald-5 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}>
                                    <div className="font-bold text-xs text-zinc-800 dark:text-zinc-100 mb-1">{preset.name}</div>
                                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">{preset.desc}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden flex relative mt-6">
                    {Object.entries(equityStrategy).map(([key, val]) => {
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                        if (!asset || val <= 0) return null;
                        return (<div key={key} style={{ width: `${(val / totalEquityAllocation) * 100}%`, backgroundColor: asset.color }} className="h-full transition-all duration-500" />);
                    })}
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Total Allocation</div>
                    <div className={`flex items-center gap-2 ${isEquityValid ? 'text-emerald-600' : 'text-red-500'}`}>
                        {!isEquityValid && <AlertTriangle className="w-4 h-4" />}
                        <span className="font-bold font-mono">{totalEquityAllocation}%</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(equityStrategy).map(([key, val]) => {
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                        if (!asset) return null;
                        return (
                            <div key={key} className="relative group animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>{asset.name}</label>
                                    <button onClick={() => removeEquityAsset(key)} className="text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Asset Class"><X className="w-3 h-3" /></button>
                                </div>
                                <div className="relative">
                                    <input type="number" value={val} onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }} onWheel={(e) => e.target.blur()} onChange={(e) => updateEquityStrategy(key, e.target.value)} className={`block w-full pl-3 pr-8 py-2 border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-md outline-none focus:ring-1 ${isEquityValid ? 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500' : 'border-red-300 focus:border-red-500 focus:ring-red-500'}`} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Percent className="w-3 h-3 text-zinc-400" /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 relative">
                    <button
                        onClick={() => setIsAddingAsset(!isAddingAsset)}
                        className="w-full flex justify-center items-center gap-2 text-sm font-medium text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-2 rounded-md transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Asset Class
                    </button>

                    {isAddingAsset && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsAddingAsset(false)}></div>
                            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-md shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">Available Assets</div>
                                {availableAssets.length > 0 ? availableAssets.map(asset => (
                                    <button key={asset.id} onClick={() => { addEquityAsset(asset.id); setIsAddingAsset(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>{asset.name}</button>
                                )) : (<div className="px-4 py-4 text-sm text-zinc-500 text-center italic">All available asset classes have been added.</div>)}
                            </div>
                        </>
                    )}
                </div>
                {!isEquityValid && (<p className="text-xs text-red-500 mt-4 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">Total equity allocation must equal 100%. Please adjust your values.</p>)}
            </Card>
        </div>
    );
};

export default StrategyConfig;
