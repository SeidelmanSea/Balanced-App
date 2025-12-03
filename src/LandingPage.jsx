import React from 'react';
import { Link } from 'react-router-dom';
import {
    PieChart,
    Shield,
    TrendingUp,
    Lock,
    Coffee,
    Heart,
    Github,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap,
    Target
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">

            {/* Navigation */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <PieChart className="w-6 h-6 text-emerald-500" />
                        <span>Balanced</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/SeidelmanSea/Balanced-App"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors hidden sm:block"
                        >
                            GitHub
                        </a>
                        <Link
                            to="/app"
                            className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Open App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Free, Open Source, Privacy-First</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    Rebalance Your Portfolio.<br />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Tax-Efficiently.</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    Institutional-grade portfolio management strategies, simplified for everyday investors.
                    Optimize your asset allocation while minimizing taxes and maximizing growth.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <Link
                        to="/app"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
                    >
                        <span>Try It Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <a
                        href="https://buymeacoffee.com/balanced"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-zinc-900 dark:text-zinc-100 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                    >
                        <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span>Support This Project</span>
                    </a>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-zinc-500 dark:text-zinc-500 animate-in fade-in duration-700 delay-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>No Account Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>100% Free Forever</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Your Data Stays Local</span>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Everything You Need to Optimize Your Portfolio
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Powerful features that help you make smarter investment decisions
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Feature 1 */}
                    <div className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Tax-Efficient Rebalancing</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Smart asset location strategies that minimize your tax burden while maximizing after-tax returns.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Emergency Fund Tracking</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Separate your safety net from investments. Track emergency funds at the account or fund level.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Individual Stock Support</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Hold individual stocks alongside ETFs. Perfect for concentrated positions or employer stock.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-amber-500 dark:hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Privacy-First Design</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Your financial data never leaves your device. No servers, no tracking, no data breaches.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Get Started in 3 Simple Steps
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        No complex setup. Start optimizing your portfolio in minutes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (hidden on mobile) */}
                    <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-20" style={{ top: '4rem' }}></div>

                    {/* Step 1 */}
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto shadow-lg shadow-emerald-500/25">
                            1
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Import Your Portfolio</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
                            Add your accounts manually or paste data from your brokerage. Supports CSV import from Vanguard, Fidelity, Schwab, and more.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto shadow-lg shadow-blue-500/25">
                            2
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Set Your Target Allocation</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
                            Choose from preset strategies or build your own. Customize your bond allocation, equity mix, and tax strategy.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto shadow-lg shadow-purple-500/25">
                            3
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Get Recommendations</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
                            See exactly what to buy and sell to reach your target allocation. Tax-optimized trades across all your accounts.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/app"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
                    >
                        <Zap className="w-5 h-5" />
                        <span>Start Rebalancing Now</span>
                    </Link>
                </div>
            </section>

            {/* Support Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-200 dark:border-zinc-800">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg shadow-emerald-500/25">
                        <Heart className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Support Open Source Development
                    </h2>

                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Balanced is free and always will be. If you find it valuable, consider supporting its development.
                        Your contribution helps keep this tool free, ad-free, and privacy-focused for everyone.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://buymeacoffee.com/balanced"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                        >
                            <Coffee className="w-5 h-5" />
                            <span>Buy Me a Coffee</span>
                        </a>

                        <a
                            href="https://github.com/SeidelmanSea/Balanced-App"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                        >
                            <Github className="w-5 h-5" />
                            <span>Star on GitHub</span>
                        </a>
                    </div>

                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-6">
                        100% of contributions go directly to development and hosting costs
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col items-center gap-6">

                    {/* Footer Links */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        <a href="/about.html" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            About & Methodology
                        </a>
                        <a href="https://github.com/SeidelmanSea/Balanced-App" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            GitHub
                        </a>
                        <a href="https://buymeacoffee.com/balanced" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            Support Development
                        </a>
                    </div>

                    {/* Risk Disclosure */}
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-600">
                            <span className="font-semibold uppercase tracking-wider opacity-80 block mb-1">Risk Disclosure</span>
                            This application is for informational and educational purposes only and does not constitute financial advice.
                            All investing involves risk. Past performance is not indicative of future results.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-zinc-400 dark:text-zinc-600">
                        © {new Date().getFullYear()} Balanced. Open source under MIT License.
                    </div>
                </div>
            </footer>
        </div>
    );
}
