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
    ChevronDown,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight
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
                                Portfolio Rebalancing<br />
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                    Made Simple.
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

                        {/* Hero Visualization - Dashboard Preview */}
                        <div className="flex-1 w-full max-w-[500px] lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="relative">
                                {/* Abstract Background Blobs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />

                                {/* Main App Window */}
                                <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                    {/* App Header */}
                                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-zinc-400">Balanced Dashboard</div>
                                        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                                    </div>

                                    {/* App Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Total Net Worth */}
                                        <div className="mb-2">
                                            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Net Worth</div>
                                            <div className="text-3xl font-bold tracking-tight">$142,500.00</div>
                                        </div>

                                        {/* Asset Allocation List */}
                                        <div className="space-y-4">
                                            {[
                                                { name: "US Stocks", current: 52, target: 45, color: "emerald", drift: "+7%" },
                                                { name: "Intl Stocks", current: 18, target: 25, color: "blue", drift: "-7%" },
                                                { name: "Bonds", current: 30, target: 30, color: "purple", drift: "0%" }
                                            ].map((asset, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium">{asset.name}</span>
                                                        <div className="flex gap-3 text-xs">
                                                            <span className="text-zinc-500">Target: {asset.target}%</span>
                                                            <span className={asset.current > asset.target ? "text-red-500 font-medium" : asset.current < asset.target ? "text-emerald-500 font-medium" : "text-zinc-400"}>
                                                                {asset.drift}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                                                        {/* Target Marker Line (Simulated by width calc) */}
                                                        <div className={`h-full bg-${asset.color}-500 rounded-full transition-all duration-1000 ease-out`}
                                                            style={{ width: `${asset.current}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Floating "Rebalancing Plan" Card */}
                                    <div className="absolute bottom-6 right-6 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-sm font-bold flex items-center gap-2">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                Rebalancing Plan
                                            </div>
                                            <div className="text-[10px] bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-500">
                                                Tax-Smart
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400">
                                                        <ArrowDownRight className="w-3 h-3" />
                                                    </div>
                                                    <div className="text-xs font-medium">Sell VTI</div>
                                                </div>
                                                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">$9,800</div>
                                            </div>

                                            <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600 dark:text-emerald-400">
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </div>
                                                    <div className="text-xs font-medium">Buy VXUS</div>
                                                </div>
                                                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">$9,800</div>
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
        </div>
    );
}
