import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleWrapper from './ArticleLayout';

export default function EmergencyFundGuide() {
    return (
        <ArticleWrapper>
            <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
            </Link>

            <h1>Building Your Emergency Fund: The Complete Guide</h1>

            <p className="lead">
                An emergency fund is your first line of defense against financial disaster. This guide explains how much to save, where to keep it, and when you finally have enough.
            </p>

            <h2>What is an Emergency Fund?</h2>
            <p>
                An emergency fund is liquid savings set aside specifically for unexpected expenses: job loss, medical bills, urgent home repairs, or car breakdowns. It prevents you from going into debt or selling investments at a loss when life throws curveballs.
            </p>
            <p>
                Think of it as insurance against financial emergencies—except you're paying yourself instead of an insurance company.
            </p>

            <h2>How Much Do You Need?</h2>
            <p>
                The standard recommendation is 3-6 months of essential expenses. But your specific target depends on your situation:
            </p>

            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    3 Months: Minimum Safety Net
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    <strong>Right for you if:</strong>
                </p>
                <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                    <li>• Dual income household</li>
                    <li>• Stable employment (salaried, tenured)</li>
                    <li>• Good family support network</li>
                    <li>• Low fixed expenses (renter, no kids)</li>
                </ul>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    6 Months: Standard Recommendation
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    <strong>Right for you if:</strong>
                </p>
                <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                    <li>• Single earner or  single</li>
                    <li>• Moderate job security</li>
                    <li>• Average expenses</li>
                    <li>• Want peace of mind</li>
                </ul>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 not-prose my-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    9-12 Months: Maximum Security
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    <strong>Right for you if:</strong>
                </p>
                <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                    <li>• Variable/commission income</li>
                    <li>• Self-employed or freelance</li>
                    <li>• High fixed expenses (mortgage, dependents)</li>
                    <li>• Health concerns or aging parents</li>
                    <li>• Work in volatile industry</li>
                </ul>
            </div>

            <h2>Calculating Your Target</h2>
            <p>
                Your emergency fund should cover <strong>essential expenses only</strong>, not your entire lifestyle:
            </p>
            <ul>
                <li>Housing (rent/mortgage, utilities)</li>
                <li>Food (groceries, not restaurants)</li>
                <li>Transportation (car payment, gas, insurance)</li>
                <li>Insurance (health, life, disability)</li>
                <li>Minimum debt payments</li>
                <li>Basic necessities</li>
            </ul>
            <p>
                <strong>Exclude:</strong> Retirement savings, entertainment, dining out, travel, subscription services. These can be cut if you lose income.
            </p>

            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold mb-3">Example Calculation</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Rent</span>
                        <span className="font-semibold">$1,800</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Utilities</span>
                        <span className="font-semibold">$150</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Groceries</span>
                        <span className="font-semibold">$500</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Car payment + insurance</span>
                        <span className="font-semibold">$450</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Health insurance</span>
                        <span className="font-semibold">$300</span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-300 dark:border-zinc-700 pt-2 mt-2 font-semibold">
                        <span>Monthly essentials</span>
                        <span>$3,200</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold mt-3">
                        <span>6-month target</span>
                        <span>$19,200</span>
                    </div>
                </div>
            </div>

            <h2>Where to Keep Your Emergency Fund</h2>
            <p>
                Emergency funds must be liquid (accessible) and safe (no market risk). Best options:
            </p>

            <h3>1. High-Yield Savings Account (HYSA)</h3>
            <p>
                Online banks like Marcus, Ally, and Discover offer 4-5% APY with FDIC insurance. Best all-around choice for most people.
            </p>
            <p>
                <strong>Pros:</strong> Easy access, FDIC insured, competitive rates<br />
                <strong>Cons:</strong> Rates fluctuate with Fed policy
            </p>

            <h3>2. Money Market Funds</h3>
            <p>
                Vanguard's VMFXX, Fidelity's SPAXX, or Schwab's SWVXX offer similar yields to HYSAs but held in your brokerage account.
            </p>
            <p>
                <strong>Pros:</strong> Convenient if you already have a brokerage<br />
                <strong>Cons:</strong> Not FDIC insured (though extremely safe)
            </p>

            <h3>3. Treasury Bills (Short-Term)</h3>
            <p>
                4-week or 13-week T-bills offer federal tax exemption on interest.
            </p>
            <p>
                <strong>Pros:</strong> State tax-free, backed by US government<br />
                <strong>Cons:</strong> Less liquid, requires ladder to maintain access
            </p>

            <h2>What NOT to Use</h2>
            <ul>
                <li><strong>Stocks/ETFs:</strong> Too volatile. You might need cash when markets are down.</li>
                <li><strong>Bonds (long-term):</strong> Can lose value when rates rise.</li>
                <li><strong>Retirement accounts:</strong> Penalties and taxes for early withdrawal.</li>
                <li><strong>Home equity:</strong> Not quickly accessible, requires loan approval.</li>
            </ul>

            <h2>Building Your Fund</h2>
            <p>
                If saving 6 months of expenses feels overwhelming, start smaller:
            </p>
            <ol>
                <li><strong>Mini-emergency fund ($1,000):</strong> Covers small emergencies while you pay down debt</li>
                <li><strong>1 month expenses:</strong> First milestone</li>
                <li><strong>3 months:</strong> Minimum safety net</li>
                <li><strong>6 months:</strong> Standard target</li>
                <li><strong>Beyond 6 months:</strong> If your situation warrants it</li>
            </ol>

            <h2>When to Use It</h2>
            <p>
                Your emergency fund is for <strong>genuine emergencies</strong>:
            </p>
            <ul>
                <li>✅ Job loss or income reduction</li>
                <li>✅ Medical emergency or unexpected health costs</li>
                <li>✅ Urgent home repairs (burst pipe, broken furnace)</li>
                <li>✅ Major car repairs needed for work transportation</li>
            </ul>
            <p>
                <strong>Not emergencies:</strong> Vacations, new phones, "great deals," annual expenses you should have budgeted for.
            </p>

            <h2>Emergency Fund vs. Investing</h2>
            <p>
                A common question: "Why keep cash earning 4% when I could invest and potentially earn 10%?"
            </p>
            <p>
                <strong>Answer:</strong> Your emergency fund isn't an investment—it's insurance. The "return" is peace of mind and avoiding debt. Once you have 3-6 months saved, <em>then</em> invest everything else aggressively.
            </p>

            <h2>Integrating with Your Portfolio</h2>
            <p>
                The <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Balanced app</Link> lets you designate emergency fund accounts separately from your investment portfolio. This ensures your asset allocation calculations exclude emergency savings, so you don't accidentally invest money you might need soon.
            </p>

            <h2>When Is It "Enough"?</h2>
            <p>
                You have enough when:
            </p>
            <ul>
                <li>You can cover 3-6 months of essentials (per your situation)</li>
                <li>You don't worry about minor unexpected expenses</li>
                <li>You can stop building it and redirect money to investments</li>
            </ul>
            <p>
                Once you hit your target, maintain it. Replenish after using it, and adjust if your expenses increase (new mortgage, kids, etc.).
            </p>

            <h2>Next Steps</h2>
            <p>
                Use our <Link to="/calculators/emergency-fund" className="text-emerald-600 hover:text-emerald-700 font-medium">emergency fund calculator</Link> to determine your specific target, then start building. Once fully funded, focus on investing with <Link to="/app" className="text-emerald-600 hover:text-emerald-700 font-medium">Balanced</Link>.
            </p>

            <div className="mt-12 flex gap-4">
                <Link
                    to="/calculators/emergency-fund"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Calculate My Target
                </Link>
                <Link
                    to="/resources"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold rounded-lg transition-colors"
                >
                    More Articles
                </Link>
            </div>
        </ArticleWrapper >
    );
}
