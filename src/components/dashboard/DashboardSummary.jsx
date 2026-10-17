import React, { useState, useMemo } from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';
import {
    Wallet,
    Shield,
    LayoutDashboard,
    TrendingUp,
    CheckCircle2,
    Circle,
    Zap,
    ChevronRight,
    Scale,
    Layers,
    Calendar,
    ArrowUpRight,
    AlertTriangle,
    Sparkles,
    Grid,
    PieChart as PieChartIcon
} from 'lucide-react';
import Card from '../ui/Card';
import { ASSET_CLASSES, DEFAULT_EQUITY_SPLIT, TAX_STRATEGIES } from '../../utils/constants';
import { generateGlidePathData, getSuggestedBondAllocation } from '../../utils/finance';

const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val || 0);

const formatSignedCurrency = (val) => {
    const abs = formatCurrency(Math.abs(val || 0));
    if (Math.abs(val || 0) < 1) return '$0';
    return val > 0 ? `+${abs}` : `-${abs}`;
};

// Checks if any account has at least one fund or non-zero cash (i.e. "has holdings")
const hasHoldings = (accounts) => {
    return Object.values(accounts).some(acc => {
        const hasCash = parseFloat(acc.cash) > 0;
        const hasFunds = Array.isArray(acc.funds) && acc.funds.length > 0;
        return hasCash || hasFunds;
    });
};

// Checks if equity strategy differs from default
const isStrategyCustomized = (equityStrategy) => {
    if (!equityStrategy) return false;
    const defKeys = Object.keys(DEFAULT_EQUITY_SPLIT);
    const curKeys = Object.keys(equityStrategy);
    if (defKeys.length !== curKeys.length) return true;
    return defKeys.some(k => DEFAULT_EQUITY_SPLIT[k] !== equityStrategy[k]);
};

const MACRO_COLORS = {
    equity: '#10b981', // emerald-500
    fixed: '#6366f1',  // indigo-500
    cash: '#64748b'    // slate-500
};

const DashboardSummary = ({
    portfolioMetrics,
    rebalancingPlan,
    accounts,
    setActiveTab,
    isDarkMode,
    loadDemoData,
    equityStrategy,
    bondAllocation = 10,
    cashAllocation = 0,
    bondStrategyMode = 'smart',
    taxStrategy = 'standard',
    hsaStrategy = 'roth',
    retirementYear = new Date().getFullYear() + 25,
    userAge = 38
}) => {
    const {
        currentAllocation,
        targets,
        totalNetWorth,
        investableTotal,
        emergencyActual,
        emergencyTarget
    } = portfolioMetrics;

    const [compositionView, setCompositionView] = useState('donut'); // 'donut' | 'treemap'
    const [donutMode, setDonutMode] = useState('specific'); // 'specific' | 'general'
    const [treemapGroup, setTreemapGroup] = useState('account'); // 'account' | 'asset'
    const [alignmentView, setAlignmentView] = useState('bands'); // 'bands' | 'bars'
    const [locationView, setLocationView] = useState('current'); // 'current' | 'target'
    const [hoveredSlice, setHoveredSlice] = useState(null);

    const hasAccounts = Object.keys(accounts).length > 0;
    const accountsHaveHoldings = hasHoldings(accounts);
    const strategyCustomized = isStrategyCustomized(equityStrategy);

    // Step completion state
    const step1Done = hasAccounts;
    const step2Done = hasAccounts && accountsHaveHoldings;
    const step3Done = step2Done && strategyCustomized;
    const allDone = step1Done && step2Done && step3Done;
    const completedCount = [step1Done, step2Done, step3Done].filter(Boolean).length;

    const steps = [
        {
            label: 'Create your first account',
            description: 'Add a brokerage, IRA, 401k, or savings account.',
            done: step1Done,
            action: () => setActiveTab('accounts'),
            actionLabel: 'Add Account',
        },
        {
            label: 'Import or enter your holdings',
            description: 'Paste from your brokerage or enter values manually.',
            done: step2Done,
            action: () => setActiveTab('accounts'),
            actionLabel: 'Go to Accounts',
        },
        {
            label: 'Review your strategy',
            description: 'Set your target allocation, bonds, and tax strategy.',
            done: step3Done,
            action: () => setActiveTab('configure'),
            actionLabel: 'Open Strategy',
        },
    ];

    // --- Derived Analytics for Visualizations ---
    const assetList = useMemo(() => Object.values(ASSET_CLASSES), []);

    // 1. Chart & Drift Data
    const driftItems = useMemo(() => {
        const items = assetList.map(asset => {
            const id = asset.id;
            const current = currentAllocation[id] || 0;
            const target = targets[id] || 0;
            const currentPct = investableTotal > 0 ? (current / investableTotal) * 100 : 0;
            const targetPct = investableTotal > 0 ? (target / investableTotal) * 100 : 0;
            const driftPct = currentPct - targetPct;
            const diffDollar = current - target;

            // 5/25 band rule: 5% absolute for major (>=20%), 25% relative for minor (<20%), min 0.5% floor
            const theoreticalBand = targetPct >= 20 ? 5 : targetPct * 0.25;
            const bandThreshold = Math.max(0.5, theoreticalBand);
            const isBreached = id !== 'cash' && id !== 'money_market' && Math.abs(driftPct) > bandThreshold;

            let macroGroup = 'equity';
            if (id === 'cash' || id === 'money_market') macroGroup = 'cash';
            else if (asset.type === 'fixed' || id === 'bonds') macroGroup = 'fixed';

            return {
                id,
                name: asset.name,
                color: asset.color,
                macroGroup,
                current,
                target,
                currentPct,
                targetPct,
                driftPct,
                diffDollar,
                bandThreshold,
                isBreached
            };
        }).filter(d => d.current > 1 || d.target > 1);

        // Sort by macro group so outer donut aligns with inner macro ring
        const groupOrder = { equity: 0, fixed: 1, cash: 2 };
        return items.sort((a, b) => {
            if (groupOrder[a.macroGroup] !== groupOrder[b.macroGroup]) {
                return groupOrder[a.macroGroup] - groupOrder[b.macroGroup];
            }
            return b.current - a.current;
        });
    }, [assetList, currentAllocation, targets, investableTotal]);

    // Macro ring data for General Donut view (Equities, Bonds, Cash)
    const macroData = useMemo(() => {
        const totals = { equity: 0, fixed: 0, cash: 0 };
        const targetTotals = { equity: 0, fixed: 0, cash: 0 };

        driftItems.forEach(item => {
            totals[item.macroGroup] += item.current;
            targetTotals[item.macroGroup] += item.target;
        });

        return [
            {
                id: 'macro_equity',
                name: 'Equities',
                current: totals.equity,
                target: targetTotals.equity,
                currentPct: investableTotal > 0 ? (totals.equity / investableTotal) * 100 : 0,
                targetPct: investableTotal > 0 ? (targetTotals.equity / investableTotal) * 100 : 0,
                color: MACRO_COLORS.equity
            },
            {
                id: 'macro_fixed',
                name: 'Bonds',
                current: totals.fixed,
                target: targetTotals.fixed,
                currentPct: investableTotal > 0 ? (totals.fixed / investableTotal) * 100 : 0,
                targetPct: investableTotal > 0 ? (targetTotals.fixed / investableTotal) * 100 : 0,
                color: MACRO_COLORS.fixed
            },
            {
                id: 'macro_cash',
                name: 'Cash',
                current: totals.cash,
                target: targetTotals.cash,
                currentPct: investableTotal > 0 ? (totals.cash / investableTotal) * 100 : 0,
                targetPct: investableTotal > 0 ? (targetTotals.cash / investableTotal) * 100 : 0,
                color: MACRO_COLORS.cash
            }
        ].filter(d => d.current > 1 || d.target > 1);
    }, [driftItems, investableTotal]);

    const activeDonutData = donutMode === 'general' ? macroData : driftItems;

    // Portfolio Drift Summary
    const driftSummary = useMemo(() => {
        const nonCash = driftItems.filter(d => d.id !== 'cash' && d.id !== 'money_market');
        const maxDriftItem = nonCash.reduce(
            (max, d) => (Math.abs(d.driftPct) > Math.abs(max?.driftPct || 0) ? d : max),
            null
        );
        const breachedCount = nonCash.filter(d => d.isBreached).length;
        const deployableCash = Math.max(0, (currentAllocation['cash'] || 0) - (targets['cash'] || 0));

        let actionableTrades = 0;
        if (rebalancingPlan?.accountActions) {
            Object.values(rebalancingPlan.accountActions).forEach(acc => {
                (acc.actions || []).forEach(a => {
                    if (a.action !== 'HOLD' && a.assetId !== 'cash' && a.assetId !== 'money_market') {
                        actionableTrades += 1;
                    }
                });
            });
        }

        return {
            maxDrift: maxDriftItem ? Math.abs(maxDriftItem.driftPct) : 0,
            maxDriftName: maxDriftItem ? maxDriftItem.name : 'None',
            breachedCount,
            deployableCash,
            actionableTrades,
            globalBandsTriggered: Boolean(rebalancingPlan?.globalBandsTriggered)
        };
    }, [driftItems, currentAllocation, targets, rebalancingPlan]);

    // 2. Treemap Data (By Account or By Asset)
    const treemapItems = useMemo(() => {
        if (treemapGroup === 'account') {
            const accItems = [];
            Object.values(accounts).forEach(acc => {
                if (!acc || acc.isEmergencyFund || acc.typeId === 'emergency_fund') return;
                const holdings = [];
                let accValue = 0;

                if (Array.isArray(acc.funds)) {
                    acc.funds.forEach(f => {
                        if (f.isEmergency) return;
                        const val = parseFloat(f.value) || 0;
                        if (val <= 1) return;
                        const assetKey = Object.keys(ASSET_CLASSES).find(k => ASSET_CLASSES[k].id === f.type);
                        const assetObj = assetKey ? ASSET_CLASSES[assetKey] : ASSET_CLASSES.US_BROAD;
                        holdings.push({
                            name: f.name || assetObj.name,
                            assetName: assetObj.name,
                            value: val,
                            color: assetObj.color
                        });
                        accValue += val;
                    });
                }

                const cashVal = !acc.cashIsEmergency ? (parseFloat(acc.cash) || 0) : 0;
                if (cashVal > 1) {
                    holdings.push({
                        name: 'Cash',
                        assetName: 'Cash & Equivalents',
                        value: cashVal,
                        color: ASSET_CLASSES.CASH.color
                    });
                    accValue += cashVal;
                }

                if (accValue > 1) {
                    const effectiveTax = (acc.typeId === 'hsa' || acc.id === 'hsa')
                        ? (hsaStrategy === 'roth' ? 'roth (hsa)' : 'deferred (hsa)')
                        : acc.taxType;
                    accItems.push({
                        id: acc.id,
                        name: acc.name,
                        badge: effectiveTax,
                        total: accValue,
                        pct: investableTotal > 0 ? (accValue / investableTotal) * 100 : 0,
                        holdings: holdings.sort((a, b) => b.value - a.value)
                    });
                }
            });
            return accItems.sort((a, b) => b.total - a.total);
        } else {
            return driftItems
                .filter(d => d.current > 1)
                .sort((a, b) => b.current - a.current)
                .map(d => ({
                    id: d.id,
                    name: d.name,
                    badge: `${d.currentPct.toFixed(1)}%`,
                    total: d.current,
                    pct: d.currentPct,
                    color: d.color,
                    driftPct: d.driftPct,
                    holdings: [{ name: d.name, value: d.current, color: d.color }]
                }));
        }
    }, [accounts, treemapGroup, driftItems, investableTotal, hsaStrategy]);

    // 3. Tax-Location X-Ray Data
    const taxLocationBuckets = useMemo(() => {
        const buckets = {
            roth: {
                id: 'roth',
                label: 'Tax-Free (Roth / HSA)',
                sub: hsaStrategy === 'roth' ? 'Roth IRA, Roth 401(k), HSA' : 'Roth IRA, Roth 401(k)',
                badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
                currentTotal: 0,
                targetTotal: 0,
                currentAssets: {},
                targetAssets: {}
            },
            deferred: {
                id: 'deferred',
                label: 'Tax-Deferred (Pre-Tax)',
                sub: hsaStrategy === 'deferred' ? 'Trad 401(k), Trad IRA, HSA' : 'Trad 401(k), Trad IRA, Rollover',
                badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
                currentTotal: 0,
                targetTotal: 0,
                currentAssets: {},
                targetAssets: {}
            },
            taxable: {
                id: 'taxable',
                label: 'Taxable (Brokerage)',
                sub: 'Individual & Joint Brokerage',
                badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
                currentTotal: 0,
                targetTotal: 0,
                currentAssets: {},
                targetAssets: {}
            }
        };

        Object.values(accounts).forEach(acc => {
            if (!acc || acc.isEmergencyFund || acc.typeId === 'emergency_fund') return;
            const bucketKey = (acc.typeId === 'hsa' || acc.id === 'hsa')
                ? (hsaStrategy === 'roth' ? 'roth' : 'deferred')
                : (acc.taxType || 'taxable');
            const bucket = buckets[bucketKey];
            if (!bucket) return;

            // Current holdings in this account
            if (Array.isArray(acc.funds)) {
                acc.funds.forEach(f => {
                    if (f.isEmergency) return;
                    const val = parseFloat(f.value) || 0;
                    if (val <= 0) return;
                    const type = f.type === 'money_market' ? 'cash' : (f.type || 'us_broad');
                    bucket.currentAssets[type] = (bucket.currentAssets[type] || 0) + val;
                    bucket.currentTotal += val;
                });
            }
            if (!acc.cashIsEmergency) {
                const cashVal = parseFloat(acc.cash) || 0;
                if (cashVal > 0) {
                    bucket.currentAssets['cash'] = (bucket.currentAssets['cash'] || 0) + cashVal;
                    bucket.currentTotal += cashVal;
                }
            }

            // Target holdings in this account from rebalancingPlan
            const accPlan = rebalancingPlan?.accountActions?.[acc.id];
            if (accPlan?.targetHoldings) {
                Object.entries(accPlan.targetHoldings).forEach(([assetId, amount]) => {
                    if (amount > 0) {
                        const normId = assetId === 'money_market' ? 'cash' : assetId;
                        bucket.targetAssets[normId] = (bucket.targetAssets[normId] || 0) + amount;
                        bucket.targetTotal += amount;
                    }
                });
            }
        });

        return Object.values(buckets).map(b => {
            const activeMap = locationView === 'current' ? b.currentAssets : b.targetAssets;
            const activeTotal = locationView === 'current' ? b.currentTotal : b.targetTotal;

            const segments = assetList
                .map(asset => {
                    const val = activeMap[asset.id] || 0;
                    return {
                        id: asset.id,
                        name: asset.name,
                        color: asset.color,
                        value: val,
                        pctOfBucket: activeTotal > 0 ? (val / activeTotal) * 100 : 0
                    };
                })
                .filter(s => s.value > 1)
                .sort((a, b) => b.value - a.value);

            return {
                ...b,
                activeTotal,
                pctOfPortfolio: investableTotal > 0 ? (b.currentTotal / investableTotal) * 100 : 0,
                segments
            };
        });
    }, [accounts, hsaStrategy, rebalancingPlan, locationView, assetList, investableTotal]);

    // 4. Glidepath Curve Data
    const currentYear = new Date().getFullYear();
    const yearsToRetirement = Math.max(0, (retirementYear || currentYear + 25) - currentYear);
    const syntheticAge = Math.max(18, Math.min(85, 65 - yearsToRetirement));

    const glidePathSeries = useMemo(() => {
        const mode = bondStrategyMode === 'custom' ? 'smart' : bondStrategyMode;
        const raw = generateGlidePathData(mode);
        return raw
            .filter(pt => pt.age >= 20 && pt.age <= 80)
            .map(pt => ({
                age: pt.age,
                bonds: pt.bonds,
                equities: Math.max(0, 100 - pt.bonds - (cashAllocation || 0))
            }));
    }, [bondStrategyMode, cashAllocation]);

    const actualBondPct = investableTotal > 0 ? ((currentAllocation['bonds'] || 0) / investableTotal) * 100 : 0;
    const suggestedBondAtAge = getSuggestedBondAllocation(syntheticAge);

    // TOTALLY EMPTY STATE — no accounts at all
    if (!hasAccounts) {
        return (
            <div className="animate-in fade-in duration-500">
                {/* Hero welcome */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
                        <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Welcome to Balanced</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                        Set up your portfolio in 3 steps. It takes about 5 minutes.
                    </p>
                </div>

                {/* Checklist */}
                <div className="max-w-lg mx-auto space-y-3 mb-8">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            onClick={step.action}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all group
                                ${step.done
                                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm'
                                }`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                ${step.done
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600'
                                }`}>
                                {step.done ? <CheckCircle2 className="w-4 h-4" /> : <span>{i + 1}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-semibold ${step.done ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-60' : 'text-zinc-800 dark:text-zinc-100'}`}>
                                    {step.label}
                                </div>
                                <div className="text-xs text-zinc-400 mt-0.5">{step.description}</div>
                            </div>
                            {!step.done && (
                                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="relative max-w-lg mx-auto mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-zinc-50 dark:bg-zinc-950 text-zinc-400">or explore first</span>
                    </div>
                </div>

                {/* Demo data CTA */}
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={loadDemoData}
                        className="w-full group flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-semibold transition-all hover:shadow-lg"
                    >
                        <Zap className="w-5 h-5 text-emerald-400 dark:text-emerald-600 group-hover:scale-110 transition-transform" />
                        Load Demo Portfolio
                        <span className="text-xs font-normal opacity-60 ml-1">— see how it works instantly</span>
                    </button>
                </div>
            </div>
        );
    }

    // PARTIAL STATE — accounts exist but setup incomplete
    const SetupBanner = () => {
        if (allDone) return null;
        return (
            <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{completedCount}/3</span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Setup in progress</div>
                            <div className="text-xs text-zinc-500 truncate">
                                {!step2Done
                                    ? 'Next: add your holdings to the accounts you created.'
                                    : 'Next: review your strategy and target allocation.'}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        {!step2Done && (
                            <button
                                onClick={() => setActiveTab('accounts')}
                                className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                            >
                                Add Holdings
                            </button>
                        )}
                        {step2Done && !step3Done && (
                            <button
                                onClick={() => setActiveTab('configure')}
                                className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                            >
                                Set Strategy
                            </button>
                        )}
                    </div>
                </div>
                <div className="mt-3 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / 3) * 100}%` }}
                    />
                </div>
            </Card>
        );
    };

    const chartTextColor = isDarkMode ? '#a1a1aa' : '#64748b';
    const chartTooltipStyle = {
        backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
        borderColor: isDarkMode ? '#3f3f46' : '#e4e4e7',
        color: isDarkMode ? '#ffffff' : '#18181b',
        borderRadius: '10px',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
    };
    const chartTooltipLabelStyle = { color: isDarkMode ? '#ffffff' : '#18181b', fontWeight: '600' };
    const chartTooltipItemStyle = { color: isDarkMode ? '#e4e4e7' : '#27272a', fontSize: '12px' };

    // Net Worth Breakdown segments
    const uninvestedCash = currentAllocation['cash'] || 0;
    const investedSecurities = Math.max(0, investableTotal - uninvestedCash);
    const nwInvestedPct = totalNetWorth > 0 ? (investedSecurities / totalNetWorth) * 100 : 0;
    const nwCashPct = totalNetWorth > 0 ? (uninvestedCash / totalNetWorth) * 100 : 0;
    const nwEmergencyPct = totalNetWorth > 0 ? (emergencyActual / totalNetWorth) * 100 : 0;

    const targetEquityPct = Math.max(0, 100 - (bondAllocation || 0) - (cashAllocation || 0));
    const emergencyDiff = emergencyActual - emergencyTarget;

    const activeStrategyLabel = Object.values(TAX_STRATEGIES).find(s => s.id === taxStrategy)?.name || 'Tax-Efficient';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SetupBanner />

            {/* === TOP HERO KPI STRIP === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Total Net Worth + Wealth Composition Bar */}
                <Card className="p-5 flex flex-col justify-between border-l-4 border-l-emerald-500">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                Total Net Worth
                            </h3>
                            <span className="text-[11px] font-medium text-zinc-400">
                                {Object.keys(accounts).length} {Object.keys(accounts).length === 1 ? 'Account' : 'Accounts'}
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1.5 tracking-tight">
                            {formatCurrency(totalNetWorth)}
                        </p>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                            {nwInvestedPct > 0 && (
                                <div
                                    style={{ width: `${nwInvestedPct}%` }}
                                    className="h-full bg-emerald-500 transition-all duration-700"
                                    title={`Invested: ${formatCurrency(investedSecurities)}`}
                                />
                            )}
                            {nwCashPct > 0 && (
                                <div
                                    style={{ width: `${nwCashPct}%` }}
                                    className="h-full bg-blue-500 transition-all duration-700"
                                    title={`Investable Cash: ${formatCurrency(uninvestedCash)}`}
                                />
                            )}
                            {nwEmergencyPct > 0 && (
                                <div
                                    style={{ width: `${nwEmergencyPct}%` }}
                                    className="h-full bg-amber-500 transition-all duration-700"
                                    title={`Emergency Reserve: ${formatCurrency(emergencyActual)}`}
                                />
                            )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                Invested {nwInvestedPct.toFixed(0)}%
                            </span>
                            {nwCashPct >= 0.5 && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                    Cash {nwCashPct.toFixed(0)}%
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                                Shielded {nwEmergencyPct.toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Card 2: Investable Portfolio + Drift Health Status */}
                <Card className="p-5 flex flex-col justify-between border-l-4 border-l-blue-500">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                Investable Portfolio
                            </h3>
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                                {targetEquityPct}% / {bondAllocation}%{cashAllocation > 0 ? ` / ${cashAllocation}%` : ''} Target
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1.5 tracking-tight">
                            {formatCurrency(investableTotal)}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                        {driftSummary.globalBandsTriggered ? (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    Band Breached ({driftSummary.maxDrift.toFixed(1)}% max drift)
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    Within 5/25 Bands ({driftSummary.maxDrift.toFixed(1)}% max drift)
                                </span>
                            </div>
                        )}

                        <button
                            onClick={() => setActiveTab('rebalance')}
                            className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-0.5 shrink-0 transition-colors"
                        >
                            Balance <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </Card>

                {/* Card 3: Emergency Reserve + Cushion Status */}
                <Card className="p-5 flex flex-col justify-between border-l-4 border-l-amber-500">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-amber-500" /> Emergency Reserve
                            </h3>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                emergencyActual >= emergencyTarget
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}>
                                {emergencyTarget > 0
                                    ? `${Math.round((emergencyActual / emergencyTarget) * 100)}% Funded`
                                    : 'No Target'}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1.5">
                            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                {formatCurrency(emergencyActual)}
                            </p>
                            <span className="text-xs text-zinc-400 font-medium">
                                / {formatCurrency(emergencyTarget)} goal
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${
                                    emergencyActual >= emergencyTarget ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, (emergencyActual / (emergencyTarget || 1)) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span>Shielded from rebalancing</span>
                            <span className="font-medium">
                                {emergencyDiff >= 0
                                    ? `${formatSignedCurrency(emergencyDiff)} cushion`
                                    : `${formatCurrency(Math.abs(emergencyDiff))} needed`}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* === ROW 1: PORTFOLIO COMPOSITION & TARGET ALIGNMENT === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CARD 1: Portfolio Composition (Donut <-> Treemap) */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                                    Portfolio Composition
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {compositionView === 'donut'
                                        ? (donutMode === 'general'
                                            ? 'Macro asset split (Equities, Bonds, Cash)'
                                            : 'Breakdown by specific asset class')
                                        : 'Proportional market map of your holdings'}
                                </p>
                            </div>

                            {/* Segmented Toggle */}
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
                                <button
                                    onClick={() => setCompositionView('donut')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                                        compositionView === 'donut'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    <PieChartIcon className="w-3.5 h-3.5" /> Donut
                                </button>
                                <button
                                    onClick={() => setCompositionView('treemap')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                                        compositionView === 'treemap'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    <Grid className="w-3.5 h-3.5" /> Treemap
                                </button>
                            </div>
                        </div>

                        {driftItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 text-sm gap-2">
                                <Circle className="w-8 h-8 opacity-20" />
                                <span>Add funds to see breakdown</span>
                                <button
                                    onClick={() => setActiveTab('accounts')}
                                    className="text-xs text-emerald-600 font-medium hover:underline mt-1"
                                >
                                    Go to Accounts →
                                </button>
                            </div>
                        ) : compositionView === 'donut' ? (
                            <div className="space-y-2">
                                {/* Sub-Toggle: Specific vs General (Equities, Bonds, Cash) */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-zinc-400">
                                        {donutMode === 'general' ? 'Equities, Bonds & Cash' : 'Detailed asset classes'}
                                    </span>
                                    <div className="flex items-center gap-1 text-[11px]">
                                        <button
                                            onClick={() => {
                                                setDonutMode('specific');
                                                setHoveredSlice(null);
                                            }}
                                            className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                                                donutMode === 'specific'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                            }`}
                                        >
                                            Specific
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDonutMode('general');
                                                setHoveredSlice(null);
                                            }}
                                            className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                                                donutMode === 'general'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                            }`}
                                        >
                                            General
                                        </button>
                                    </div>
                                </div>

                                {/* Clean Single-Ring Donut with Spacious Interactive Center */}
                                <div className="relative h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={activeDonutData}
                                                dataKey="current"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={64}
                                                outerRadius={98}
                                                paddingAngle={2}
                                                stroke={isDarkMode ? '#18181b' : '#ffffff'}
                                                strokeWidth={2}
                                                onMouseEnter={(_, idx) => setHoveredSlice(activeDonutData[idx])}
                                                onMouseLeave={() => setHoveredSlice(null)}
                                            >
                                                {activeDonutData.map((entry, idx) => (
                                                    <Cell
                                                        key={`donut-slice-${entry.id || idx}`}
                                                        fill={entry.color}
                                                        className="transition-opacity duration-200 hover:opacity-85 cursor-pointer"
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Center Callout Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                                        {hoveredSlice ? (
                                            <>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 max-w-[110px] truncate">
                                                    {hoveredSlice.name}
                                                </span>
                                                <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 mt-0.5">
                                                    {formatCurrency(hoveredSlice.current)}
                                                </span>
                                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {hoveredSlice.currentPct.toFixed(1)}%
                                                    <span className="text-zinc-400 font-normal">
                                                        {' '}(T: {hoveredSlice.targetPct.toFixed(0)}%)
                                                    </span>
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                                                    Investable
                                                </span>
                                                <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5">
                                                    {formatCurrency(investableTotal)}
                                                </span>
                                                <span className="text-[10px] text-zinc-400">
                                                    Hover slice
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Compact Custom Legend synced to Specific or General mode */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                                    {activeDonutData.map(item => (
                                        <div
                                            key={item.id}
                                            onMouseEnter={() => setHoveredSlice(item)}
                                            onMouseLeave={() => setHoveredSlice(null)}
                                            className="flex items-center justify-between text-xs py-0.5 px-1.5 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-zinc-700 dark:text-zinc-300 truncate font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                    {item.currentPct.toFixed(1)}%
                                                </span>
                                                <span className="text-[10px] text-zinc-400">
                                                    ({formatCurrency(item.current)})
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* TREEMAP VIEW */
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-zinc-400">
                                        Box size proportional to dollar value
                                    </span>
                                    <div className="flex items-center gap-1 text-[11px]">
                                        <button
                                            onClick={() => setTreemapGroup('account')}
                                            className={`px-2 py-0.5 rounded font-medium ${
                                                treemapGroup === 'account'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                            }`}
                                        >
                                            By Account
                                        </button>
                                        <button
                                            onClick={() => setTreemapGroup('asset')}
                                            className={`px-2 py-0.5 rounded font-medium ${
                                                treemapGroup === 'asset'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                            }`}
                                        >
                                            By Asset Class
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 min-h-[260px] content-stretch">
                                    {treemapItems.map(group => {
                                        const basisPct = Math.max(22, Math.min(100, group.pct));
                                        return (
                                            <div
                                                key={group.id}
                                                style={{ flexGrow: Math.max(1, Math.round(group.pct)), flexBasis: `${basisPct}%` }}
                                                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex flex-col justify-between min-w-[140px] transition-all hover:border-emerald-400/60"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">
                                                            {group.name}
                                                        </div>
                                                        <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                                            {formatCurrency(group.total)} ({group.pct.toFixed(1)}%)
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shrink-0">
                                                        {group.badge}
                                                    </span>
                                                </div>

                                                {/* Proportional Sub-Blocks for Holdings */}
                                                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                                                    {group.holdings.map((h, idx) => {
                                                        const hPct = group.total > 0 ? (h.value / group.total) * 100 : 100;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                style={{
                                                                    flexGrow: Math.max(1, Math.round(hPct)),
                                                                    backgroundColor: h.color
                                                                }}
                                                                className="rounded-lg p-2 text-white min-w-[65px] shadow-sm transition-transform hover:scale-[1.01]"
                                                                title={`${h.name}: ${formatCurrency(h.value)} (${hPct.toFixed(1)}% of ${group.name})`}
                                                            >
                                                                <div className="text-[10px] font-bold truncate drop-shadow-sm">
                                                                    {h.name}
                                                                </div>
                                                                <div className="text-[10px] font-medium opacity-90 drop-shadow-sm">
                                                                    {formatCurrency(h.value)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* CARD 2: Target Alignment (5/25 Drift Bands <-> $ Comparison) */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-emerald-600" />
                                    Target Alignment & Drift
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {alignmentView === 'bands'
                                        ? 'Position relative to 5/25 drift band corridors (center = 0% drift)'
                                        : 'Current dollar holdings vs. target allocation ($)'}
                                </p>
                            </div>

                            {/* Segmented Toggle */}
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
                                <button
                                    onClick={() => setAlignmentView('bands')}
                                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                        alignmentView === 'bands'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    5/25 Drift Gauge
                                </button>
                                <button
                                    onClick={() => setAlignmentView('bars')}
                                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                        alignmentView === 'bars'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    $ Comparison
                                </button>
                            </div>
                        </div>

                        {driftItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 text-sm gap-2">
                                <TrendingUp className="w-8 h-8 opacity-20" />
                                <span>Add funds to see comparison</span>
                            </div>
                        ) : alignmentView === 'bands' ? (
                            /* 5/25 DRIFT BAND BULLET GAUGE */
                            <div className="space-y-3.5 mt-2">
                                {driftItems.map(item => {
                                    // Normalize drift onto a [-10%, +10%] visual scale around center (50%)
                                    const maxScale = Math.max(8, item.bandThreshold * 1.6, Math.abs(item.driftPct) * 1.15);
                                    const bandHalfWidthPct = Math.min(45, (item.bandThreshold / maxScale) * 50);
                                    const barWidthPct = Math.min(49, (Math.abs(item.driftPct) / maxScale) * 50);
                                    const isOver = item.driftPct >= 0;

                                    let barColor = 'bg-emerald-500';
                                    if (item.isBreached) {
                                        barColor = 'bg-amber-500';
                                    } else if (item.driftPct < -0.5) {
                                        barColor = 'bg-blue-500';
                                    }

                                    return (
                                        <div key={item.id} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[11px] text-zinc-400">
                                                        {item.currentPct.toFixed(1)}% / {item.targetPct.toFixed(1)}%
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`text-[11px] font-mono font-semibold ${
                                                        item.isBreached
                                                            ? 'text-amber-600 dark:text-amber-400'
                                                            : Math.abs(item.driftPct) < 0.5
                                                            ? 'text-zinc-400'
                                                            : item.driftPct > 0
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                        {item.driftPct >= 0 ? `+${item.driftPct.toFixed(1)}%` : `${item.driftPct.toFixed(1)}%`}
                                                        {' '}({formatSignedCurrency(item.diffDollar)})
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bullet Corridor Track */}
                                            <div className="relative h-3.5 bg-zinc-100 dark:bg-zinc-800/90 rounded-md overflow-hidden flex items-center">
                                                {/* Safe 5/25 Drift Corridor Zone */}
                                                {item.id !== 'cash' && item.id !== 'money_market' && (
                                                    <div
                                                        style={{
                                                            left: `${50 - bandHalfWidthPct}%`,
                                                            width: `${bandHalfWidthPct * 2}%`
                                                        }}
                                                        className="absolute inset-y-0 bg-emerald-500/10 dark:bg-emerald-400/10 border-x border-dashed border-emerald-500/40"
                                                        title={`Safe 5/25 Drift Corridor: ±${item.bandThreshold.toFixed(1)}%`}
                                                    />
                                                )}

                                                {/* Center 0% Target Line */}
                                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-400 dark:bg-zinc-500 z-10" />

                                                {/* Active Drift Bar from Center */}
                                                <div
                                                    style={{
                                                        left: isOver ? '50%' : `${50 - barWidthPct}%`,
                                                        width: `${ Math.max(1, barWidthPct)}%`
                                                    }}
                                                    className={`absolute h-2 rounded-sm transition-all duration-500 ${barColor}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Legend footer for Bullet Chart */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2.5 h-2 rounded-xs bg-emerald-500/20 border border-dashed border-emerald-500/60 inline-block" />
                                            Safe 5/25 Band
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                            Underweight
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                                            Band Breached
                                        </span>
                                    </div>
                                    <span>Center = Target</span>
                                </div>
                            </div>
                        ) : (
                            /* DOLLAR COMPARISON BAR CHART */
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={driftItems} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#27272a' : '#e5e7eb'} />
                                        <XAxis
                                            type="number"
                                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                            style={{ fontSize: '10px', fill: chartTextColor }}
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={110}
                                            style={{ fontSize: '11px', fill: chartTextColor, fontWeight: 500 }}
                                        />
                                        <RechartsTooltip
                                            formatter={(val) => formatCurrency(val)}
                                            contentStyle={chartTooltipStyle}
                                            labelStyle={chartTooltipLabelStyle}
                                            itemStyle={chartTooltipItemStyle}
                                        />
                                        <Bar dataKey="current" name="Current ($)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={14} />
                                        <Bar dataKey="target" name="Target ($)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* === ROW 2: TAX-LOCATION X-RAY & RETIREMENT GLIDEPATH === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CARD 3: Tax-Location X-Ray */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-emerald-600" />
                                    Tax-Location X-Ray
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Strategy: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{activeStrategyLabel}</span>
                                </p>
                            </div>

                            {/* Toggle Current vs Ideal Target Location */}
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
                                <button
                                    onClick={() => setLocationView('current')}
                                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                        locationView === 'current'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    Current Location
                                </button>
                                <button
                                    onClick={() => setLocationView('target')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                                        locationView === 'target'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    <Sparkles className="w-3 h-3 text-emerald-500" /> Ideal Target
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 mt-2">
                            {taxLocationBuckets.map(bucket => (
                                <div
                                    key={bucket.id}
                                    className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                                    {bucket.label}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bucket.badgeColor}`}>
                                                    {bucket.pctOfPortfolio.toFixed(0)}% of Portfolio
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-zinc-400">{bucket.sub}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">
                                                {formatCurrency(bucket.activeTotal)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 100% Stacked Bar of Assets inside this Tax Bucket */}
                                    {bucket.segments.length > 0 ? (
                                        <>
                                            <div className="w-full h-3.5 bg-zinc-200/70 dark:bg-zinc-700/60 rounded-lg overflow-hidden flex">
                                                {bucket.segments.map(seg => (
                                                    <div
                                                        key={seg.id}
                                                        style={{
                                                            width: `${seg.pctOfBucket}%`,
                                                            backgroundColor: seg.color
                                                        }}
                                                        className="h-full transition-all duration-500 first:rounded-l-lg last:rounded-r-lg"
                                                        title={`${seg.name}: ${formatCurrency(seg.value)} (${seg.pctOfBucket.toFixed(1)}%)`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                                                {bucket.segments.map(seg => (
                                                    <span key={seg.id} className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                                                        <span
                                                            className="w-2 h-2 rounded-full shrink-0"
                                                            style={{ backgroundColor: seg.color }}
                                                        />
                                                        <span className="font-medium">{seg.name}:</span>
                                                        <span className="text-zinc-500 dark:text-zinc-400">
                                                            {seg.pctOfBucket.toFixed(0)}% ({formatCurrency(seg.value)})
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-xs text-zinc-400 italic py-1">
                                            No accounts or holdings in this tax bucket
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* CARD 4: Retirement Glidepath Trajectory */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                    Retirement Glidepath Trajectory
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Equity-to-Bond transition curve toward your {retirementYear} target retirement
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('configure')}
                                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                            >
                                Edit Horizon <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="h-60 w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={glidePathSeries} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="dashEquityGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="dashBondGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.08} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#27272a' : '#e5e7eb'} />
                                    <XAxis
                                        dataKey="age"
                                        tickFormatter={(a) => `Age ${a}`}
                                        style={{ fontSize: '10px', fill: chartTextColor }}
                                    />
                                    <YAxis
                                        width={38}
                                        domain={[0, 100]}
                                        tickFormatter={(v) => `${v}%`}
                                        style={{ fontSize: '10px', fill: chartTextColor }}
                                    />
                                    <RechartsTooltip
                                        formatter={(val, name) => [`${val}%`, name]}
                                        labelFormatter={(age) => `Synthetic Age ${age}`}
                                        contentStyle={chartTooltipStyle}
                                        labelStyle={chartTooltipLabelStyle}
                                        itemStyle={chartTooltipItemStyle}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="equities"
                                        name="Target Equities"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fill="url(#dashEquityGrad)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="bonds"
                                        name="Target Bonds"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fill="url(#dashBondGrad)"
                                    />
                                    <ReferenceLine
                                        x={syntheticAge}
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                        label={{
                                            value: `You (${yearsToRetirement}y to 20${String(retirementYear).slice(-2)})`,
                                            position: 'top',
                                            offset: 8,
                                            fill: '#f59e0b',
                                            fontSize: 11,
                                            fontWeight: 700
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Glidepath Comparison Footer */}
                    <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
                        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                            <div className="text-[10px] font-semibold uppercase text-zinc-400">Horizon</div>
                            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">
                                {yearsToRetirement} Years
                            </div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                            <div className="text-[10px] font-semibold uppercase text-zinc-400">Target Bonds</div>
                            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                {bondAllocation}%
                                {bondStrategyMode !== 'smart' && (
                                    <span className="text-[10px] text-zinc-400 font-normal"> (Glide: {suggestedBondAtAge}%)</span>
                                )}
                            </div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                            <div className="text-[10px] font-semibold uppercase text-zinc-400">Actual Bonds</div>
                            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {actualBondPct.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardSummary;
