import React from 'react';
import { ArrowLeft, Shield, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleWrapper from './ArticleLayout';

export default function TaxEfficientGuide() {
    return (
        <ArticleWrapper>
            <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
            </Link>

            <article>
                <h1>Tax-Efficient Investing: Asset Location Strategy</h1>

                <p className="lead">
                    Asset location—placing specific investments in specific account types—is a tax minimization strategy with demonstrated but variable benefits. This guide examines the theoretical framework, common approaches, and practical constraints.
                </p>

                <h2>Asset Location: Theoretical Framework</h2>
                <p>
                    Asset location (distinct from asset <em>allocation</em>) refers to the strategic placement of investments across account types to minimize lifetime tax burden. The core principle: different account types have different tax treatments, and different asset classes have different tax characteristics. Matching them optimally can improve after-tax returns.
                </p>
                <p>
                    <strong>Example:</strong> Bonds generate ordinary income taxed annually in taxable accounts. Holding them in a traditional IRA defers taxation until withdrawal, when you may be in a lower bracket. However, the benefit depends on your current vs. retirement tax rate—if rates rise or your retirement income is higher than expected, the advantage diminishes or reverses.
                </p>
                <p>
                    <strong>Magnitude of benefit:</strong> Academic estimates suggest asset location can add 0.10-0.75% annually to after-tax returns for investors with substantial holdings across multiple account types. Benefits are larger for high-income investors in high tax brackets with significant bond allocations.
                </p>

                <h2>Account Types and Tax Treatment</h2>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Taxable (Brokerage) Accounts
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Tax treatment:</strong> Dividends and interest taxed annually. Capital gains taxed when sold.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Commonly placed here:</strong> Tax-efficient equities (index funds, ETFs with low turnover). Qualified dividends taxed at 15-20% vs. ordinary income rates. Long-term capital gains also preferentially taxed and deferred until sale.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Tax-inefficient assets:</strong> Taxable bonds, REITs, actively managed funds generate ordinary income or frequent short-term gains taxed at higher rates.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        Tax-Deferred (Traditional IRA, 401k)
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Tax treatment:</strong> Growth tax-free. Withdrawals taxed as ordinary income in retirement.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Commonly placed here:</strong> Tax-inefficient assets (bonds, REITs, actively managed funds). These generate ordinary income or frequent trading, so sheltering from annual taxation is valuable.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Rationale:</strong> Withdrawals are taxed as ordinary income regardless of what you hold, so prioritize sheltering assets that would be heavily taxed in taxable accounts. Assumes withdrawal in lower tax bracket than accumulation.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Tax-Free (Roth IRA, Roth 401k)
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Tax treatment:</strong> Growth and withdrawals completely tax-free.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                        <strong>Commonly suggested:</strong> Highest-expected-return assets (often cited: small-cap value, emerging markets, high-growth stocks). Theory: maximize the benefit of tax-free compounding.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Critical caveat:</strong> This assumes these assets will outperform, which is uncertain. Higher expected returns typically mean higher risk and volatility. The tax-free benefit is only valuable if the assets actually grow.
                    </p>
                </div>

                <h2>Standard Tax-Efficient Placement Framework</h2>
                <p>
                    A commonly proposed asset location framework prioritizes minimizing current taxes while considering expected returns:
                </p>
                <ol>
                    <li><strong>Taxable accounts:</strong> Tax-efficient equities (index funds, ETFs). Qualified dividends face preferential 15-20% rates vs. ordinary income. Long-term capital gains are deferred until sale and also taxed preferentially.</li>
                    <li><strong>Tax-deferred accounts:</strong> Tax-inefficient assets (bonds, REITs, actively managed funds). These generate ordinary income or unqualified dividends that would otherwise face your marginal tax rate annually.</li>
                    <li><strong>Roth accounts:</strong> Highest <em>expected-return</em> assets. The theoretical argument: if Roth withdrawals are tax-free, placing higher-expected-return assets there maximizes the tax-free compounding benefit. Commonly suggested: small-cap value, emerging markets, high-volatility segments. <strong>Note:</strong> This assumes these assets will outperform, which is uncertain. They carry higher risk, and historical outperformance doesn't guarantee future results.</li>
                </ol>

                <h2>Roth Growth Maximization: Theory vs. Practice</h2>
                <p>
                    An alternative framework prioritizes Roth growth over immediate tax minimization, based on the premise that tax-free compounding value exceeds near-term tax savings:
                </p>
                <ul>
                    <li>Roth accounts: <strong>100% equities</strong> (tilted toward higher-expected-return factors if desired)</li>
                    <li>Traditional IRA: <strong>Bonds and tax-inefficient assets</strong></li>
                    <li>Taxable: <strong>Remainder</strong> (may include bonds if IRA space is insufficient)</li>
                </ul>
                <p>
                    <strong>Theoretical rationale:</strong> Roth accounts have the most valuable tax treatment (no RMDs, tax-free withdrawals). Placing highest-expected-return assets there maximizes this benefit over decades of compounding.
                </p>
                <p>
                    <strong>Practical considerations:</strong> This strategy may increase taxable ordinary income now (if bonds spill into taxable), trading current tax costs for potential future tax-free growth. Whether this trade-off is favorable depends on: (1) your current vs. expected retirement tax bracket, (2) whether higher-expected-return assets actually outperform, (3) time horizon, and (4) your Roth balance relative to total portfolio. More aggressive for younger investors with smaller Roth balances and long time horizons.
                </p>

                <h2>Real-World Example</h2>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 my-8">
                    <h3 className="text-lg font-semibold mb-3">Portfolio: $500k (40% stocks, 60% bonds)</h3>
                    <p className="text-sm mb-4">Accounts: $200k taxable, $200k traditional IRA, $100k Roth IRA</p>

                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-emerald-600 mb-1">Tax-Efficient Placement:</p>
                            <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                                <li>• Taxable ($200k): $200k stocks</li>
                                <li>• Traditional IRA ($200k): $200k bonds</li>
                                <li>• Roth IRA ($100k): $100k stocks (growth focus)</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold text-rose-600 mb-1">Tax-Inefficient Placement:</p>
                            <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                                <li>• Taxable ($200k): $120k bonds, $80k stocks</li>
                                <li>• Traditional IRA ($200k): $120k stocks, $80k bonds</li>
                                <li>• Roth IRA ($100k): $100k bonds</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4">
                        <strong>Annual tax difference:</strong> ~$2,000-4,000/year depending on bond yields. Over 30 years, this compounds to $100k+ in additional wealth.
                    </p>
                </div>

                <h2>When Asset Location Matters Most</h2>
                <p>
                    Asset location provides the biggest benefit when:
                </p>
                <ul>
                    <li>You have balances across multiple account types (taxable + IRA + Roth)</li>
                    <li>You hold bonds or other tax-inefficient assets</li>
                    <li>You're in a high tax bracket (22%+)</li>
                    <li>Your portfolio is large enough that tax savings are meaningful ($100k+)</li>
                </ul>

                <h2>Implementing with Balanced</h2>
                <p>
                    The <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Balanced app</Link> automates tax-efficient asset location across all your accounts. Choose from:
                </p>
                <ul>
                    <li><strong>Standard Tax Efficiency:</strong> Stocks in taxable, bonds in IRA</li>
                    <li><strong>Roth Growth Maximization:</strong> All stocks in Roth</li>
                    <li><strong>Mirrored Allocation:</strong> Same mix in all accounts (if preferred)</li>
                </ul>
                <p>
                    Balanced calculates the optimal placement and shows exactly what to hold in each account.
                </p>

                <h2>Common Misconceptions</h2>
                <ul>
                    <li><strong>"I should mirror my allocation across all accounts":</strong> This is tax-inefficient. think of all accounts as one portfolio and optimize placement.</li>
                    <li><strong>"Tax-loss harvesting is more important than asset location":</strong> Asset location provides permanent annual tax savings, not just one-time offsets.</li>
                    <li><strong>"This only matters for the wealthy":</strong> Even a $150k portfolio can save $1,500+/year with proper location.</li>
                </ul>

                <h2>Next Steps</h2>
                <p>
                    Ready to optimize your portfolio for taxes? <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Launch Balanced</Link> and select your preferred tax strategy. The app will handle all the complex calculations and show you exactly which assets belong in which accounts.
                </p>
            </article>

            <div className="mt-12 flex gap-4">
                <Link
                    to="/app"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Optimize My Portfolio
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
