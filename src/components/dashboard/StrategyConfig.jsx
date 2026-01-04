
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

    // Calculate synthetic age based on retirement year (Target age 65)
    // If retiring in 20 years, synthetic age is 45.
    const syntheticAge = Math.max(18, Math.min(100, 65 - (retirementYear - currentYear)));

    const totalEquityAllocation = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
    const isEquityValid = Math.abs(totalEquityAllocation - 100) < 0.1;
    const isCustomMode = bondStrategyMode === 'custom';

    const bondStrategies = React.useMemo(() => [
        { id: 'smart', name: 'Target Date', value: getSuggestedBondAllocation(syntheticAge), desc: `Non-linear glide path based on your 20${retirementYear.toString().slice(-2)} retirement goal.` },
        { id: 'aggressive', name: 'Aggressive', value: Math.max(0, numericAge - 20), desc: 'Set target to Age - 20' },
        { id: 'moderate', name: 'Moderate', value: Math.max(0, numericAge - 10), desc: 'Set target to Age - 10' },
        { id: 'conservative', name: 'Conservative', value: Math.min(100, numericAge), desc: 'Set target to Age' },
    ], [numericAge, syntheticAge, retirementYear]);

    // Sync bond allocation ONLY for Dynamic (smart) mode
    React.useEffect(() => {
        if (bondStrategyMode === 'smart') {
            const activeStrategy = bondStrategies.find(s => s.id === 'smart');
            if (activeStrategy && activeStrategy.value !== bondAllocation) {
                setBondAllocation(activeStrategy.value);
            }
        }
    }, [bondStrategyMode, bondStrategies, setBondAllocation, bondAllocation]);

    const availableAssets = Object.values(ASSET_CLASSES).filter(a => a.id !== 'cash' && a.id !== 'money_market' && a.id !== 'bonds' && equityStrategy[a.id] === undefined);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Portfolio Strategy</h2>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm ml-12">Define your financial guardrails and investment philosophy.</p>
            </div>

            {/* STAGE 1: FOUNDATIONS */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-[10px] font-bold text-white dark:text-zinc-900">1</span>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Planning Parameters</h3>
                </div>

                <Card className="p-0 overflow-hidden border-none shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
                        {/* Emergency Fund */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100">Emergency Fund</h4>
                                    <p className="text-xs text-zinc-500">Target liquidity cushion</p>
                                </div>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                                <input
                                    type="number"
                                    value={emergencyFund}
                                    onChange={(e) => setEmergencyFund(e.target.value === '' ? '' : parseInt(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Retirement Timeline */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100">Retirement Year</h4>
                                    <p className="text-xs text-zinc-500">{yearsToRetirement} years remaining</p>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={retirementYear}
                                onChange={(e) => setRetirementYear(parseInt(e.target.value) || currentYear)}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {/* STAGE 2: MACRO ALLOCATION (THE HUB) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-[10px] font-bold text-white dark:text-zinc-900">2</span>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Asset Allocation</h3>
                </div>

                <Card className="p-8 border-none shadow-2xl shadow-emerald-900/5 dark:shadow-none bg-white dark:bg-zinc-900">
                    <div className="space-y-8">
                        {/* Macro Dashboard */}
                        <div className="bg-zinc-50 dark:bg-zinc-800/30 p-1 rounded-2xl flex md:flex-row flex-col gap-1">
                            {[
                                { label: 'Stocks', val: Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0)), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-white dark:bg-zinc-900 shadow-sm border border-emerald-100 dark:border-emerald-900/30' },
                                { label: 'Bonds', val: bondAllocation, color: 'text-red-600 dark:text-red-400', bg: 'bg-transparent' },
                                { label: 'Cash', val: cashAllocation, color: 'text-zinc-600 dark:text-zinc-300', bg: 'bg-transparent' }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex-1 p-4 rounded-xl text-center flex flex-col items-center justify-center ${item.bg}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{item.label}</span>
                                    <span className={`text-3xl font-black ${item.color}`}>{item.val}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Cash Controls */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
                                        Cash Target
                                    </h5>
                                    <div className="relative w-20">
                                        <input
                                            type="number"
                                            value={cashAllocation}
                                            onChange={(e) => setCashAllocation(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full pl-3 pr-7 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold">%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed italic">Held for short-term liquidity and opportunistic buying.</p>
                            </div>

                            {/* Bond Selection Controls */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-red-400 dark:bg-red-600 rounded-full"></div>
                                        Bond Strategy
                                    </h5>
                                    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                                        <button
                                            onClick={() => { setBondStrategyMode('smart'); setBondAllocation(getSuggestedBondAllocation(syntheticAge)); }}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${bondStrategyMode === 'smart' ? 'bg-white dark:bg-zinc-700 text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                                        >DYNAMIC</button>
                                        <button
                                            onClick={() => setBondStrategyMode('custom')}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${bondStrategyMode !== 'smart' ? 'bg-white dark:bg-zinc-700 text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                                        >FIXED</button>
                                    </div>
                                </div>

                                {bondStrategyMode === 'smart' ? (
                                    <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 animate-in zoom-in-95 duration-200">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mt-0.5">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h6 className="text-xs font-bold text-red-800 dark:text-red-200 mb-1">Target Date Glide Path</h6>
                                                <p className="text-[10px] text-red-700/70 dark:text-red-400/70 leading-relaxed">
                                                    Automatically adjusts your risk lower as 20{retirementYear.toString().slice(-2)} approaches. Currently targeting <strong>{getSuggestedBondAllocation(syntheticAge)}%</strong> bonds.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in duration-300">
                                        <div className="relative">
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">%</span>
                                            <input
                                                type="number"
                                                value={bondAllocation}
                                                onChange={(e) => { setBondAllocation(parseInt(e.target.value) || 0); setBondStrategyMode('custom'); }}
                                                className="w-full pl-4 pr-10 py-2.5 bg-red-50/30 dark:bg-red-950/10 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-red-200"
                                                placeholder="Set fixed %"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {bondStrategies.filter(s => s.id !== 'smart').map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => { setBondAllocation(s.value); setBondStrategyMode('custom'); }}
                                                    className="px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 transition-all active:scale-95"
                                                    title={s.desc}
                                                >
                                                    {s.name} <span className="text-zinc-400 font-mono ml-1">{s.value}%</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {((bondAllocation || 0) + (cashAllocation || 0)) > 100 && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-900/30 font-bold animate-pulse">
                                <AlertTriangle className="w-4 h-4" /> Bonds + Cash cannot exceed 100%
                            </div>
                        )}
                    </div>
                </Card>
            </section>

            {/* STAGE 3: EQUITY STRATEGY */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-[10px] font-bold text-white dark:text-zinc-900">3</span>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Equity Strategy</h3>
                </div>

                <Card className="p-8 border-none shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
                    <div className="flex flex-col gap-10">
                        {/* Summary & Presets */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100">Asset Selection</h4>
                                    <p className="text-xs text-zinc-500">How your stock portfolio is sliced</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${isEquityValid ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-red-50 text-red-500 dark:bg-red-950/20'}`}>
                                    {totalEquityAllocation}% / 100%
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {EQUITY_PRESETS.map(preset => {
                                    const isMatch = Object.keys(preset.allocation).length === Object.keys(equityStrategy).length && Object.keys(preset.allocation).every(key => equityStrategy[key] === preset.allocation[key]);
                                    return (
                                        <button
                                            key={preset.name}
                                            onClick={() => setEquityStrategy(preset.allocation)}
                                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${isMatch ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-zinc-100 dark:border-zinc-800 hover:border-emerald-200'}`}
                                        >
                                            <div className="font-bold text-[10px] text-zinc-800 dark:text-zinc-100 truncate mb-1">{preset.name}</div>
                                            <div className="text-[8px] text-zinc-400 leading-tight line-clamp-2">{preset.desc}</div>
                                            {isMatch && <CheckCircle2 className="absolute -right-2 -bottom-2 w-8 h-8 text-emerald-500/10" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Bar Chart */}
                            <div className="relative h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                                {Object.entries(equityStrategy).map(([key, val]) => {
                                    const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                                    if (!asset || val <= 0) return null;
                                    return (<div key={key} style={{ width: `${(val / totalEquityAllocation) * 100}%`, backgroundColor: asset.color }} className="h-full transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full" />);
                                })}
                            </div>
                        </div>

                        {/* Editable Rows */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {Object.entries(equityStrategy).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
                                const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                                if (!asset) return null;
                                return (
                                    <div key={key} className="flex items-center gap-4 group">
                                        <div className="w-1.5 h-10 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: asset.color }}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{asset.name}</span>
                                                <button onClick={() => removeEquityAsset(key)} className="p-1 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={(e) => updateEquityStrategy(key, e.target.value)}
                                                    className={`w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 border rounded-lg text-sm font-bold focus:ring-1 outline-none transition-all ${isEquityValid ? 'border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500' : 'border-red-200 focus:ring-red-500 text-red-600'}`}
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add Asset Toggle */}
                            <div className="relative pt-6 md:pt-0">
                                <button
                                    onClick={() => setIsAddingAsset(!isAddingAsset)}
                                    className="w-full h-full min-h-[64px] flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-400 hover:text-emerald-500 hover:border-emerald-300 dark:hover:border-emerald-900 transition-all group"
                                >
                                    <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Add Asset</span>
                                </button>

                                {isAddingAsset && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsAddingAsset(false)}></div>
                                        <div className="absolute left-0 right-0 bottom-full mb-3 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                                            <div className="max-h-60 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-900">
                                                {availableAssets.map(asset => (
                                                    <button
                                                        key={asset.id}
                                                        onClick={() => { addEquityAsset(asset.id); setIsAddingAsset(false); }}
                                                        className="w-full text-left px-5 py-3 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center justify-between group/item"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>
                                                            <span className="font-semibold text-zinc-700 dark:text-zinc-200">{asset.name}</span>
                                                        </div>
                                                        <Plus className="w-3 h-3 text-zinc-300 opacity-0 group-hover/item:opacity-100" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {!isEquityValid && (
                            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span className="text-xs font-bold leading-tight">Total allocation must equal 100%. Please rebalance your percentages above.</span>
                            </div>
                        )}
                    </div>
                </Card>
            </section>

            {/* STAGE 4: TAX OPTIMIZATION */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-[10px] font-bold text-white dark:text-zinc-900">4</span>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Asset Location</h3>
                </div>

                <Card className="p-8 border-none shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
                    <div className="mb-8">
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-100">Asset Location Strategy</h4>
                        <p className="text-xs text-zinc-500">How we distribute assets across account types</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(TAX_STRATEGIES).map(strategy => (
                            <button
                                key={strategy.id}
                                onClick={() => setTaxStrategy(strategy.id)}
                                className={`group p-5 rounded-2xl border-2 text-left transition-all ${taxStrategy === strategy.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-zinc-100 dark:border-zinc-800 hover:border-emerald-200'}`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${taxStrategy === strategy.id ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                        <strategy.icon className="w-5 h-5" />
                                    </div>
                                    {taxStrategy === strategy.id && <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                                </div>
                                <div className={`font-black tracking-tight mb-2 ${taxStrategy === strategy.id ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-700 dark:text-zinc-300'}`}>{strategy.name}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium line-clamp-3">{strategy.desc}</div>
                            </button>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default StrategyConfig;
