
const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden transition-all duration-200 ${className}`}>
        {children}
    </div>
);

export default Card;
