import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RebalanceFrequencyCalc() {
    const [portfolioSize, setPortfolioSize] = useState('');
    const [annualReturn, setAnnualReturn] = useState('7');
    const [drift, setDrift] = useState('');

    const calculateRecommendation = () => {
        const size = parseFloat(portfolioSize) || 0;
        const driftPct = parseFloat(drift) || 0;

        if (size === 0) return null;

        // Simple heuristic-based recommendation
        let recommendation = 'annual';
        let reasoning = '';

        if (size < 50000) {
            recommendation = 'annual';
            reasoning = 'For smaller portfolios, annual rebalancing minimizes transaction costs while maintaining alignment.';
        } else if (size < 250000) {
            recommendation = 'semiannual';
            reasoning = 'Mid-size portfolios benefit from semi-annual rebalancing to capture growth while controlling trading frequency.';
        } else if (size < 1000000) {
            recommendation = 'quarterly';
            reasoning = 'Larger portfolios can afford quarterly rebalancing for tighter alignment with targets.';
        } else {
            recommendation = 'bands';
            reasoning = 'For substantial portfolios, threshold-based rebalancing (5/25 rule) is most tax-efficient.';
        }

        // Adjust for drift tolerance
        if (driftPct > 0 && driftPct < 3) {
            recommendation = 'quarterly';
            reasoning = 'Your low drift tolerance suggests more frequent rebalancing.';
        } else if (driftPct >= 10) {
            recommendation = 'annual';
            reasoning = 'Your high drift tolerance allows for less frequent, lower-cost rebalancing.';
        }

        const strategies = {
            'annual': {
                frequency: 'Annual',
                description: 'Rebalance once per year (e.g., January 1st)',
                pros: ['Minimal transaction costs', 'Simple to execute', 'Tax-efficient for taxable accounts'],
                cons: ['Allows more drift', 'May miss opportunities'],
                bestFor: 'Portfolios under $100k, tax-conscious investors'
            },
            'semiannual': {
                frequency: 'Semi-Annual',
                description: 'Rebalance twice per year (e.g., January and July)',
                pros: ['Balanced approach', 'Moderate costs', 'Catches major drifts'],
                cons: ['More work than annual', 'May trigger short-term gains'],
                bestFor: 'Portfolios $100k-$500k'
            },
            'quarterly': {
                frequency: 'Quarterly',
                description: 'Rebalance every 3 months',
                pros: ['Tight alignment', 'Responsive to markets', 'Professional standard'],
                cons: ['Higher transaction costs', 'More short-term gains', 'Time intensive'],
                bestFor: 'Portfolios over $500k, active managers'
            },
            'bands': {
                frequency: 'Threshold-Based (5/25 Rule)',
                description: 'Rebalance when drift exceeds 5% absolute or 25% relative',
                pros: ['Most tax-efficient', 'Opportunistic timing', 'Reduces unnecessary trades'],
                cons: ['Requires monitoring', 'Irregular schedule', 'Complex to track'],
                bestFor: 'Large portfolios, tax-focused investors'
            },
            'inflow': {
                frequency: 'Inflow-Only',
                description: 'Only rebalance with new contributions, never sell',
                pros: ['Zero tax impact', 'No transaction costs', 'Accumulation-focused'],
                cons: ['Allows maximum drift', 'Only works during contribution phase'],
                bestFor: 'Accumulation phase, high earners'
            }
        };

        return {
            recommendation,
            details: strategies[recommendation],
            allStrategies: strategies,
            reasoning
        };
    };

    const result = calculateRecommendation();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link to="/calculators" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Calculators
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-10 h-10 text-emerald-600" />
                    <h1 className="text-4xl font-bold">Rebalancing Frequency Calculator</h1>
                </div>

                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                    Find the optimal rebalancing schedule for your portfolio based on size and goals.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-xl font-semibold mb-4">Portfolio Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Portfolio Size</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                        <input
                                            type="number"
                                            value={portfolioSize}
                                            onChange={(e) => setPortfolioSize(e.target.value)}
                                            placeholder="250000"
                                            className="w-full pl-8 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
                                    <input
                                        type="number"
                                        value={annualReturn}
                                        onChange={(e) => setAnnualReturn(e.target.value)}
                                        placeholder="7"
                                        step="0.5"
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">Typical: 7% for 60/40, 9% for 80/20</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Max Acceptable Drift (%)</label>
                                    <input
                                        type="number"
                                        value={drift}
                                        onChange={(e) => setDrift(e.target.value)}
                                        placeholder="5"
                                        step="1"
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">How far from target before rebalancing?</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {result ? (
                            <>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                                    <h2 className="text-xl font-semibold mb-2">Recommended Strategy</h2>
                                    <div className="text-3xl font-bold text-emerald-600 mb-3">
                                        {result.details.frequency}
                                    </div>
                                    <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                                        {result.details.description}
                                    </p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {result.reasoning}
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                                    <h3 className="font-semibold mb-3">Pros & Cons</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-emerald-600 mb-1">Advantages:</p>
                                            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                                {result.details.pros.map((pro, i) => (
                                                    <li key={i}>• {pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-rose-600 mb-1">Disadvantages:</p>
                                            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                                {result.details.cons.map((con, i) => (
                                                    <li key={i}>• {con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                            <p className="text-sm">
                                                <span className="font-medium">Best for:</span> {result.details.bestFor}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 text-center">
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Enter your portfolio size to see your recommended rebalancing frequency.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 prose dark:prose-invert max-w-none">
                    <h2>Choosing Your Rebalancing Strategy</h2>
                    <p>
                        There's no one-size-fits-all rebalancing frequency. The right approach depends on your portfolio size, tax situation, and how hands-on you want to be.
                    </p>

                    <h3>The 5/25 Rule (Threshold-Based)</h3>
                    <p>
                        Rebalance when an asset class drifts more than:
                    </p>
                    <ul>
                        <li><strong>5% absolute</strong> for major allocations (e.g., 60% stocks becomes 55% or 65%)</li>
                        <li><strong>25% relative</strong> for minor allocations (e.g., 10% REITs becomes 7.5% or 12.5%)</li>
                    </ul>
                    <p>
                        This approach is tax-efficient because you only trade when necessary, avoiding frequent short-term capital gains.
                    </p>

                    <h3>Tax Considerations</h3>
                    <p>
                        For taxable accounts, less frequent rebalancing often beats more frequent rebalancing due to tax drag. Consider:
                    </p>
                    <ul>
                        <li>Rebalancing with new contributions (inflow-only)</li>
                        <li>Using tax-loss harvesting opportunities</li>
                        <li>Rebalancing only in tax-advantaged accounts (IRA, 401k)</li>
                    </ul>

                    <h3>Implementation with Balanced</h3>
                    <p>
                        The <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Balanced app</Link> supports all these strategies and can show you exactly when drift bands are breached, making it easy to execute your chosen approach.
                    </p>
                </div>
            </div>
        </div>
    );
}
