
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Wallet, Plus, Shield, LayoutDashboard, TrendingUp, CheckCircle2, Circle, Zap, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import { ASSET_CLASSES, DEFAULT_EQUITY_SPLIT } from '../../utils/constants';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

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

const DashboardSummary = ({
    portfolioMetrics,
    accounts,
    setActiveTab,
    setShowAccountModal,
    isDarkMode,
    loadDemoData,
    equityStrategy
}) => {
    const { currentAllocation, targets, totalNetWorth, investableTotal, emergencyActual, emergencyTarget } = portfolioMetrics;
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
            action: () => { setActiveTab('accounts'); },
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
    // Show a subtle progress banner above the charts
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
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / 3) * 100}%` }}
                    />
                </div>
            </Card>
        );
    };

    const chartDataRaw = Object.keys(ASSET_CLASSES).map(key => {
        const id = ASSET_CLASSES[key].id;
        return {
            name: ASSET_CLASSES[key].name,
            current: currentAllocation[id] || 0,
            target: targets[id] || 0,
            color: ASSET_CLASSES[key].color
        };
    });
    const chartData = chartDataRaw.filter(d => d.current > 1 || d.target > 1);

    const chartTextColor = isDarkMode ? '#a1a1aa' : '#64748b';
    const chartTooltipStyle = {
        backgroundColor: isDarkMode ? '#18181b' : '#fff',
        borderColor: isDarkMode ? '#52525b' : '#e5e7eb',
        color: isDarkMode ? '#ffffff' : '#000',
        borderRadius: '8px',
        borderWidth: '1px',
        borderStyle: 'solid'
    };
    const chartTooltipLabelStyle = { color: isDarkMode ? '#ffffff' : '#000', fontWeight: '500' };
    const chartTooltipItemStyle = { color: isDarkMode ? '#ffffff' : '#000' };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SetupBanner />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 flex flex-col justify-center items-center border-l-4 border-l-emerald-500">
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Net Worth</h3>
                    <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(totalNetWorth)}</p>
                </Card>
                <Card className="p-6 flex flex-col justify-center items-center border-l-4 border-l-blue-500">
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Investable Portfolio</h3>
                    <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(investableTotal)}</p>
                </Card>
                <Card className="p-6 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col items-center w-full">
                            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4 text-amber-500" /> Emergency Reserve
                            </h3>
                            <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(emergencyActual)}</p>
                            <p className="text-xs text-zinc-400 mt-1">Target: {formatCurrency(emergencyTarget)}</p>
                        </div>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${emergencyActual >= emergencyTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (emergencyActual / (emergencyTarget || 1)) * 100)}%` }}
                        />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-emerald-600" /> Allocation Overview
                    </h3>
                    <div className="h-64 w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="current" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} stroke={isDarkMode ? '#18181b' : '#fff'}>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <RechartsTooltip formatter={(val) => formatCurrency(val)} contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
                                    <Legend formatter={(value) => <span style={{ color: chartTextColor }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-sm gap-2">
                                <Circle className="w-8 h-8 opacity-20" />
                                <span>Add funds to see breakdown</span>
                                <button onClick={() => setActiveTab('accounts')} className="text-xs text-emerald-600 font-medium hover:underline mt-1">
                                    Go to Accounts →
                                </button>
                            </div>
                        )}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" /> Current vs Target ($)
                    </h3>
                    <div className="h-64 w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#27272a' : '#e5e7eb'} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '10px', fill: chartTextColor }} />
                                    <RechartsTooltip formatter={(val) => formatCurrency(val)} contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
                                    <Bar dataKey="current" name="Current" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                    <Bar dataKey="target" name="Target" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-sm gap-2">
                                <TrendingUp className="w-8 h-8 opacity-20" />
                                <span>Add funds to see comparison</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardSummary;
