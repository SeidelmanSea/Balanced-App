
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {!isEquityValid && (
                <Card className="p-4 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-red-900 dark:text-red-100">Invalid Strategy Allocation</h4>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                Your equity asset allocation does not sum to exactly 100%. The rebalancing calculations below may be incorrect until you fix this.
                            </p>
                            <button onClick={() => setActiveTab('configure')} className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">Go to Strategy</button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Rebalance Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Taxable Strategy */}
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Wallet className="w-5 h-5" /></div>
                        <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Brokerage Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Rebalancing rules for taxable accounts.</p></div>
                    </div>
                    <div className="space-y-2">
                        {Object.values(REBALANCE_MODES).map(mode => (
                            <button
                                key={`taxable-${mode.id}`}
                                onClick={() => setRebalanceModeTaxable(mode.id)}
                                className={`w-full relative p-3 rounded-lg border text-left transition-all ${rebalanceModeTaxable === mode.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300'}`}
                            >
                                {rebalanceModeTaxable === mode.id && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 className="w-4 h-4" /></div>}
                                <div className="flex items-center gap-2 mb-1">
                                    <mode.icon className={`w-4 h-4 ${rebalanceModeTaxable === mode.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`} />
                                    <span className={`text-sm font-bold ${rebalanceModeTaxable === mode.id ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'}`}>{mode.name}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight pr-6">{mode.desc}</p>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Tax Advantaged Strategy */}
                <Card className="p-6 border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><ShieldCheck className="w-5 h-5" /></div>
                        <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Retirement Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Rebalancing rules for IRAs and 401ks.</p></div>
                    </div>
                    <div className="space-y-2">
                        {Object.values(REBALANCE_MODES).map(mode => (
                            <button
                                key={`sheltered-${mode.id}`}
                                onClick={() => setRebalanceModeSheltered(mode.id)}
                                className={`w-full relative p-3 rounded-lg border text-left transition-all ${rebalanceModeSheltered === mode.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300'}`}
                            >
                                {rebalanceModeSheltered === mode.id && <div className="absolute top-2 right-2 text-indigo-600"><CheckCircle2 className="w-4 h-4" /></div>}
                                <div className="flex items-center gap-2 mb-1">
                                    <mode.icon className={`w-4 h-4 ${rebalanceModeSheltered === mode.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                                    <span className={`text-sm font-bold ${rebalanceModeSheltered === mode.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'}`}>{mode.name}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight pr-6">{mode.desc}</p>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Individual Stocks Notice */}
            {Object.values(accounts).some(acc => acc.funds?.some(f => f.type === 'individual_stock')) && (
                <Card className="p-4 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">Individual Stocks Detected</h4>
                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                                Individual stocks are rebalanced by total value only. Tax-efficient location strategies apply to index funds only.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* "What-If" Cash Contribution Simulator */}
            <Card className="p-5 border-l-4 border-l-teal-500 bg-white dark:bg-zinc-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                            <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                New Cash Contribution Simulator
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">What-If</span>
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Preview how to allocate a fresh deposit into your most underweight assets without selling.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSimulator(!showSimulator)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto shrink-0"
                    >
                        {showSimulator ? 'Hide Simulator' : 'Simulate Deposit'}
                    </button>
                </div>

                {showSimulator && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={simulatedDeposit}
                                    onChange={(e) => setSimulatedDeposit(e.target.value)}
                                    placeholder="e.g. 2500"
                                    className="w-full pl-8 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold tabular-nums focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {[500, 1000, 2500, 5000, 10000].map(preset => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setSimulatedDeposit(preset.toString())}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold tabular-nums border transition-all ${parseFloat(simulatedDeposit) === preset ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'}`}
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
                                        <div key={item.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.name}</div>
                                                    <div className="text-[10px] text-zinc-400 tabular-nums">{item.sharePct.toFixed(0)}% of deposit</div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
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

                // Determine if either mode uses bands
                const eitherIsBands = rebalanceModeTaxable === 'bands' || rebalanceModeSheltered === 'bands';
                // Inflow-only: both modes are 'inflow'
                const isInflowOnly = rebalanceModeTaxable === 'inflow' && rebalanceModeSheltered === 'inflow';

                // The "volume" number: in inflow mode, just buys; otherwise the rebalancing turnover
                const volume = isInflowOnly ? totalBuys : Math.max(totalBuys, totalSells);
                const volumeLabel = isInflowOnly ? 'Total to Invest' : 'Rebalancing Volume';

                // Show the card if: there are trades, OR if bands mode is active (to show "within bands" status)
                if (!eitherIsBands && tradeCount === 0) return null;

                return (
                    <Card className="p-5 border-l-4 border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                Portfolio Summary
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tabular-nums">
                                    {tradeCount > 0
                                        ? `${completedCount}/${tradeCount} completed across ${activeAccountCount} account${activeAccountCount !== 1 ? 's' : ''}`
                                        : 'No trades required'}
                                </span>
                                {tradeCount > 0 && applyRebalanceTrades && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            applyRebalanceTrades();
                                            setCheckedTrades({});
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                                        title="Update your account holdings automatically to match the target balances below"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Apply Trades to Accounts
                                    </button>
                                )}
                            </div>
                        </div>

                        {tradeCount > 0 && (
                            <div className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${(completedCount / tradeCount) * 100}%` }}
                                />
                            </div>
                        )}

                        {/* Bands status badge — only shown when at least one mode is 'bands' */}
                        {eitherIsBands && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-sm font-semibold
                                ${globalBandsTriggered
                                    ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                                    : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                }`}
                            >
                                {globalBandsTriggered ? (
                                    <>
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        Drift bands exceeded — rebalancing recommended
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                        Portfolio within drift bands — no action needed
                                    </>
                                )}
                            </div>
                        )}

                        {/* Volume — only show if there are trades */}
                        {tradeCount > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{volumeLabel}</div>
                                    <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tabular-nums">{formatCurrency(volume)}</div>
                                </div>
                                <div className="text-right text-xs text-zinc-400">
                                    Click any trade row below to check it off as you execute
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })()}

            {/* EMERGENCY FUND STATUS SECTION */}
            {efAction && (
                <Card className={`p-6 border-l-4 ${efAction.status === 'surplus' ? 'border-l-emerald-500' : (efAction.status === 'deficit' ? 'border-l-red-500' : 'border-l-zinc-400')}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-zinc-500" /> Emergency Fund Action
                            </h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                {efAction.status === 'balanced' && "Your emergency reserves are on target."}
                                {efAction.status === 'deficit' && "Your emergency fund is below target."}
                                {efAction.status === 'surplus' && "You have excess cash in your emergency fund."}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-2xl font-bold tabular-nums ${efAction.status === 'deficit' ? 'text-red-600' : 'text-emerald-600'}`}>
                                {efAction.status === 'balanced' ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : formatCurrency(efAction.diff)}
                            </div>
                            {efAction.status !== 'balanced' && (
                                <div className="text-xs font-bold uppercase tracking-wider mt-1">
                                    {efAction.status === 'deficit' ? 'DEPOSIT NEEDED' : 'INVESTABLE SURPLUS'}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(accountActions).map(([accId, plan]) => {
                    const accountData = accounts[accId];
                    const typeOption = ACCOUNT_CREATION_OPTIONS.find(o => o.id === accountData?.typeId);
                    const Icon = typeOption ? typeOption.icon : Wallet;

                    const activeMode = accountData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;

                    return (
                        <Card key={accId} className="overflow-visible">
                            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
                                        <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{accountData.name}</h3>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                            {accountData.typeId === 'hsa' ? (hsaStrategy === 'roth' ? 'roth (hsa)' : 'deferred (hsa)') : accountData.taxType}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded font-medium text-zinc-600 dark:text-zinc-300">
                                    Mode: {REBALANCE_MODES[activeMode.toUpperCase()]?.name || activeMode}
                                </div>
                            </div>
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {plan.actions.length === 0 ? (
                                    <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
                                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                                        <p className="text-sm">No actions needed. This account is balanced.</p>
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
                                                className={`p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer group ${isChecked ? 'opacity-50 bg-zinc-50/60 dark:bg-zinc-900/40' : ''}`}
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); toggleTradeChecked(tradeKey); }}
                                                        className={`text-zinc-400 hover:text-emerald-600 transition-colors shrink-0 ${isChecked ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                                                        aria-label="Mark trade completed"
                                                    >
                                                        {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                                    </button>
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isBuy ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                                                        }`}>
                                                        {isBuy ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${isBuy ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                                                                }`}>
                                                                {action.action}
                                                            </span>
                                                            <span className={`font-medium text-zinc-800 dark:text-zinc-200 ${isChecked ? 'line-through' : ''}`}>
                                                                {action.assetName}
                                                            </span>
                                                            {matchingTickers.length > 0 && (
                                                                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                                                    {matchingTickers.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-zinc-400 mt-1 pl-0.5 tabular-nums">
                                                            Current: {formatCurrency(action.current)} &rarr; Target: {formatCurrency(action.target)}
                                                            {action.explanation && <span className="ml-2 text-zinc-500 italic">• {action.explanation}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 ml-3">
                                                    <div className={`text-lg font-mono font-semibold tabular-nums ${isChecked ? 'line-through text-zinc-400' : isBuy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                        }`}>
                                                        {(isBuy ? '+' : '') + formatCurrency(action.diff)}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleCopyAmount(e, tradeKey, action.diff)}
                                                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                                                        title="Copy dollar amount"
                                                    >
                                                        {copiedKey === tradeKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
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
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Portfolio Balanced</h3>
                        <p className="text-zinc-500 max-w-md mx-auto px-4">Your investment portfolio is within target ranges. No actions needed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RebalanceView;
