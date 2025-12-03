import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssetAllocationCalc() {
    const [age, setAge] = useState('');
    const [strategy, setStrategy] = useState('smart');
    const [retirementAge, setRetirementAge] = useState('65');

    const calculateAllocation = () => {
        const numericAge = parseInt(age) || 0;
        const retirement = parseInt(retirementAge) || 65;

        if (numericAge === 0 || numericAge < 18 || numericAge > 100) return null;

        let bondAllocation = 0;

        switch (strategy) {
            case 'aggressive':
                bondAllocation = Math.max(0, numericAge - 20);
                break;
            case 'moderate':
                bondAllocation = Math.max(0, numericAge - 10);
                break;
            case 'conservative':
                bondAllocation = Math.min(100, numericAge);
                break;
            case 'smart':
            default:
                // Non-linear glide path
                const BOND_MIN = 10;
                const BOND_MAX = 60;
                const GLIDE_PATH_START_AGE = 30;

                if (numericAge < GLIDE_PATH_START_AGE) {
                    bondAllocation = BOND_MIN;
                } else if (numericAge >= retirement) {
                    bondAllocation = BOND_MAX;
                } else {
                    const totalBondRange = BOND_MAX - BOND_MIN;
                    const totalGlidePathYears = retirement - GLIDE_PATH_START_AGE;
                    const yearsIntoGlidePath = numericAge - GLIDE_PATH_START_AGE;
                    const P = yearsIntoGlidePath / totalGlidePathYears;
                    const bondIncrease = totalBondRange * (P * P);
                    bondAllocation = Math.round(BOND_MIN + bondIncrease);
                }
                break;
        }

        bondAllocation = Math.max(0, Math.min(100, bondAllocation));
        const stockAllocation = 100 - bondAllocation;

        return {
            stocks: stockAllocation,
            bonds: bondAllocation,
            yearsToRetirement: Math.max(0, retirement - numericAge)
        };
    };

    const result = calculateAllocation();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link to="/calculators" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Calculators
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-10 h-10 text-emerald-600" />
                    <h1 className="text-4xl font-bold">Asset Allocation Calculator</h1>
                </div>

                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                    Determine your optimal stock-to-bond ratio based on your age and risk tolerance.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-xl font-semibold mb-4">Your Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Your Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="35"
                                        min="18"
                                        max="100"
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Target Retirement Age</label>
                                    <input
                                        type="number"
                                        value={retirementAge}
                                        onChange={(e) => setRetirementAge(e.target.value)}
                                        placeholder="65"
                                        min="50"
                                        max="80"
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Strategy</label>
                                    <select
                                        value={strategy}
                                        onChange={(e) => setStrategy(e.target.value)}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="smart">Target Date (Smart)</option>
                                        <option value="aggressive">Aggressive (Age - 20)</option>
                                        <option value="moderate">Moderate (Age - 10)</option>
                                        <option value="conservative">Conservative (Age)</option>
                                    </select>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {strategy === 'smart' && 'Non-linear glide path, recommended for most'}
                                        {strategy === 'aggressive' && 'Maximum growth potential, higher volatility'}
                                        {strategy === 'moderate' && 'Balanced growth and stability'}
                                        {strategy === 'conservative' && 'Lower risk, slower growth'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {result ? (
                            <>
                                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                                    <h2 className="text-xl font-semibold mb-4">Recommended Allocation</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-emerald-600">Stocks / Equities</span>
                                                <span className="text-2xl font-bold">{result.stocks}%</span>
                                            </div>
                                            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-600 rounded-full transition-all"
                                                    style={{ width: `${result.stocks}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-rose-600">Bonds / Fixed Income</span>
                                                <span className="text-2xl font-bold">{result.bonds}%</span>
                                            </div>
                                            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-rose-600 rounded-full transition-all"
                                                    style={{ width: `${result.bonds}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Years to retirement: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{result.yearsToRetirement}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold mb-2">💡 Next Steps</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                                        Use <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Balanced</Link> to implement this allocation across your accounts with tax-efficient asset location.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 text-center">
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Enter your age to see your recommended asset allocation.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 prose dark:prose-invert max-w-none">
                    <h2>Understanding Asset Allocation</h2>
                    <p>
                        Asset allocation is the mix of stocks and bonds in your portfolio. It's the single most important factor in your investment returns and risk level.
                    </p>

                    <h3>Why Bonds Increase with Age</h3>
                    <p>
                        As you approach retirement, you have less time to recover from market downturns. Gradually increasing bond allocation reduces volatility and protects your accumulated wealth.
                    </p>

                    <h3>Common Allocation Strategies</h3>
                    <ul>
                        <li><strong>Target Date:</strong> Non-linear glide path that accelerates bond allocation as retirement approaches</li>
                        <li><strong>Age Rule (Age - 10):</strong> Simple rule of thumb: bond % = your age minus 10</li>
                        <li><strong>Conservative (Age):</strong> Bond % equals your age</li>
                        <li><strong>Aggressive (Age - 20):</strong> Higher stock allocation for growth seekers</li>
                    </ul>

                    <h3>Beyond the Basic Mix</h3>
                    <p>
                        While this calculator shows stocks vs bonds, a complete portfolio includes US stocks, international stocks, and various bond types. Use the Balanced app to create a detailed multi-asset allocation.
                    </p>
                </div>
            </div>
        </div>
    );
}
