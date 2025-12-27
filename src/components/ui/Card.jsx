
const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-200 ${className}`}>
        {children}
    </div>
);

export default Card;
