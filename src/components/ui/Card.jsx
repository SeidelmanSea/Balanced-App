
const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-zinc-900/95 rounded-2xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden transition-all duration-200 ${className}`}>
        {children}
    </div>
);

export default Card;
