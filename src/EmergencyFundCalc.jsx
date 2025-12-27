import React, { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import SEO from './components/SEO';
import { Link } from 'react-router-dom';

export default function EmergencyFundCalc() {
    const [monthlyExpenses, setMonthlyExpenses] = useState('');
    const [riskTolerance, setRiskTolerance] = useState('moderate');
    const [employment, setEmployment] = useState('stable');

    const calculateFund = () => {
        const expenses = parseFloat(monthlyExpenses) || 0;
        if (expenses === 0) return null;

        let months = 3; // Base case

        // Adjust based on employment stability
        if (employment === 'stable') months = 3;
        else if (employment === 'moderate') months = 6;
        else if (employment === 'variable') months = 9;

        // Adjust based on risk tolerance
        if (riskTolerance === 'conservative') months += 3;
        else if (riskTolerance === 'aggressive') months = Math.max(3, months - 3);

        return {
            recommended: expenses * months,
            min: expenses * 3,
            max: expenses * 12,
            months
        };
    };

    const result = calculateFund();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SEO
                title="Emergency Fund Calculator"
                description="Calculate how much you should save for emergencies based on your monthly expenses and risk tolerance."
                canonical="/calculators/emergency-fund"
            />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link to="/calculators" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Calculators
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-10 h-10 text-emerald-600" />
                    <h1 className="text-4xl font-bold">Emergency Fund Calculator</h1>
                </div>

                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                    Calculate how much you should save for unexpected expenses based on your financial situation and risk tolerance.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-xl font-semibold mb-4">Your Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Monthly Expenses</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                        <input
                                            type="number"
                                            value={monthlyExpenses}
                                            onChange={(e) => setMonthlyExpenses(e.target.value)}
                                            placeholder="5000"
                                            className="w-full pl-8 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">Include rent, food, utilities, insurance, etc.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Employment Stability</label>
                                    <select
                                        value={employment}
                                        onChange={(e) => setEmployment(e.target.value)}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="stable">Stable (salaried, tenured)</option>
                                        <option value="moderate">Moderate (contract, regular income)</option>
                                        <option value="variable">Variable (commission, freelance)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
                                    <select
                                        value={riskTolerance}
                                        onChange={(e) => setRiskTolerance(e.target.value)}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="aggressive">Aggressive (minimal buffer)</option>
                                        <option value="moderate">Moderate (balanced safety)</option>
                                        <option value="conservative">Conservative (maximum security)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {result ? (
                            <>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                                    <h2 className="text-xl font-semibold mb-4">Recommended Fund</h2>
                                    <div className="text-5xl font-bold text-emerald-600 mb-2">
                                        ${result.recommended.toLocaleString()}
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        {result.months} months of expenses
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                                    <h3 className="font-semibold mb-3">Range</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-400">Minimum (3 months)</span>
                                            <span className="font-semibold">${result.min.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-400">Maximum (12 months)</span>
                                            <span className="font-semibold">${result.max.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold mb-2">💡 Tip</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                        Keep your emergency fund in a high-yield savings account or money market fund for easy access and growth.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 text-center">
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Enter your monthly expenses to see your recommended emergency fund.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 prose dark:prose-invert max-w-none">
                    <h2>Why You Need an Emergency Fund</h2>
                    <p>
                        An emergency fund is a financial safety net for unexpected expenses like job loss, medical bills, or urgent home repairs. Having 3-6 months of expenses saved prevents you from going into debt or selling investments at a loss during emergencies.
                    </p>

                    <h3>How Much Should You Save?</h3>
                    <ul>
                        <li><strong>3 months:</strong> Minimum for stable employment with dual income</li>
                        <li><strong>6 months:</strong> Recommended for most households</li>
                        <li><strong>9-12 months:</strong> Variable income, single earner, or medical concerns</li>
                    </ul>

                    <h3>Where to Keep Your Emergency Fund</h3>
                    <p>
                        Store emergency funds in liquid, safe accounts like high-yield savings accounts or money market funds. Avoid investing emergency funds in stocks—you need guaranteed access without market risk.
                    </p>
                </div>
            </div>
        </div>
    );
}
