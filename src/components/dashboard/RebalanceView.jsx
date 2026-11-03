
import React, { useState, useMemo } from 'react';
import { Scale, CheckCircle2, Shield, AlertCircle, ArrowDownRight, ArrowUpRight, Wallet, ShieldCheck, Layers, Copy, Check, Sparkles, Calculator, CheckSquare, Square } from 'lucide-react';
import Card from '../ui/Card';
import { REBALANCE_MODES, ACCOUNT_CREATION_OPTIONS, ASSET_CLASSES } from '../../utils/constants';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const RebalanceView = ({
    accounts,
    rebalanceModeTaxable,
    setRebalanceModeTaxable,
    rebalanceModeSheltered,
    setRebalanceModeSheltered,
    rebalancingPlan,
    setActiveTab,
    equityStrategy,
    hsaStrategy = 'roth',
    applyRebalanceTrades,
    portfolioMetrics,
    bondAllocation = 0,
    cashAllocation = 0
}) => {
    const [checkedTrades, setCheckedTrades] = useState({});
    const [copiedKey, setCopiedKey] = useState(null);
    const [simulatedDeposit, setSimulatedDeposit] = useState('');
    const [showSimulator, setShowSimulator] = useState(false);

    const hasAccounts = Object.keys(accounts).length > 0;
    const isEquityValid = equityStrategy && Math.abs(Object.values(equityStrategy).reduce((a, b) => a + b, 0) - 100) < 0.1;

    const toggleTradeChecked = (key) => {
        setCheckedTrades(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCopyAmount = (e, key, amount) => {
        e.stopPropagation();
        const rawNumber = Math.round(Math.abs(amount)).toString();
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(rawNumber);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        }
    };

    // "What-If" Cash Contribution Simulator calculation
    const simulatedBuys = useMemo(() => {
        const deposit = parseFloat(simulatedDeposit) || 0;
        if (deposit <= 0 || !portfolioMetrics) return [];

        const currentInvestable = portfolioMetrics.investableTotal || 0;
        const newTotal = currentInvestable + deposit;
        const currentAlloc = portfolioMetrics.currentAllocation || {};

        const targetBondRatio = (bondAllocation || 0) / 100;
        const targetCashRatio = (cashAllocation || 0) / 100;
        const targetEquityRatio = Math.max(0, 1 - targetBondRatio - targetCashRatio);

        const deficits = [];
        Object.values(ASSET_CLASSES).forEach(asset => {
            if (asset.id === 'money_market') return; // Handled via 'cash'
            let targetWeight = 0;
            if (asset.id === 'cash') {
                targetWeight = targetCashRatio;
            } else if (asset.id === 'bonds') {
                targetWeight = targetBondRatio;
            } else {
                const eqPct = (equityStrategy?.[asset.id] || 0) / 100;
                targetWeight = targetEquityRatio * eqPct;
            }

            const targetDollars = newTotal * targetWeight;
            const currentDollars = currentAlloc[asset.id] || 0;
            const shortfall = Math.max(0, targetDollars - currentDollars);
            if (shortfall > 1) {
                deficits.push({
                    id: asset.id,
                    name: asset.name,
                    color: asset.color,
                    shortfall
                });
            }
        });

        const totalShortfall = deficits.reduce((s, d) => s + d.shortfall, 0);
        if (totalShortfall <= 0) return [];

        return deficits
            .map(d => ({
                ...d,
                buyAmount: deposit * (d.shortfall / totalShortfall),
                sharePct: (d.shortfall / totalShortfall) * 100
            }))
            .filter(d => d.buyAmount >= 1)
            .sort((a, b) => b.buyAmount - a.buyAmount);
    }, [simulatedDeposit, portfolioMetrics, bondAllocation, cashAllocation, equityStrategy]);

    if (!hasAccounts) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
                    <Scale className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">No Rebalancing Needed</h3>
                <p className="text-zinc-500 max-w-md mt-2">Please add accounts and funds to see your action plan.</p>
                <button onClick={() => setActiveTab('accounts')} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Go to Accounts</button>
            </div>
        );
    }

    const { efAction, accountActions } = rebalancingPlan;
    const hasActions = Object.values(accountActions).some(p => p.actions.length > 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Rebalance & execution</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Configure rebalancing rules by account tax treatment and review your execution trade sheet.</p>
            </div>

            {!isEquityValid && (
                <Card className="p-4 bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/70">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-semibold text-rose-900 dark:text-rose-100">Invalid strategy allocation</h4>
                            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                                Your equity asset allocation does not sum to 100%. Fix your weights in Strategy before executing trades.
                            </p>
                            <button onClick={() => setActiveTab('configure')} className="mt-2.5 px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold rounded-md hover:opacity-90 transition-opacity">Open Strategy</button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Unified Bento Rebalance Configuration */}
            <Card className="p-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/80 dark:divide-zinc-800/80">
                    {/* Taxable Strategy */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Taxable brokerage</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Rebalancing discipline for taxable accounts</p>
                            </div>
                            <Wallet className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="space-y-2">
                            {Object.values(REBALANCE_MODES).map(mode => {
                                const isSelected = rebalanceModeTaxable === mode.id;
                                return (
                                    <button
                                        key={`taxable-${mode.id}`}
                                        onClick={() => setRebalanceModeTaxable(mode.id)}
                                        className={`w-full relative p-3 rounded-lg border text-left transition-all ${
                                            isSelected
                                                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/60'
                                                : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <mode.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                                            <span className={`text-xs font-semibold ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>{mode.name}</span>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug pr-5 pl-5">{mode.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tax Advantaged Strategy */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tax-advantaged retirement</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Rebalancing discipline for IRAs, 401(k)s, and HSAs</p>
                            </div>
                            <ShieldCheck className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="space-y-2">
                            {Object.values(REBALANCE_MODES).map(mode => {
                                const isSelected = rebalanceModeSheltered === mode.id;
                                return (
                                    <button
                                        key={`sheltered-${mode.id}`}
                                        onClick={() => setRebalanceModeSheltered(mode.id)}
                                        className={`w-full relative p-3 rounded-lg border text-left transition-all ${
                                            isSelected
                                                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/60'
                                                : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <mode.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                                            <span className={`text-xs font-semibold ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>{mode.name}</span>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug pr-5 pl-5">{mode.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Individual Stocks Notice */}
            {Object.values(accounts).some(acc => acc.funds?.some(f => f.type === 'individual_stock')) && (
                <div className="px-4 py-3 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Individual stocks detected:</span> Individual equities are rebalanced by total value only; tax-location optimization applies to index funds.
                    </p>
                </div>
            )}

            {/* "What-If" Cash Contribution Simulator */}
            <Card className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                            <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                Cash contribution simulator
                                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700">What-if</span>
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Preview how to allocate a fresh deposit into your most underweight assets without selling.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSimulator(!showSimulator)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto shrink-0"
                    >
                        {showSimulator ? 'Hide simulator' : 'Simulate deposit'}
                    </button>
                </div>

                {showSimulator && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">$</span>
                                <input
                                    type="number"
                                    value={simulatedDeposit}
                                    onChange={(e) => setSimulatedDeposit(e.target.value)}
                                    placeholder="e.g. 2500"
                                    className="w-full pl-7 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono font-semibold tabular-nums focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 outline-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {[500, 1000, 2500, 5000, 10000].map(preset => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setSimulatedDeposit(preset.toString())}
                                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium tabular-nums border transition-all ${parseFloat(simulatedDeposit) === preset ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900' : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'}`}
                                    >
                                        +{formatCurrency(preset)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {parseFloat(simulatedDeposit) > 0 && (
                            simulatedBuys.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                    {simulatedBuys.map(item => (
                                        <div key={item.id} className="p-3 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.name}</div>
                                                    <div className="text-[10px] font-mono text-zinc-400 tabular-nums">{item.sharePct.toFixed(0)}% of deposit</div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                                                +{formatCurrency(item.buyAmount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 italic">Enter a valid strategy target to see suggested buys.</p>
                            )
                        )}
                    </div>
                )}
            </Card>

            {/* Portfolio Rebalance Summary */}
            {(() => {
                const { globalBandsTriggered } = rebalancingPlan;
                const allActionsWithKeys = Object.entries(accountActions).flatMap(([accId, p]) =>
                    p.actions.map((a, idx) => ({ ...a, key: `${accId}_${a.assetId}_${idx}` }))
                );
                const totalBuys = allActionsWithKeys.filter(a => a.diff > 0).reduce((s, a) => s + a.diff, 0);
                const totalSells = allActionsWithKeys.filter(a => a.diff < 0).reduce((s, a) => s + Math.abs(a.diff), 0);
                const tradeCount = allActionsWithKeys.length;
                const completedCount = allActionsWithKeys.filter(a => checkedTrades[a.key]).length;
                const activeAccountCount = Object.values(accountActions).filter(p => p.actions.length > 0).length;

                const eitherIsBands = rebalanceModeTaxable === 'bands' || rebalanceModeSheltered === 'bands';
                const isInflowOnly = rebalanceModeTaxable === 'inflow' && rebalanceModeSheltered === 'inflow';
                const volume = isInflowOnly ? totalBuys : Math.max(totalBuys, totalSells);
                const volumeLabel = isInflowOnly ? 'Total to invest' : 'Rebalancing turnover';

                if (!eitherIsBands && tradeCount === 0) return null;

                return (
                    <Card className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                Execution summary
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                                    {tradeCount > 0
                                        ? `${completedCount}/${tradeCount} completed · ${activeAccountCount} account${activeAccountCount !== 1 ? 's' : ''}`
                                        : 'No trades required'}
                                </span>
                                {tradeCount > 0 && applyRebalanceTrades && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            applyRebalanceTrades();
                                            setCheckedTrades({});
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-all active:scale-95"
                                        title="Update your account holdings automatically to match the target balances below"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Apply trades to accounts
                                    </button>
                                )}
                            </div>
                        </div>

                        {tradeCount > 0 && (
                            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${(completedCount / tradeCount) * 100}%` }}
                                />
                            </div>
                        )}

                        {eitherIsBands && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs font-medium bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${globalBandsTriggered ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                {globalBandsTriggered
                                    ? '5/25 drift corridor exceeded — rebalancing recommended'
                                    : 'Portfolio within 5/25 drift corridor — no action needed'}
                            </div>
                        )}

                        {tradeCount > 0 && (
                            <div className="bg-zinc-50/70 dark:bg-zinc-800/30 rounded-lg p-3.5 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] text-zinc-500 mb-0.5">{volumeLabel}</div>
                                    <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{formatCurrency(volume)}</div>
                                </div>
                                <div className="text-right text-xs text-zinc-400">
                                    Click any trade row below to mark it executed
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })()}

            {/* EMERGENCY FUND STATUS SECTION */}
            {efAction && (
                <Card className="p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${efAction.status === 'deficit' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                Emergency reserve status
                            </h3>
                            <p className="text-xs text-zinc-500 mt-0.5 pl-3.5">
                                {efAction.status === 'balanced' && "Your emergency reserves match your target cushion."}
                                {efAction.status === 'deficit' && "Your emergency reserve is below your target cushion."}
                                {efAction.status === 'surplus' && "Excess emergency cash above your target is included in your investable portfolio."}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-mono font-semibold tabular-nums ${efAction.status === 'deficit' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {efAction.status === 'balanced' ? 'Funded' : formatCurrency(efAction.diff)}
                            </div>
                            {efAction.status !== 'balanced' && (
                                <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                                    {efAction.status === 'deficit' ? 'Shortfall' : 'Spillover'}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-5">
                {Object.entries(accountActions).map(([accId, plan]) => {
                    const accountData = accounts[accId];
                    const typeOption = ACCOUNT_CREATION_OPTIONS.find(o => o.id === accountData?.typeId);
                    const Icon = typeOption ? typeOption.icon : Wallet;

                    const activeMode = accountData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;

                    return (
                        <Card key={accId} className="overflow-visible">
                            <div className="px-5 py-3.5 bg-zinc-50/50 dark:bg-zinc-900 border-b border-zinc-200/70 dark:border-zinc-800 flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60">
                                        <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{accountData.name}</h3>
                                        <p className="text-[11px] font-mono text-zinc-500">
                                            {accountData.typeId === 'hsa' ? (hsaStrategy === 'roth' ? 'roth (hsa)' : 'deferred (hsa)') : accountData.taxType}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300">
                                    {REBALANCE_MODES[activeMode.toUpperCase()]?.name || activeMode}
                                </div>
                            </div>
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                                {plan.actions.length === 0 ? (
                                    <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
                                        <p className="text-xs">No trades needed — this account is aligned with target.</p>
                                    </div>
                                ) : (
                                    plan.actions.map((action, idx) => {
                                        const isBuy = action.diff > 0;
                                        const tradeKey = `${accId}_${action.assetId}_${idx}`;
                                        const isChecked = !!checkedTrades[tradeKey];

                                        // Look up existing tickers in this account for this asset class
                                        const matchingTickers = (accountData.funds || [])
                                            .filter(f => !f.isEmergency && f.name && (f.type === action.assetId || (action.assetId === 'cash' && f.type === 'money_market')))
                                            .map(f => f.name.trim())
                                            .filter(Boolean);

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => toggleTradeChecked(tradeKey)}
                                                className={`px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all cursor-pointer group ${isChecked ? 'opacity-45 bg-zinc-50/50 dark:bg-zinc-900/40' : ''}`}
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); toggleTradeChecked(tradeKey); }}
                                                        className={`text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0 ${isChecked ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                                                        aria-label="Mark trade completed"
                                                    >
                                                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                                    </button>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase ${
                                                                isBuy
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60'
                                                                    : 'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60'
                                                            }`}>
                                                                {action.action}
                                                            </span>
                                                            <span className={`text-xs font-semibold text-zinc-900 dark:text-zinc-100 ${isChecked ? 'line-through' : ''}`}>
                                                                {action.assetName}
                                                            </span>
                                                            {matchingTickers.length > 0 && (
                                                                <span className="text-[11px] font-mono font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700">
                                                                    {matchingTickers.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] font-mono text-zinc-400 mt-0.5 tabular-nums">
                                                            {formatCurrency(action.current)} &rarr; {formatCurrency(action.target)}
                                                            {action.explanation && <span className="font-sans ml-2 text-zinc-500">· {action.explanation}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 ml-3">
                                                    <div className={`text-sm font-mono font-semibold tabular-nums ${isChecked ? 'line-through text-zinc-400' : isBuy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                        }`}>
                                                        {(isBuy ? '+' : '') + formatCurrency(action.diff)}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleCopyAmount(e, tradeKey, action.diff)}
                                                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                                                        title="Copy dollar amount"
                                                    >
                                                        {copiedKey === tradeKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </Card>
                    );
                })}
                {!hasActions && (
                    <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Portfolio aligned</h3>
                        <p className="text-xs text-zinc-500 max-w-md mx-auto px-4 mt-0.5">Your investment portfolio is within target ranges. No trades required.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RebalanceView;
