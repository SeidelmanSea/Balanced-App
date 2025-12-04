import React from 'react';

export default function ArticleWrapper({ children, className = "" }) {
    return (
        <div className={`min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 ${className}`}>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-8 prose-h1:pb-6 prose-h1:border-b-4 prose-h1:border-emerald-500 dark:prose-h1:border-emerald-600 prose-h1:text-zinc-900 dark:prose-h1:text-white prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:pt-6 prose-h2:pb-4 prose-h2:px-6 prose-h2:-mx-6 prose-h2:bg-gradient-to-r prose-h2:from-emerald-50 prose-h2:to-transparent dark:prose-h2:from-emerald-950/40 dark:prose-h2:to-transparent prose-h2:border-l-4 prose-h2:border-emerald-500 prose-h2:text-zinc-900 dark:prose-h2:text-white prose-h2:rounded-r-lg prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:font-semibold prose-h3:text-emerald-800 dark:prose-h3:text-emerald-300 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-lead:text-2xl prose-lead:leading-relaxed prose-lead:text-zinc-600 dark:prose-lead:text-zinc-400 prose-lead:font-normal prose-lead:mb-12 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline prose-a:font-semibold hover:prose-a:text-emerald-700 dark:hover:prose-a:text-emerald-300 hover:prose-a:underline prose-a:transition-colors prose-strong:text-zinc-900 dark:prose-strong:text-white prose-strong:font-bold prose-ul:my-8 prose-ul:space-y-3 prose-ol:my-8 prose-ol:space-y-3 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:text-lg prose-li:leading-relaxed prose-li:marker:text-emerald-600 dark:prose-li:marker:text-emerald-400 prose-code:text-emerald-700 dark:prose-code:text-emerald-300 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-900/30 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-semibold prose-code:text-base prose-code:before:content-none prose-code:after:content-none text-zinc-900 dark:text-zinc-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
