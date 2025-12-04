import React from 'react';
import { ArrowLeft, Calendar, Layers, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleWrapper from './ArticleLayout';

export default function RebalancingGuide() {
    return (
        <ArticleWrapper>
            <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
            </Link>

            <article>
                <h1>The Complete Guide to Portfolio Rebalancing</h1>

                <p className="lead">
                    Portfolio rebalancing—the practice of periodically realigning your portfolio to its target allocation—is widely discussed but theoretically ambiguous. This guide examines the rationales, competing strategies, and practical trade-offs.
                </p>

                <h2>What is Portfolio Rebalancing?</h2>
                <p>
                    Rebalancing is the process of realigning your investment portfolio to match your target asset allocation. Over time, some investments grow faster than others, causing your portfolio to drift away from your intended mix of stocks, bonds, and other assets.
                </p>
                <p>
                    For example, if you have a target allocation of 70% stocks and 30% bonds, a strong stock market might push your actual allocation to 80% stocks and 20% bonds. Rebalancing would involve selling some stocks and buying bonds to return to your 70/30 target.
                </p>

                <h2>Theoretical Rationales for Rebalancing</h2>

                <h3>1. Risk Control</h3>
                <p>
                    The primary theoretical argument for rebalancing is risk management. As higher-risk assets (typically stocks) outperform, they constitute a larger portfolio share, increasing overall risk exposure beyond your target. Rebalancing mechanically enforces your desired risk level by trimming appreciated assets and adding to depreciated ones.
                </p>
                <p>
                    <strong>Caveat:</strong> This assumes your target allocation accurately reflects your risk tolerance, which may evolve over time. Some research suggests that lifecycle changes (aging, wealth accumulation) might justify allowing drift rather than fighting it.
                </p>

                <h3>2. Contrarian Discipline</h3>
                <p>
                    Rebalancing creates a systematic "sell high, buy low" mechanism, potentially counteracting behavioral biases like trend-chasing or panic-selling. The evidence for behavioral benefits is largely theoretical—it's difficult to isolate rebalancing discipline from other portfolio management practices.
                </p>

                <h3>3. Risk-Adjusted Returns (Contested)</h3>
                <p>
                    Some academic studies suggest rebalanced portfolios achieve superior risk-adjusted returns compared to "buy-and-hold" drift portfolios. However, results vary by time period, market conditions, and asset classes examined. The "rebalancing bonus" may be overstated—much depends on mean reversion assumptions that don't always hold.
                </p>
                <p>
                    Notable finding: Rebalancing tends to reduce returns during sustained bull markets but limits drawdowns during corrections. Whether this trade-off is favorable depends on your risk preferences and time horizon.
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
                        <strong>Trade-offs:</strong> Simplicity and predictability vs. economic irrelevance of calendar dates. May rebalance unnecessarily or miss opportunities.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Tax considerations:</strong> Annual timing allows long-term capital gains treatment and can coincide with tax-loss harvesting.
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
                        <strong>Trade-offs:</strong> Only trade when economically motivated (drift exceeds threshold) vs. requires active monitoring. Rebalancing frequency varies with market volatility.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Considerations:</strong> Threshold selection is somewhat arbitrary. Tighter bands = more trading costs but tighter risk control. May never trigger in low-volatility environments.
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
                        <strong>Trade-offs:</strong> Zero tax impact and no transaction costs vs. allows more drift and requires regular contributions. Effectiveness depends on contribution size relative to portfolio.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Limitations:</strong> Can't correct large imbalances without selling. Portfolio may drift substantially if contributions are small relative to account size.
                    </p>
                </div>

                <h2>Rebalancing Frequency: Trade-offs</h2>
                <p>
                    The optimal rebalancing frequency depends on your specific situation and involves trade-offs between risk control, tax efficiency, and transaction costs. Academic research presents conflicting findings:
                </p>
                <ul>
                    <li><strong>Monthly/Quarterly:</strong> Tighter risk control but higher transaction costs and potential tax drag in taxable accounts. Some studies find minimal performance difference vs. annual.</li>
                    <li><strong>Annual:</strong> Often proposed as a compromise, though the theoretical justification is weak—calendar dates have no economic significance. May coincide with tax planning.</li>
                    <li><strong>Threshold-based (5/25 rule):</strong> Economically motivated triggers, but requires monitoring. Can result in never rebalancing during low-volatility periods or excessive trading during volatility spikes.</li>
                    <li><strong>Ad-hoc (5+ years):</strong> Minimizes costs and taxes but allows substantial drift. Some evidence suggests drift isn't always harmful if your risk tolerance evolves with your portfolio.</li>
                </ul>
                <p>
                    The "best" frequency is contested. Vanguard research suggests annual or semi-annual for most investors, but assumes stable real-world frictions. Historical backtests show minimal performance differences across reasonable frequencies (annual vs. quarterly), though risk exposure varies meaningfully.
                </p>

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
