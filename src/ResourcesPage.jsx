import React from 'react';
import { ArrowLeft, BookOpen, TrendingUp, Shield, PiggyBank } from 'lucide-react';
import SEO from './components/SEO';
import { Link } from 'react-router-dom';

export default function ResourcesPage() {
    const articles = [
        {
            title: "The Complete Guide to Portfolio Rebalancing",
            description: "Learn when and how to rebalance your investment portfolio to maintain your target allocation and manage risk effectively.",
            icon: TrendingUp,
            link: "/resources/portfolio-rebalancing-guide",
            readTime: "8 min read",
            keywords: "calendar rebalancing, drift bands, 5/25 rule"
        },
        {
            title: "Tax-Efficient Investing: Asset Location Strategy",
            description: "Maximize after-tax returns by placing the right investments in the right account types. Learn the proven strategies used by financial advisors.",
            icon: Shield,
            link: "/resources/tax-efficient-investing",
            readTime: "10 min read",
            keywords: "Roth optimization, tax-loss harvesting, asset location"
        },
        {
            title: "Building Your Emergency Fund",
            description: "How much cash should you keep liquid? Learn the 3-6 month rule, where to store emergency funds, and when you have enough.",
            icon: PiggyBank,
            link: "/resources/emergency-fund-guide",
            readTime: "5 min read",
            keywords: "HYSA, money market funds, financial safety net"
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SEO
                title="Learning Center"
                description="Master the fundamentals of portfolio management and tax-efficient investing."
                canonical="/resources"
            />
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-10 h-10 text-emerald-600" />
                        <h1 className="text-4xl font-bold">Learning Center</h1>
                    </div>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        Master the fundamentals of portfolio management and tax-efficient investing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {articles.map((article, index) => (
                        <Link
                            key={index}
                            to={article.link}
                            className="block bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
                                    <article.icon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {article.title}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                                {article.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">{article.readTime}</span>
                                <span className="text-emerald-600 font-medium">Read →</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-3">
                                {article.keywords}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-3">Ready to optimize your portfolio?</h2>
                    <p className="text-emerald-100 mb-6">
                        Apply these strategies with Balanced's free portfolio rebalancing tool. No signup required.
                    </p>
                    <Link
                        to="/app"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                        Launch Balanced App
                    </Link>
                </div>
            </div>
        </div>
    );
}
