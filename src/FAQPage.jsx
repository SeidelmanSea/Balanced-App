import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQPage() {
    const faqs = [
        {
            question: "What is portfolio rebalancing and why should I do it?",
            answer: "Portfolio rebalancing is the process of realigning your investment portfolio to match your target asset allocation. Over time, some investments grow faster than others, causing your portfolio to drift from your intended allocation. Rebalancing helps manage risk and maintain your desired exposure to different asset classes."
        },
        {
            question: "How does Balanced protect my financial data?",
            answer: "Balanced stores all your data locally in your browser using LocalStorage. Nothing is ever sent to our servers because we don't have any servers collecting your data. Your portfolio details, account balances, and allocation preferences never leave your device. You can verify this in our open-source code on GitHub."
        },
        {
            question: "What account types does Balanced support?",
            answer: "Balanced supports all major account types including: Individual/Joint Brokerage (taxable), Traditional IRA, Rollover IRA, Roth IRA, Traditional 401(k)/403(b), Roth 401(k), HSA, and Emergency Fund accounts. Each account type is optimized for tax-efficient asset placement."
        },
        {
            question: "What is tax-efficient asset location?",
            answer: "Tax-efficient asset location means placing your investments in the right account types to minimize taxes. For example, bonds generate ordinary income and belong in tax-deferred accounts like IRAs, while stocks with qualified dividends can be held in taxable accounts. Balanced automatically suggests optimal asset placement based on your tax strategy."
        },
        {
            question: "How often should I rebalance my portfolio?",
            answer: "It depends on your strategy. Balanced supports three approaches: (1) Strict/Calendar rebalancing (quarterly or annually), (2) Drift Bands using the 5/25 rule (rebalance when thresholds are breached), and (3) Inflow-Only (only rebalance with new contributions, never sell). Most investors rebalance annually or when drift exceeds 5%."
        },
        {
            question: "Can I use Balanced with multiple brokerages?",
            answer: "Yes! Balanced is designed for investors with accounts across multiple brokerages (Vanguard, Fidelity, Schwab, etc.). You can add all your accounts and get consolidated rebalancing suggestions that consider your entire portfolio."
        },
        {
            question: "Does Balanced connect to my brokerage accounts?",
            answer: "No. Balanced does not connect to or sync with your brokerage accounts. You manually enter your holdings, which gives you complete control and ensures maximum privacy. Most users update their portfolio quarterly or when making changes."
        },
        {
            question: "What is the emergency fund feature?",
            answer: "Balanced separates your emergency fund from your investment calculations. You can mark cash or money market holdings as emergency funds, and they won't be counted toward your investment asset allocation. This ensures you maintain appropriate liquidity while optimizing your investment portfolio."
        },
        {
            question: "How does Balanced calculate rebalancing suggestions?",
            answer: "Balanced calculates your target allocation based on your age, risk tolerance, and equity preferences. It then compares your current holdings to targets and suggests trades to realign your portfolio. The algorithm considers tax efficiency, account types, and your chosen rebalancing strategy (strict, bands, or inflow-only)."
        },
        {
            question: "Can I export my data?",
            answer: "Yes! Balanced includes export functionality to download your entire portfolio as a JSON file. You can use this to backup your data or transfer it to another device. You can also import previously exported data."
        },
        {
            question: "Is Balanced really free?",
            answer: "Yes, completely free. No subscriptions, no freemium upsells, no ads. The project is funded by optional donations from users who find it valuable. We believe everyone should have access to quality financial tools regardless of their account size."
        },
        {
            question: "What browsers does Balanced support?",
            answer: "Balanced works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile. Since it uses LocalStorage, your data is device-specific—you'll need to export and import if switching devices."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <HelpCircle className="w-8 h-8 text-emerald-600" />
                    <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800"
                            itemScope
                            itemProp="mainEntity"
                            itemType="https://schema.org/Question"
                        >
                            <h2 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100" itemProp="name">
                                {faq.question}
                            </h2>
                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed" itemProp="text">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
                    <p className="text-zinc-700 dark:text-zinc-300">
                        Check out our{' '}
                        <a href="https://github.com/SeidelmanSea/Balanced-App" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            GitHub repository
                        </a>
                        {' '}or open an issue if you need help.
                    </p>
                </div>
            </div>
        </div>
    );
}
