
import React from 'react';
import { Scale, CheckCircle2, Shield, AlertCircle, ArrowDownRight, ArrowUpRight, Wallet, ShieldCheck, Layers } from 'lucide-react';
import Card from '../ui/Card';
import { REBALANCE_MODES, ACCOUNT_CREATION_OPTIONS } from '../../utils/constants';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const RebalanceView = ({
    accounts,
    rebalanceModeTaxable,
    setRebalanceModeTaxable,
    rebalanceModeSheltered,
    setRebalanceModeSheltered,
    rebalancingPlan,
    setActiveTab
}) => {
    const hasAccounts = Object.keys(accounts).length > 0;

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

            {/* EMERGENCY FUND STATUS SECTION */}
            {efAction && (
                <Card className={`p-6 border-l-4 ${efAction.status === 'surplus' ? 'border-l-emerald-500' : (efAction.status === 'deficit' ? 'border-l-red-500' : 'border-l-zinc-400')}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-zinc-500" /> Emergency Fund Action
                            </h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                {/* Fixed logic to avoid crash if efAction is missing properties, though it should be fine */}
                                {efAction.status === 'balanced' && "Your emergency reserves are on target."}
                                {efAction.status === 'deficit' && "Your emergency fund is below target."}
                                {efAction.status === 'surplus' && "You have excess cash in your emergency fund."}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-2xl font-bold ${efAction.status === 'deficit' ? 'text-red-600' : 'text-emerald-600'}`}>
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
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider">{accountData.taxType}</p>
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

                                        return (
                                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBuy ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                                                        }`}>
                                                        {isBuy ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${isBuy ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                                                                }`}>
                                                                {action.action}
                                                            </span>
                                                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{action.assetName}</span>
                                                        </div>
                                                        <div className="text-xs text-zinc-400 mt-1 pl-1">
                                                            Current: {formatCurrency(action.current)} &rarr; Target: {formatCurrency(action.target)}
                                                            {action.explanation && <span className="ml-2 text-zinc-500 italic">• {action.explanation}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-lg font-mono font-semibold ${isBuy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                    {(isBuy ? '+' : '') + formatCurrency(action.diff)}
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
