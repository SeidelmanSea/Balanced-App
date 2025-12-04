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
                    Asset location—placing the right investments in the right account types—can significantly boost your after-tax returns. This guide explains how to optimize your portfolio across taxable, tax-deferred, and Roth accounts.
                </p>

                <h2>What is Asset Location?</h2>
                <p>
                    Asset location (not to be confused with asset <em>allocation</em>) is the strategy of placing specific investments in specific account types to minimize taxes. The same portfolio can have very different after-tax returns depending on which assets you hold where.
                </p>
                <p>
                    For example, holding bonds in a taxable brokerage account means paying ordinary income tax on interest every year. Moving those same bonds to a traditional IRA defers all taxes until retirement, potentially saving thousands of dollars annually.
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
                        <strong>Best for:</strong> Tax-efficient investments like index funds, municipal bonds, stocks with qualified dividends.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Avoid:</strong> Bonds (ordinary income), REITs (non-qualified dividends), actively managed funds (high turnover).
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
                        <strong>Best for:</strong> Bonds, REITs, actively managed funds, high-dividend stocks.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Why:</strong> Ordinary income is taxed anyway, so shelter it now and withdraw in lower tax bracket later.
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
                        <strong>Best for:</strong> High-growth stocks, small-cap value, emerging markets, anything with maximum growth potential.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <strong>Why:</strong> Maximize the benefit of tax-free growth by holding your highest-return-potential assets.
                    </p>
                </div>

                <h2>The Standard Tax-Efficient Strategy</h2>
                <p>
                    A proven asset location strategy for most investors:
                </p>
                <ol>
                    <li><strong>Taxable accounts:</strong> Stock index funds (US and international). Qualified dividends are taxed at favorable long-term capital gains rates.</li>
                    <li><strong>Tax-deferred accounts:</strong> Bonds and REITs. These generate ordinary income, so shelter them from annual taxation.</li>
                    <li><strong>Roth accounts:</strong> High-growth equities (small-cap, emerging markets). Let your biggest winners grow tax-free forever.</li>
                </ol>

                <h2>Advanced Roth Optimization</h2>
                <p>
                    Some investors prioritize maximizing Roth account growth over annual tax savings. The "Roth Growth Strategy" flips the traditional approach:
                </p>
                <ul>
                    <li>Roth accounts: <strong>All stocks</strong> (especially high-growth)</li>
                    <li>Traditional IRA: <strong>Bonds</strong></li>
                    <li>Taxable: <strong>Whatever remains</strong></li>
                </ul>
                <p>
                    This maximizes tax-free growth potential, though it may increase annual taxes in the short to term. Best for young, high-income investors with decades until withdrawal.
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
