import React from 'react';
import { Coffee, Heart, Github, ArrowLeft } from 'lucide-react';
import SEO from './components/SEO';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SEO
                title="About Us"
                description="Learn more about Balanced, the free and privacy-focused portfolio rebalancing tool."
                canonical="/about"
            />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold mb-6">About Balanced</h1>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-lg leading-relaxed">
                            Balanced is a free, privacy-first portfolio rebalancing tool designed for DIY investors who want to optimize their asset allocation and tax efficiency without sacrificing control of their data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">How Balanced Works</h2>
                        <div className="space-y-4">
                            <p>
                                Balanced helps you maintain your target asset allocation across multiple accounts while optimizing for tax efficiency. Here's what makes it different:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Privacy-First:</strong> All your data stays in your browser. Nothing is sent to our servers.</li>
                                <li><strong>Tax-Efficient Asset Location:</strong> Automatically suggests optimal placement of assets across taxable, tax-deferred, and Roth accounts.</li>
                                <li><strong>Flexible Rebalancing Strategies:</strong> Choose from strict calendar rebalancing, drift bands (5/25 rule), or inflow-only strategies.</li>
                                <li><strong>Emergency Fund Integration:</strong> Factor in your emergency fund when calculating your investment allocation.</li>
                                <li><strong>Custom Equity Splits:</strong> Define your preferred mix of US stocks, international, bonds, and alternative assets.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Open Source & Free Forever</h2>
                        <p>
                            Balanced is 100% free and open source. The code is available on GitHub, so you can verify exactly what it does with your data (spoiler: nothing—it never leaves your device).
                        </p>
                        <a
                            href="https://github.com/SeidelmanSea/Balanced-App"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </a>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Who Should Use Balanced?</h2>
                        <p>Balanced is perfect for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Bogleheads:</strong> Investors who follow a passive, index-based investment strategy</li>
                            <li><strong>DIY Investors:</strong> Those who want control without paying for expensive financial advisors</li>
                            <li><strong>Tax-Conscious Savers:</strong> People optimizing across multiple account types (401k, IRA, Roth, taxable)</li>
                            <li><strong>Multi-Account Holders:</strong> Anyone juggling investments across different brokerages</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Support the Project</h2>
                        <p className="mb-4">
                            If Balanced helps you manage your portfolio, consider supporting its development. Every contribution helps keep the project free and ad-free for everyone.
                        </p>
                        <a
                            href="https://buymeacoffee.com/balanced"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold rounded-lg transition-colors"
                        >
                            <Coffee className="w-5 h-5" />
                            Buy Me a Coffee
                        </a>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
                        <p>
                            Your financial data is sensitive. That's why Balanced stores everything locally in your browser using LocalStorage. We don't have user accounts, we don't track you, and we never see your portfolio details. You can export your data at any time and delete it whenever you want.
                        </p>
                    </section>

                    <section className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Built with ❤️ for the DIY investing community. Questions or feedback? Star us on{' '}
                            <a href="https://github.com/SeidelmanSea/Balanced-App" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                                GitHub
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
