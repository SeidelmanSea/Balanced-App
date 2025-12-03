import React from 'react';
import { ArrowLeft, Calendar, Layers, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleWrapper, { articleStyles } from './ArticleLayout';

export default function RebalancingGuide() {
    return (
        <ArticleWrapper>
            <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
            </Link>

            <article className={articleStyles}>
                <h1>The Complete Guide to Portfolio Rebalancing</h1>

                <p className="lead">
                    Portfolio rebalancing is one of the most important—yet often overlooked—aspects of long-term investing. This guide explains when, why, and how to rebalance your portfolio to maintain your target allocation and manage risk.
                </p>

                <h2>What is Portfolio Rebalancing?</h2>
                <p>
                    Rebalancing is the process of realigning your investment portfolio to match your target asset allocation. Over time, some investments grow faster than others, causing your portfolio to drift away from your intended mix of stocks, bonds, and other assets.
                </p>
                <p>
                    For example, if you have a target allocation of 70% stocks and 30% bonds, a strong stock market might push your actual allocation to 80% stocks and 20% bonds. Rebalancing would involve selling some stocks and buying bonds to return to your 70/30 target.
                </p>

                <h2>Why Rebalance?</h2>
                <h3>1. Risk Management</h3>
                <p>
                    The primary reason to rebalance is to control risk. When stocks outperform, your portfolio becomes more stock-heavy and riskier than you intended. Rebalancing forces you to sell winners and buy laggards, maintaining your desired risk level.
                </p>

                <h3>2. Discipline</h3>
                <p>
                    Rebalancing enforces the "buy low, sell high" principle automatically. It removes emotion from the equation, preventing you from chasing returns or panic-selling during downturns.
                </p>

                <h3>3. Long-Term Performance</h3>
                <p>
                    Studies show that rebalanced portfolios often outperform "drift" portfolios on a risk-adjusted basis over long periods. While letting winners run might produce higher returns in bull markets, rebalancing provides better downside protection.
                </p>

                <h2>Rebalancing Strategies</h2>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                    <div className="flex items-start gap-3 mb-4">
                        <Calendar className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Calendar Rebalancing</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Rebalance on a fixed schedule regardless of drift.
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>How it works:</strong> Pick a recurring date (e.g., January 1st or your birthday) and rebalance then.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Pros:</strong> Simple, easy to remember, tax-efficient if done annually.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Best for:</strong> Most investors, especially those with taxable accounts.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                    <div className="flex items-start gap-3 mb-4">
                        <Layers className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Threshold/Drift Bands (5/25 Rule)</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Rebalance when an asset class drifts beyond set thresholds.
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>How it works:</strong> Set tolerance bands. Rebalance when an asset drifts more than 5% absolute (for major holdings) or 25% relative (for minor holdings).
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Example:</strong> If your 60% stock allocation drifts to 65% or 55%, rebalance. If your 10% REIT allocation drifts to 12.5% or 7.5%, rebalance.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Pros:</strong> Only trade when necessary, more tax-efficient, opportunistic timing.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Best for:</strong> Larger portfolios ($250k+), investors comfortable with monitoring.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                    <div className="flex items-start gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Inflow-Only Rebalancing</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Never sell—only use new contributions to rebalance.
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>How it works:</strong> Direct new contributions to underweight asset classes.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Pros:</strong> Zero tax impact, no transaction costs, perfect for accumulation phase.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Cons:</strong> Allows more drift, only works if you're contributing regularly.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Best for:</strong> Young investors, high earners in accumulation mode.
                    </p>
                </div>

                <h2>How Often Should You Rebalance?</h2>
                <p>
                    Research suggests annual rebalancing hits the sweet spot for most investors:
                </p>
                <ul>
                    <li><strong>Too frequent</strong> (monthly/quarterly): Higher transaction costs and taxes with marginal benefit</li>
                    <li><strong>Annual</strong>: Good balance of risk control and cost efficiency</li>
                    <li><strong>Too infrequent</strong> (5+ years): Portfolio can drift significantly from targets</li>
                </ul>

                <h2>Tax-Efficient Rebalancing</h2>
                <p>
                    For taxable accounts, rebalancing can trigger capital gains taxes. Strategies to minimize tax impact:
                </p>
                <ul>
                    <li>Rebalance primarily in tax-advantaged accounts (IRA, 401k) where trades don't trigger taxes</li>
                    <li>Use new contributions to buy underweight assets instead of selling</li>
                    <li>Harvest tax losses when rebalancing (sell losing positions at a loss to offset gains)</li>
                    <li>Consider annual rebalancing to ensure gains qualify for long-term capital gains rates</li>
                </ul>

                <h2>Practical Implementation</h2>
                <p>
                    The <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Balanced app</Link> automates rebalancing calculations across all your accounts. It:
                </p>
                <ul>
                    <li>Calculates optimal trades to reach your target allocation</li>
                    <li>Prioritizes tax-advantaged accounts for rebalancing trades</li>
                    <li>Supports calendar, drift bands, and inflow-only strategies</li>
                    <li>Shows you exactly what to buy and sell in each account</li>
                </ul>

                <h2>Common Mistakes to Avoid</h2>
                <ul>
                    <li><strong>Ignoring tax implications:</strong> Rebalancing in taxable accounts can trigger big tax bills</li>
                    <li><strong>Rebalancing too frequently:</strong> Creates unnecessary costs without meaningful benefit</li>
                    <li><strong>Not rebalancing at all:</strong> Lets your portfolio drift far from your risk tolerance</li>
                    <li><strong>Emotional rebalancing:</strong> Making changes based on market fears rather than your plan</li>
                </ul>

                <h2>Getting Started</h2>
                <p>
                    Ready to rebalance your portfolio? Use our <Link to="/calculators/rebalance-frequency" className="text-emerald-600 hover:text-emerald-700 font-medium">rebalancing frequency calculator</Link> to determine the best schedule for your situation, or <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">launch the Balanced app</Link> to get specific trade recommendations.
                </p>
            </article>

            <div className="mt-12 flex gap-4">
                <Link
                    to="/calculators/rebalance-frequency"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Try Rebalancing Calculator
                </Link>
                <Link
                    to="/resources"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold rounded-lg transition-colors"
                >
                    More Articles
                </Link>
            </div>
        </ArticleWrapper>
    );
}
