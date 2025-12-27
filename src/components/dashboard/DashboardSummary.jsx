
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Wallet, Plus, Shield, LayoutDashboard, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { ASSET_CLASSES } from '../../utils/constants';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const DashboardSummary = ({
    portfolioMetrics,
    accounts,
    setActiveTab,
    setShowAccountModal,
    isDarkMode
}) => {
    const { currentAllocation, targets, totalNetWorth, investableTotal, emergencyActual, emergencyTarget } = portfolioMetrics;
    const hasAccounts = Object.keys(accounts).length > 0;

    if (!hasAccounts) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-full mb-6">
                    <Wallet className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Welcome to Balanced</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">Start by adding your investment accounts to see your portfolio analysis.</p>
                <button
                    onClick={() => { setActiveTab('accounts'); setShowAccountModal(true); }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Your First Account
                </button>
            </div>
        );
    }

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

    const chartTooltipLabelStyle = {
        color: isDarkMode ? '#ffffff' : '#000',
        fontWeight: '500'
    };

    const chartTooltipItemStyle = {
        color: isDarkMode ? '#ffffff' : '#000'
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
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
                            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500" /> Emergency Reserve</h3>
                            <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(emergencyActual)}</p>
                            <p className="text-xs text-zinc-400 mt-1">Target: {formatCurrency(emergencyTarget)}</p>
                        </div>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${emergencyActual >= emergencyTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (emergencyActual / (emergencyTarget || 1)) * 100)}%` }}
                        ></div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-emerald-600" /> Allocation Overview</h3>
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
                            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">Add funds to see breakdown</div>
                        )}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Current vs Target ($)</h3>
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
                            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">Add funds to see comparison</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardSummary;
