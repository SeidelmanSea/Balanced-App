import React from 'react';
import { ArrowLeft, Calculator, TrendingUp, Shield, Calendar } from 'lucide-react';
import SEO from './components/SEO';
import { Link } from 'react-router-dom';

export default function CalculatorsPage() {
    const calculators = [
        {
            title: "Emergency Fund Calculator",
            description: "Calculate how much you should save for emergencies based on your monthly expenses and risk tolerance.",
            icon: Shield,
            link: "/calculators/emergency-fund",
            keywords: "3-6 months expenses, financial safety net"
        },
        {
            title: "Asset Allocation Calculator",
            description: "Determine your optimal stock/bond mix based on your age, risk tolerance, and retirement timeline.",
            icon: TrendingUp,
            link: "/calculators/asset-allocation",
            keywords: "age-based glide path, target date alternative"
        },
        {
            title: "Rebalancing Frequency Calculator",
            description: "Find the optimal rebalancing schedule for your portfolio size and investment strategy.",
            icon: Calendar,
            link: "/calculators/rebalance-frequency",
            keywords: "annual vs quarterly, drift bands vs calendar"
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SEO
                title="Investment Calculators"
                description="Free investment calculators for emergency funds, asset allocation, and rebalancing frequency."
                canonical="/calculators"
            />
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Calculator className="w-10 h-10 text-emerald-600" />
                        <h1 className="text-4xl font-bold">Investment Calculators</h1>
                    </div>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        Free tools to help you optimize your portfolio strategy
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {calculators.map((calc, index) => (
                        <Link
                            key={index}
                            to={calc.link}
                            className="block bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
                                    <calc.icon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                                {calc.title}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                                {calc.description}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-500">
                                {calc.keywords}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h2 className="text-xl font-semibold mb-2">Want the full portfolio manager?</h2>
                    <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                        These calculators are great for one-time decisions. For ongoing portfolio rebalancing and tax-efficient asset location across multiple accounts, try our full app.
                    </p>
                    <Link
                        to="/app"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Launch Balanced App
                    </Link>
                </div>
            </div>
        </div>
    );
}
