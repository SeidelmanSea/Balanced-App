import React from 'react';

/**
 * ArticleWrapper - Wraps article content with professional styling
 * Provides container and improved typography
 */
export const articleStyles = `
  prose prose-lg dark:prose-invert max-w-none
  prose-headings:font-bold prose-headings:tracking-tight
  prose-h1:text-4xl prose-h1:mb-6 prose-h1:text-zinc-900 dark:prose-h1:text-white
  prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-emerald-200 dark:prose-h2:border-emerald-800 prose-h2:text-zinc-900 dark:prose-h2:text-white
  prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-zinc-800 dark:prose-h3:text-zinc-100
  prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-lg
  prose-lead:text-xl prose-lead:text-zinc-600 dark:prose-lead:text-zinc-400 prose-lead:font-normal
  prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-700 dark:hover:prose-a:text-emerald-300 hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
  prose-strong:text-zinc-900 dark:prose-strong:text-white prose-strong:font-semibold
  prose-ul:my-6 prose-ul:space-y-2
  prose-ol:my-6 prose-ol:space-y-2
  prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:text-lg prose-li:leading-relaxed
  prose-code:text-emerald-700 dark:prose-code:text-emerald-300 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-900/30 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:text-base prose-code:before:content-none prose-code:after:content-none
  text-zinc-900 dark:text-zinc-100
`;

export default function ArticleWrapper({ children, className = "" }) {
    return (
        <div className={`min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 ${className}`}>
            <div className="max-w-4xl mx-auto px-6 py-16">
                {children}
            </div>
        </div>
    );
}
