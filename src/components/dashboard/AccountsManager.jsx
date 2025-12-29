
import React, { useState } from 'react';
import { Plus, Shield, Wallet, Upload, Trash2, X, Layers } from 'lucide-react';
import Card from '../ui/Card';
import FundRow from './FundRow';
import PasteModal from './PasteModal';
import { ACCOUNT_CREATION_OPTIONS } from '../../utils/constants';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

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
    isDarkMode
}) => {
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountType, setNewAccountType] = useState(ACCOUNT_CREATION_OPTIONS[1].id);
    const [pasteModal, setPasteModal] = useState({ isOpen: false, accountId: null });

    const handleCreateAccount = () => {
        createAccount(newAccountName, newAccountType);
        setNewAccountName('');
        setShowAccountModal(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Your Accounts</h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500 hidden sm:inline">Total: {formatCurrency(totalNetWorth)}</span>
                    <button
                        onClick={() => setShowAccountModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Account
                    </button>
                </div>
            </div>

            {/* Shield Toggle Legend */}
            {Object.values(accounts).length > 0 && (
                <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">Emergency Fund Shield</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                Use the <Shield className="w-3 h-3 inline mx-0.5" /> shield icon to mark cash or funds as emergency reserves.
                                Shielded assets are excluded from rebalancing calculations and count toward your emergency fund target.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Account List */}
            <div className="grid grid-cols-1 gap-6">
                {Object.values(accounts).length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-zinc-400 mb-4">You haven't added any accounts yet.</p>
                        <button
                            onClick={() => setShowAccountModal(true)}
                            className="text-emerald-600 font-medium hover:underline"
                        >
                            Create your first account
                        </button>
                    </div>
                ) : (
                    Object.values(accounts).map((accountData) => {
                        const typeOption = ACCOUNT_CREATION_OPTIONS.find(o => o.id === accountData.typeId);
                        const Icon = typeOption ? typeOption.icon : Wallet;

                        const totalAccountValue = (parseFloat(accountData.cash) || 0) + (Array.isArray(accountData.funds) ? accountData.funds.reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0) : 0);

                        return (
                            <Card key={accountData.id} className="p-0">
                                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/20">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-zinc-500 shadow-sm'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{accountData.name}</h3>
                                                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded uppercase tracking-wide">{accountData.taxType}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500">{typeOption ? typeOption.name : 'Custom Account'} • {formatCurrency(totalAccountValue)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setPasteModal({ isOpen: true, accountId: accountData.id })} className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all" title="Smart Paste Import">
                                            <Upload className="w-4 h-4" />
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

                                <div className="p-4 space-y-4">
                                    {/* Consolidated Cash & Equivalents Section */}
                                    <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-800/50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100 dark:border-emerald-800/50">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-tight">Cash & Equivalents</h4>
                                            </div>
                                            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(
                                                    (parseFloat(accountData.cash) || 0) +
                                                    (accountData.funds || [])
                                                        .filter(f => f.type === 'money_market')
                                                        .reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0)
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {/* Settlement Cash Item - Now Editable */}
                                            <div className="flex items-center justify-between text-xs py-2 bg-white/50 dark:bg-white/5 rounded px-2">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-zinc-700 dark:text-zinc-300">Settlement Cash</span>
                                                        <button
                                                            onClick={() => updateAccount(accountData.id, 'cashIsEmergency', !accountData.cashIsEmergency)}
                                                            className={`p-1 rounded transition-colors ${accountData.cashIsEmergency ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-zinc-300 hover:text-zinc-400'}`}
                                                            title={accountData.cashIsEmergency ? "Cash counts as Emergency Fund" : "Cash counts as Investment"}
                                                        >
                                                            <Shield className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 italic">Held as cash in account sweep</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={accountData.cash}
                                                        onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                                                        onWheel={(e) => e.target.blur()}
                                                        onChange={(e) => updateAccountCash(accountData.id, e.target.value)}
                                                        className="w-24 pl-5 pr-2 py-1 text-xs font-mono font-bold border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Money Market Funds Items */}
                                            {(accountData.funds || [])
                                                .filter(f => f.type === 'money_market')
                                                .map(fund => (
                                                    <div key={fund.id} className="flex items-center justify-between text-xs py-2 px-2 border-t border-emerald-50/50 dark:border-emerald-900/10">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{fund.name}</span>
                                                                {fund.isEmergency && <Shield className="w-3 h-3 text-amber-500" />}
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 uppercase">{fund.ticker || 'No Ticker'}</span>
                                                        </div>
                                                        <div className="font-mono text-zinc-800 dark:text-zinc-200">{formatCurrency(parseFloat(fund.value) || 0)}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    {/* Main Funds List (Excludes Money Markets) */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Layers className="w-4 h-4 text-zinc-400" />
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Investments</h4>
                                        </div>

                                        {(accountData.funds || []).filter(f => f.type !== 'money_market').length === 0 ? (
                                            <div className="text-center py-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-lg">
                                                <p className="text-xs text-zinc-400 mb-2">No investment funds added yet.</p>
                                                <button
                                                    onClick={() => addFund(accountData.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Fund
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="hidden md:grid grid-cols-12 gap-4 px-2 pb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                                    <div className="col-span-4">Fund Name</div>
                                                    <div className="col-span-4">Asset Class</div>
                                                    <div className="col-span-3">Value ($)</div>
                                                    <div className="col-span-1"></div>
                                                </div>

                                                {(accountData.funds || [])
                                                    .filter(f => f.type !== 'money_market')
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
                                                    className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg transition-all mt-2"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Investment Fund
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
