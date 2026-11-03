
import React, { useState } from 'react';
import { Plus, Shield, Wallet, Upload, Trash2, X, Layers, ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react';
import Card from '../ui/Card';
import FundRow from './FundRow';
import PasteModal from './PasteModal';
import CurrencyInput from '../ui/CurrencyInput';
import { ACCOUNT_CREATION_OPTIONS, ASSET_CLASSES } from '../../utils/constants';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

const AccountsManager = ({
    accounts,
    totalNetWorth,
    updateAccount,
    updateAccountCash,
    addFund,
    updateFund,
    removeFund,
    createAccount,
    deleteAccount,
    importFunds,
    isDarkMode,
    hsaStrategy = 'roth'
}) => {
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountType, setNewAccountType] = useState(ACCOUNT_CREATION_OPTIONS[1].id);
    const [pasteModal, setPasteModal] = useState({ isOpen: false, accountId: null });
    const [collapsedAccounts, setCollapsedAccounts] = useState({});

    const accountList = Object.values(accounts);
    const allCollapsed = accountList.length > 0 && accountList.every(acc => collapsedAccounts[acc.id]);

    const toggleCollapseAccount = (accId) => {
        setCollapsedAccounts(prev => ({ ...prev, [accId]: !prev[accId] }));
    };

    const toggleCollapseAll = () => {
        if (allCollapsed) {
            setCollapsedAccounts({});
        } else {
            const next = {};
            accountList.forEach(acc => { next[acc.id] = true; });
            setCollapsedAccounts(next);
        }
    };

    const handleCreateAccount = () => {
        createAccount(newAccountName, newAccountType);
        setNewAccountName('');
        setShowAccountModal(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Your Accounts</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 tabular-nums">
                        {accountList.length} {accountList.length === 1 ? 'account' : 'accounts'} • Total Net Worth: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formatCurrency(totalNetWorth)}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    {accountList.length > 1 && (
                        <button
                            type="button"
                            onClick={toggleCollapseAll}
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                            <ChevronsUpDown className="w-3.5 h-3.5" />
                            {allCollapsed ? 'Expand All' : 'Collapse All'}
                        </button>
                    )}
                    <button
                        onClick={() => setShowAccountModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Account
                    </button>
                </div>
            </div>

            {/* Shield Toggle Legend */}
            {accountList.length > 0 && (
                <Card className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex-shrink-0">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">Emergency Reserve Shield</h4>
                            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                                Toggle the <Shield className="w-3 h-3 inline mx-0.5" /> shield icon on any cash balance or fund to earmark it for your Emergency Reserve.
                                Shielded balances up to your emergency goal are protected from rebalancing; any excess cash above your goal automatically spills over into your investable portfolio.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Account List */}
            <div className="grid grid-cols-1 gap-6">
                {accountList.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-zinc-400 mb-4">You haven't added any accounts yet.</p>
                        <button
                            onClick={() => setShowAccountModal(true)}
                            className="text-emerald-600 font-semibold hover:underline"
                        >
                            Create your first account
                        </button>
                    </div>
                ) : (
                    accountList.map((accountData) => {
                        const typeOption = ACCOUNT_CREATION_OPTIONS.find(o => o.id === accountData.typeId);
                        const Icon = typeOption ? typeOption.icon : Wallet;
                        const isCollapsed = Boolean(collapsedAccounts[accountData.id]);

                        const cashVal = parseFloat(accountData.cash) || 0;
                        const fundsList = Array.isArray(accountData.funds) ? accountData.funds : [];
                        const totalAccountValue = cashVal + fundsList.reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0);
                        const shareOfNetWorth = totalNetWorth > 0 ? (totalAccountValue / totalNetWorth) * 100 : 0;

                        // Build mini allocation bar segments for this account
                        const segments = [];
                        if (cashVal > 0) {
                            segments.push({
                                name: 'Cash',
                                value: cashVal,
                                color: accountData.cashIsEmergency ? '#f59e0b' : ASSET_CLASSES.CASH.color
                            });
                        }
                        fundsList.forEach(f => {
                            const v = parseFloat(f.value) || 0;
                            if (v <= 0) return;
                            const assetObj = Object.values(ASSET_CLASSES).find(a => a.id === f.type) || ASSET_CLASSES.US_BROAD;
                            segments.push({
                                name: f.name || assetObj.name,
                                value: v,
                                color: f.isEmergency ? '#f59e0b' : assetObj.color
                            });
                        });

                        return (
                            <Card key={accountData.id} className="p-0 overflow-visible">
                                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-3 bg-zinc-50/60 dark:bg-zinc-800/20 rounded-t-2xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div
                                            onClick={() => toggleCollapseAccount(accountData.id)}
                                            className="flex items-center gap-3 cursor-pointer select-none group"
                                        >
                                            <div className="p-1.5 rounded-lg text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                                                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </div>
                                            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm border border-zinc-200/60'}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {accountData.name}
                                                    </h3>
                                                    <span className="text-[10px] font-bold bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {accountData.typeId === 'hsa' ? (hsaStrategy === 'roth' ? 'roth (hsa)' : 'deferred (hsa)') : accountData.taxType}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 tabular-nums">
                                                    {typeOption ? typeOption.name : 'Custom Account'} • <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatCurrency(totalAccountValue)}</span>
                                                    {totalNetWorth > 0 && (
                                                        <span className="text-zinc-400 ml-1">({shareOfNetWorth.toFixed(1)}% of net worth)</span>
                                                    )}
                                                    {accountData.lastUpdated && (
                                                        <span className="ml-2 text-[10px] text-zinc-400">
                                                            • Updated {new Date(accountData.lastUpdated).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => setPasteModal({ isOpen: true, accountId: accountData.id })}
                                                className="px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all flex items-center gap-1.5 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                                                title="Smart Paste / CSV Import"
                                            >
                                                <Upload className="w-3.5 h-3.5" />
                                                <span className="hidden md:inline">Import</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteAccount(accountData.id)}
                                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                aria-label="Delete Account"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mini Holdings Composition Bar */}
                                    {totalAccountValue > 0 && segments.length > 0 && (
                                        <div className="w-full h-1.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                                            {segments.map((seg, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: `${(seg.value / totalAccountValue) * 100}%`,
                                                        backgroundColor: seg.color
                                                    }}
                                                    className="h-full transition-all duration-500"
                                                    title={`${seg.name}: ${formatCurrency(seg.value)} (${((seg.value / totalAccountValue) * 100).toFixed(1)}%)`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {!isCollapsed && (
                                <div className="p-5 space-y-5">
                                    {/* Consolidated Cash & Equivalents Section */}
                                    <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/80 dark:border-emerald-800/40 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100 dark:border-emerald-800/50">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">Cash & Equivalents</h4>
                                            </div>
                                            <div className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(
                                                    (parseFloat(accountData.cash) || 0) +
                                                    (accountData.funds || [])
                                                        .filter(f => f.type === 'money_market' || f.type === 'cash')
                                                        .reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0)
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Cash Row - Aligned with FundRow grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-3 md:p-0 bg-white/60 dark:bg-white/5 md:bg-transparent rounded-xl md:rounded-none border border-zinc-100 dark:border-zinc-800 md:border-0 shadow-sm md:shadow-none">
                                                <div className="md:col-span-8 flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Settlement / Sweep Cash</span>
                                                        {accountData.cashIsEmergency && (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                                Emergency Shielded
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-zinc-400">Uninvested brokerage sweep or savings balance</span>
                                                </div>
                                                <div className="md:col-span-3 relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-medium">$</span>
                                                    <CurrencyInput
                                                        value={accountData.cash}
                                                        onChange={(val) => updateAccountCash(accountData.id, val)}
                                                        className="w-full pl-6 pr-3 py-2 text-sm font-semibold tabular-nums bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="md:col-span-1 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateAccount(accountData.id, 'cashIsEmergency', !accountData.cashIsEmergency)}
                                                        className={`p-2 rounded-lg transition-colors ${accountData.cashIsEmergency ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' : 'text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400'}`}
                                                        title={accountData.cashIsEmergency ? "Shielded as Emergency Reserve" : "Click to shield as Emergency Reserve"}
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Cash-like Funds - Using FundRow for consistency */}
                                            {(accountData.funds || [])
                                                .filter(f => f.type === 'money_market' || f.type === 'cash')
                                                .map(fund => (
                                                    <FundRow
                                                        key={fund.id}
                                                        fund={fund}
                                                        accountId={accountData.id}
                                                        updateFund={updateFund}
                                                        removeFund={removeFund}
                                                    />
                                                ))
                                            }

                                            <button
                                                onClick={() => addFund(accountData.id, 'money_market')}
                                                className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-white dark:bg-zinc-900/50 border border-emerald-100 dark:border-emerald-800/50 rounded-lg transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Money Market Fund (VMFXX, SPAXX, SWVXX)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Funds List (Excludes Money Markets) */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Layers className="w-4 h-4 text-zinc-400" />
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Investments</h4>
                                        </div>

                                        {(accountData.funds || []).filter(f => f.type !== 'money_market' && f.type !== 'cash').length === 0 ? (
                                            <div className="text-center py-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl">
                                                <p className="text-xs text-zinc-400 mb-2">No investment funds added yet.</p>
                                                <button
                                                    onClick={() => addFund(accountData.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Fund
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="hidden md:grid grid-cols-12 gap-4 px-2 pb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                                    <div className="col-span-4">Fund / Ticker</div>
                                                    <div className="col-span-4">Asset Class</div>
                                                    <div className="col-span-3">Value ($)</div>
                                                    <div className="col-span-1"></div>
                                                </div>

                                                {(accountData.funds || [])
                                                    .filter(f => f.type !== 'money_market' && f.type !== 'cash')
                                                    .map((fund) => (
                                                        <FundRow
                                                            key={fund.id}
                                                            fund={fund}
                                                            accountId={accountData.id}
                                                            updateFund={updateFund}
                                                            removeFund={removeFund}
                                                        />
                                                    ))}

                                                <button
                                                    onClick={() => addFund(accountData.id)}
                                                    className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl transition-all mt-2"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Investment Fund
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                )}
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Add Account Modal */}
            {showAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Add New Account</h3>
                            <button onClick={() => setShowAccountModal(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fidelity Brokerage"
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={newAccountName}
                                    onChange={(e) => setNewAccountName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Type</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {ACCOUNT_CREATION_OPTIONS.map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => setNewAccountType(option.id)}
                                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${newAccountType === option.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                                        >
                                            <div className={`p-2 rounded-full ${newAccountType === option.id ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                                <option.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className={`text-sm font-semibold ${newAccountType === option.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{option.name}</div>
                                                <div className="text-xs text-zinc-400">{option.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-3">
                            <button onClick={() => setShowAccountModal(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">Cancel</button>
                            <button onClick={() => handleCreateAccount()} disabled={!newAccountName.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Create Account</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Paste Modal Logic handled by passing a handler */}
            <PasteModal
                isOpen={pasteModal.isOpen}
                accountId={pasteModal.accountId}
                onClose={() => setPasteModal({ isOpen: false, accountId: null })}
                onImport={(accId, funds) => {
                    if (importFunds) importFunds(accId, funds);
                }}
            />
        </div>
    );
};

export default AccountsManager;
