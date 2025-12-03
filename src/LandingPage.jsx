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
    Target,
    BarChart3,
    Wallet,
    Sliders,
    ArrowLeftRight,
    ChevronDown
} from 'lucide-react';

export default function LandingPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Balanced",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Free, privacy-focused portfolio rebalancing tool with tax-efficient asset location and drift band rebalancing.",
        "featureList": [
            "Tax-efficient asset location",
            "Drift band rebalancing",
            "Roth growth optimization",
            "Privacy-focused local storage",
            "Emergency fund tracking",
            "Customizable asset allocation"
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/30">
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Background Grid Pattern */}
            <div className="fixed inset-0 bg-grid-zinc-900 dark:bg-grid-white bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none opacity-[0.03] dark:opacity-[0.05]" />

            {/* Navigation */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
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
                            className="text-sm font-medium bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-zinc-500/20"
                        >
                            Open App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Hero Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Sparkles className="w-3 h-3" />
                                <span>Free, Open Source, Privacy-First</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                Rebalance Simple.<br />
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                    Tax Efficiently.
                                </span>
                            </h1>

                            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                Institutional-grade portfolio management strategies, <strong>customized to your goals</strong>.
                                Optimize your asset location to minimize taxes and maximize growth.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                <Link
                                    to="/app"
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold rounded-2xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/20"
                                >
                                    <span>Start Rebalancing</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <a
                                    href="https://buymeacoffee.com/balanced"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-lg font-semibold rounded-2xl transition-all hover:scale-[1.02]"
                                >
                                    <Heart className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                                    <span>Support Project</span>
                                </a>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 mt-10 text-sm font-medium text-zinc-500 dark:text-zinc-500 animate-in fade-in duration-700 delay-500">
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
                                    <span>Local Data Storage</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visualization */}
                        <div className="flex-1 w-full max-w-[500px] lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square">
                                {/* Abstract Background Blobs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />

                                {/* Main Card */}
                                <div className="absolute inset-4 md:inset-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col">

                                    {/* Mock Header with Strategy Selector */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                                <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Target Strategy</div>
                                                <div className="flex items-center gap-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                    Custom Growth
                                                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Active
                                        </div>
                                    </div>

                                    {/* Visualization Content */}
                                    <div className="flex-1 flex flex-col justify-center gap-6">

                                        {/* Donut Chart Animation */}
                                        <div className="flex items-center justify-center gap-8">
                                            <div className="relative w-32 h-32">
                                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                    {/* Background Circle */}
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" className="text-zinc-100 dark:text-zinc-800" />

                                                    {/* US Stocks Segment (Emerald) */}
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12"
                                                        strokeDasharray="150 251"
                                                        className="text-emerald-500 transition-all duration-[2000ms] ease-out"
                                                        style={{ strokeDasharray: '180 251', animation: 'pulseSegment 4s infinite alternate' }} />

                                                    {/* Intl Stocks Segment (Blue) */}
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12"
                                                        strokeDasharray="60 251" strokeDashoffset="-180"
                                                        className="text-blue-500 transition-all duration-[2000ms] ease-out" />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Drift</span>
                                                    <span className="text-sm font-bold text-red-500">-4.2%</span>
                                                </div>
                                            </div>

                                            <ArrowRight className="w-6 h-6 text-zinc-300 dark:text-zinc-600 animate-pulse" />

                                            {/* Trade List */}
                                            <div className="flex-1 space-y-3">
                                                <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm animate-in slide-in-from-right-4 fade-in duration-700 delay-500">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">BUY VTI</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Taxable</span>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Tax-Efficient Location</div>
                                                </div>

                                                <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm animate-in slide-in-from-right-4 fade-in duration-700 delay-700">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-red-500">SELL BND</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">IRA</span>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">No Tax Impact</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Floating Badge - Tax Savings */}
                                    <div className="absolute -right-4 top-20 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700 animate-bounce delay-1000 duration-[3000ms]">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Tax Saved</div>
                                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">+$842</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Professional Tools.<br className="hidden md:block" />
                        <span className="text-zinc-400">Simplified for Everyone.</span>
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Powerful features that help you make smarter investment decisions, without the complexity or fees of a financial advisor.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: TrendingUp,
                            color: "emerald",
                            title: "Tax-Efficient Rebalancing",
                            desc: "Smart asset location strategies that minimize your tax burden while maximizing after-tax returns."
                        },
                        {
                            icon: Sliders,
                            color: "blue",
                            title: "Flexible Strategies",
                            desc: "Choose from standard presets or build a completely custom allocation that fits your goals."
                        },
                        {
                            icon: BarChart3,
                            color: "purple",
                            title: "Individual Stock Support",
                            desc: "Hold individual stocks alongside ETFs. Perfect for concentrated positions or employer stock."
                        },
                        {
                            icon: Lock,
                            color: "amber",
                            title: "Privacy-First Design",
                            desc: "Your financial data never leaves your device. No servers, no tracking, no data breaches."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-xl hover:shadow-zinc-500/5">
                            <div className={`w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Get Started in Minutes
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            No complex setup. Start optimizing your portfolio immediately.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (hidden on mobile) */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20"></div>

                        {[
                            {
                                step: 1,
                                title: "Import Portfolio",
                                desc: "Paste data from your brokerage or enter manually. Supports CSV import from major brokers.",
                                color: "emerald"
                            },
                            {
                                step: 2,
                                title: "Customize Strategy",
                                desc: "Set your target allocation, asset location preferences, and drift tolerances.",
                                color: "blue"
                            },
                            {
                                step: 3,
                                title: "Rebalance",
                                desc: "Get specific buy/sell recommendations to reach your target tax-efficiently.",
                                color: "purple"
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className={`w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl border-4 border-${item.color}-100 dark:border-${item.color}-900/30 flex items-center justify-center text-3xl font-bold text-${item.color}-600 dark:text-${item.color}-400 mb-8 mx-auto shadow-lg relative z-10`}>
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-center">{item.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-center leading-relaxed max-w-xs mx-auto">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link
                            to="/app"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-lg font-semibold rounded-2xl transition-all hover:scale-[1.02] hover:shadow-xl"
                        >
                            <Zap className="w-5 h-5" />
                            <span>Start Rebalancing Now</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="max-w-4xl mx-auto px-6 py-24">
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 rounded-[2.5rem] p-12 text-center text-white shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20">
                            <Heart className="w-8 h-8 text-emerald-300" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            Support Open Source
                        </h2>

                        <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Balanced is free and always will be. Your contribution helps keep this tool ad-free and privacy-focused for everyone.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://buymeacoffee.com/balanced"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white text-lg font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-900/20"
                            >
                                <Coffee className="w-5 h-5" />
                                <span>Buy Me a Coffee</span>
                            </a>

                            <a
                                href="https://github.com/SeidelmanSea/Balanced-App"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg font-semibold rounded-xl transition-all hover:scale-[1.02]"
                            >
                                <Github className="w-5 h-5" />
                                <span>Star on GitHub</span>
                            </a>
                        </div>

                        <p className="text-sm text-emerald-200/60 mt-8">
                            100% of contributions go directly to development costs
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight opacity-50 grayscale hover:grayscale-0 transition-all">
                        <PieChart className="w-6 h-6 text-emerald-500" />
                        <span>Balanced</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-zinc-500 dark:text-zinc-500">
                        <a href="/about.html" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
                            About & Methodology
                        </a>
                        <a href="https://github.com/SeidelmanSea/Balanced-App" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
                            GitHub
                        </a>
                        <a href="https://buymeacoffee.com/balanced" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
                            Support
                        </a>
                    </div>

                    <div className="text-xs text-zinc-400 dark:text-zinc-600">
                        © {new Date().getFullYear()} Balanced. MIT License.
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes pulseSegment {
                    0% { stroke-width: 12; opacity: 0.8; }
                    100% { stroke-width: 14; opacity: 1; }
                }
            `}</style>
        </div>
    );
}
