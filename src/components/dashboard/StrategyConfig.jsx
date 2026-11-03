
import React from 'react';
import { SlidersHorizontal, Shield, LayoutDashboard, CheckCircle2, Calendar, Activity, Target, Lock, PieChart as PieChartIcon, Undo2, AlertTriangle, Plus, Minus, X, Percent } from 'lucide-react';
import Card from '../ui/Card';
import { TAX_STRATEGIES, REBALANCE_MODES, ASSET_CLASSES, EQUITY_PRESETS } from '../../utils/constants';
import { getSuggestedBondAllocation } from '../../utils/finance';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

const StrategyConfig = ({
    userAge,
    yearsToRetirement,
    retirementYear,
    setRetirementYear,
    emergencyFund,
    setEmergencyFund,
    taxStrategy,
    setTaxStrategy,
    hsaStrategy = 'roth',
    setHsaStrategy,
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
    resetEquityStrategy,
    normalizeEquityStrategy,
    investableTotal = 0
}) => {
    const currentYear = new Date().getFullYear();
    const numericAge = parseInt(userAge) || 0;

    // Calculate synthetic age based on retirement year (Target age 65)
    // If retiring in 20 years, synthetic age is 45.
    const syntheticAge = Math.max(18, Math.min(100, 65 - (retirementYear - currentYear)));

    const totalEquityAllocation = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
    const isEquityValid = Math.abs(totalEquityAllocation - 100) < 0.1;
    const isCustomMode = bondStrategyMode === 'custom';

    const safeAge = Math.max(18, Math.min(100, syntheticAge || numericAge || 35));
    const bondStrategies = React.useMemo(() => [
        { id: 'smart', name: 'Target Date', value: getSuggestedBondAllocation(syntheticAge), desc: `Non-linear glide path based on your 20${retirementYear.toString().slice(-2)} retirement goal.` },
        { id: 'aggressive', name: 'Aggressive', value: Math.max(0, safeAge - 20), desc: 'Set target to Age - 20' },
        { id: 'moderate', name: 'Moderate', value: Math.max(0, safeAge - 10), desc: 'Set target to Age - 10' },
        { id: 'conservative', name: 'Conservative', value: Math.min(100, safeAge), desc: 'Set target to Age' },
    ], [safeAge, syntheticAge, retirementYear]);

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
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Portfolio strategy</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">Define your liquidity guardrails, macro asset split, and tax-location policy.</p>
            </div>

            {/* STAGE 1: FOUNDATIONS */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 px-0.5">
                    <span className="font-mono text-[11px] font-medium text-zinc-400">01</span>
                    <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Planning parameters</h3>
                </div>

                <Card className="p-0 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 dark:divide-zinc-800/80">
                        {/* Emergency Fund */}
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">Emergency reserve target</h4>
                                    <p className="text-[11px] text-zinc-500">Shielded liquidity cushion before investing</p>
                                </div>
                                <Shield className="w-4 h-4 text-zinc-400" />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">$</span>
                                <input
                                    type="number"
                                    value={emergencyFund}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                        setEmergencyFund(typeof val === 'number' ? Math.max(0, val) : val);
                                    }}
                                    className="w-full pl-8 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 rounded-lg font-mono font-semibold text-base tabular-nums focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Retirement Timeline */}
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">Target retirement year</h4>
                                    <p className="text-[11px] text-zinc-500 tabular-nums">{yearsToRetirement} years remaining</p>
                                </div>
                                <Target className="w-4 h-4 text-zinc-400" />
                            </div>
                            <input
                                type="number"
                                value={retirementYear}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || currentYear;
                                    setRetirementYear(Math.max(currentYear, Math.min(currentYear + 80, val)));
                                }}
                                className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 rounded-lg font-mono font-semibold text-base tabular-nums focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 outline-none transition-all"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {/* STAGE 2: MACRO ALLOCATION (THE HUB) */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 px-0.5">
                    <span className="font-mono text-[11px] font-medium text-zinc-400">02</span>
                    <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Macro asset allocation</h3>
                </div>

                <Card className="p-0 overflow-hidden">
                    {/* Bento Macro Summary Strip */}
                    <div className="grid grid-cols-3 divide-x divide-zinc-200/80 dark:divide-zinc-800/80 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
                        {[
                            { label: 'Equities', val: Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0)), dot: 'bg-emerald-600 dark:bg-emerald-500' },
                            { label: 'Fixed income', val: bondAllocation || 0, dot: 'bg-rose-600 dark:bg-rose-500' },
                            { label: 'Cash target', val: cashAllocation || 0, dot: 'bg-slate-400 dark:bg-slate-500' }
                        ].map((item, idx) => (
                            <div key={idx} className="p-5 flex flex-col justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.label}</span>
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight tabular-nums">{item.val}%</span>
                                    {investableTotal > 0 && (
                                        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
                                            {formatCurrency(investableTotal * (item.val / 100))}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Macro Visual Proportion Bar */}
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
                            <div
                                style={{ width: `${Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0))}%` }}
                                className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-300"
                                title={`Stocks: ${Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0))}%`}
                            />
                            <div
                                style={{ width: `${Math.min(100, bondAllocation || 0)}%` }}
                                className="bg-rose-600 dark:bg-rose-500 h-full transition-all duration-300"
                                title={`Bonds: ${bondAllocation || 0}%`}
                            />
                            <div
                                style={{ width: `${Math.min(100, cashAllocation || 0)}%` }}
                                className="bg-slate-400 dark:bg-slate-500 h-full transition-all duration-300"
                                title={`Cash: ${cashAllocation || 0}%`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cash Controls */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                        Portfolio cash target
                                    </h5>
                                    <div className="relative w-20">
                                        <input
                                            type="number"
                                            value={cashAllocation}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setCashAllocation(Math.max(0, Math.min(100, val)));
                                            }}
                                            className="w-full pl-3 pr-6 py-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-mono font-semibold tabular-nums focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 outline-none transition-all"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">%</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="1"
                                    value={Math.min(50, cashAllocation || 0)}
                                    onChange={(e) => setCashAllocation(parseInt(e.target.value) || 0)}
                                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-700 dark:accent-zinc-300"
                                />
                                <p className="text-[11px] text-zinc-500 leading-relaxed">Dry powder held inside investment accounts above your emergency reserve.</p>
                            </div>

                            {/* Bond Selection Controls */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                        Bond allocation mode
                                    </h5>
                                    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                                        <button
                                            onClick={() => { setBondStrategyMode('smart'); setBondAllocation(getSuggestedBondAllocation(syntheticAge)); }}
                                            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${bondStrategyMode === 'smart' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500'}`}
                                        >Glidepath</button>
                                        <button
                                            onClick={() => setBondStrategyMode('custom')}
                                            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${bondStrategyMode !== 'smart' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500'}`}
                                        >Fixed %</button>
                                    </div>
                                </div>

                                {bondStrategyMode === 'smart' ? (
                                    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800">
                                        <div className="flex items-start gap-2.5">
                                            <Activity className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0" />
                                            <div>
                                                <h6 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Target-date glidepath</h6>
                                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                                                    Gradually de-risks as {retirementYear} approaches. Currently targeting <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{getSuggestedBondAllocation(syntheticAge)}%</span> bonds.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5 animate-in fade-in duration-200">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={bondAllocation || 0}
                                                onChange={(e) => {
                                                    setBondAllocation(parseInt(e.target.value) || 0);
                                                    setBondStrategyMode('custom');
                                                }}
                                                className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-200"
                                            />
                                            <div className="relative w-20 shrink-0">
                                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">%</span>
                                                <input
                                                    type="number"
                                                    value={bondAllocation}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        setBondAllocation(Math.max(0, Math.min(100, val)));
                                                        setBondStrategyMode('custom');
                                                    }}
                                                    className="w-full pl-2.5 pr-6 py-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-semibold tabular-nums rounded-md focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {bondStrategies.filter(s => s.id !== 'smart').map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => { setBondAllocation(s.value); setBondStrategyMode('custom'); }}
                                                    className="px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/70 dark:border-zinc-700/80 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 transition-all"
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
                            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg border border-rose-200 dark:border-rose-900/30 font-medium">
                                <AlertTriangle className="w-4 h-4" /> Bonds + Cash cannot exceed 100%
                            </div>
                        )}
                    </div>
                </Card>
            </section>

            {/* STAGE 3: EQUITY STRATEGY */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 px-0.5">
                    <span className="font-mono text-[11px] font-medium text-zinc-400">03</span>
                    <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Equity sleeve breakdown</h3>
                </div>

                <Card className="p-6">
                    <div className="flex flex-col gap-6">
                        {/* Summary & Presets */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Equity weights</h4>
                                    <p className="text-xs text-zinc-500">Relative weights within the stock portion of your portfolio</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono font-semibold text-xs tabular-nums border ${isEquityValid ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200/70 dark:border-zinc-700' : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isEquityValid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        {totalEquityAllocation}% / 100%
                                    </div>
                                    {!isEquityValid && totalEquityAllocation > 0 && (
                                        <button
                                            onClick={normalizeEquityStrategy}
                                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                            title="Rescale all assets proportionally so they sum to exactly 100%"
                                        >
                                            Normalize
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {EQUITY_PRESETS.map(preset => {
                                    const isMatch = Object.keys(preset.allocation).length === Object.keys(equityStrategy).length && Object.keys(preset.allocation).every(key => equityStrategy[key] === preset.allocation[key]);
                                    return (
                                        <button
                                            key={preset.name}
                                            onClick={() => setEquityStrategy(preset.allocation)}
                                            className={`p-3 rounded-lg border text-left transition-all relative ${isMatch ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/70' : 'border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                                        >
                                            <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate mb-0.5">{preset.name}</div>
                                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">{preset.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Bar Chart */}
                            <div className="relative h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
                                {Object.entries(equityStrategy).map(([key, val]) => {
                                    const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                                    if (!asset || val <= 0) return null;
                                    return (<div key={key} style={{ width: `${(val / (totalEquityAllocation || 100)) * 100}%`, backgroundColor: asset.color }} className="h-full transition-all duration-500 ease-out" />);
                                })}
                            </div>
                        </div>

                        {/* Editable Rows */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(equityStrategy).sort((a, b) => b[1] - a[1]).map(([key, val]) => {
                                const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                                if (!asset) return null;
                                const equityMacroPct = Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0)) / 100;
                                const assetDollarTarget = investableTotal > 0 ? investableTotal * equityMacroPct * (val / 100) : 0;

                                return (
                                    <div key={key} className="p-3.5 rounded-lg bg-zinc-50/60 dark:bg-zinc-800/25 border border-zinc-200/70 dark:border-zinc-800 flex items-center gap-3 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                                        <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: asset.color }}></div>
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex justify-between items-center gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{asset.name}</span>
                                                    {investableTotal > 0 && (
                                                        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">
                                                            {formatCurrency(assetDollarTarget)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeEquityAsset(key)}
                                                    className="p-1 text-zinc-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                                    title={`Remove ${asset.name}`}
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    value={Math.min(100, Math.max(0, val || 0))}
                                                    onChange={(e) => updateEquityStrategy(key, e.target.value)}
                                                    style={{ accentColor: asset.color }}
                                                    className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateEquityStrategy(key, Math.max(0, (parseFloat(val) || 0) - 5))}
                                                        className="p-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                                                        title="Decrease by 5%"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <div className="relative w-16">
                                                        <input
                                                            type="number"
                                                            value={val}
                                                            onChange={(e) => updateEquityStrategy(key, e.target.value)}
                                                            className={`w-full pl-2 pr-5 py-1 bg-white dark:bg-zinc-900 border rounded text-xs font-mono font-semibold tabular-nums text-right focus:ring-1 outline-none transition-all ${isEquityValid ? 'border-zinc-200 dark:border-zinc-700 focus:ring-zinc-900' : 'border-rose-300 focus:ring-rose-500 text-rose-600'}`}
                                                        />
                                                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400">%</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateEquityStrategy(key, Math.min(100, (parseFloat(val) || 0) + 5))}
                                                        className="p-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                                                        title="Increase by 5%"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add Asset Toggle */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsAddingAsset(!isAddingAsset)}
                                    className="w-full h-full min-h-[64px] flex items-center justify-center gap-1.5 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-xs font-medium">Add asset class</span>
                                </button>

                                {isAddingAsset && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsAddingAsset(false)}></div>
                                        <div className="absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-zinc-950 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                                            <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900">
                                                {availableAssets.map(asset => (
                                                    <button
                                                        key={asset.id}
                                                        onClick={() => { addEquityAsset(asset.id); setIsAddingAsset(false); }}
                                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center justify-between group/item"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>
                                                            <span className="font-medium text-zinc-700 dark:text-zinc-200">{asset.name}</span>
                                                        </div>
                                                        <Plus className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover/item:opacity-100" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {!isEquityValid && (
                            <div className="bg-rose-50 dark:bg-rose-950/20 p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/30 flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-medium">Total equity allocation must equal 100%.</span>
                            </div>
                        )}
                    </div>
                </Card>
            </section>

            {/* STAGE 4: TAX OPTIMIZATION */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 px-0.5">
                    <span className="font-mono text-[11px] font-medium text-zinc-400">04</span>
                    <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Asset location & tax placement</h3>
                </div>

                <Card className="p-6">
                    <div className="mb-5">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Asset location strategy</h4>
                        <p className="text-xs text-zinc-500">Rules for placing assets across Taxable, Traditional, and Roth accounts</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {Object.values(TAX_STRATEGIES).map(strategy => {
                            const isSelected = taxStrategy === strategy.id;
                            return (
                                <button
                                    key={strategy.id}
                                    onClick={() => setTaxStrategy(strategy.id)}
                                    className={`group p-4 rounded-xl border text-left transition-all ${
                                        isSelected
                                            ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/60'
                                            : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg border ${
                                            isSelected
                                                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                                                : 'bg-zinc-100 text-zinc-500 border-zinc-200/60 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700/60'
                                        }`}>
                                            <strategy.icon className="w-4 h-4" />
                                        </div>
                                        {isSelected && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm font-semibold tracking-tight mb-1 text-zinc-900 dark:text-zinc-50">{strategy.name}</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{strategy.desc}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* HSA Treatment Selection */}
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Health Savings Account (HSA) treatment</h4>
                            <p className="text-xs text-zinc-500">Choose whether HSAs are treated as long-term tax-free growth or conservative medical liquidity</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <button
                                type="button"
                                onClick={() => setHsaStrategy && setHsaStrategy('roth')}
                                className={`group p-4 rounded-xl border text-left transition-all ${
                                    hsaStrategy === 'roth'
                                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/60'
                                        : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700">
                                        Tax-free growth (Super Roth)
                                    </span>
                                    {hsaStrategy === 'roth' && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="font-semibold text-sm tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
                                    Maximize Triple-Tax-Free Compounding
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    Treats the HSA like a Roth IRA. Prioritizes high-growth equities in your HSA to maximize compounding, and keeps bonds in Traditional accounts.
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setHsaStrategy && setHsaStrategy('deferred')}
                                className={`group p-4 rounded-xl border text-left transition-all ${
                                    hsaStrategy === 'deferred'
                                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/60'
                                        : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700">
                                        Capital preservation (Deferred)
                                    </span>
                                    {hsaStrategy === 'deferred' && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="font-semibold text-sm tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
                                    Healthcare Reserve Protection
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    Treats the HSA like a Traditional IRA/401(k). Bonds and defensive assets may be placed here to preserve capital for near-term medical expenses.
                                </div>
                            </button>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default StrategyConfig;
