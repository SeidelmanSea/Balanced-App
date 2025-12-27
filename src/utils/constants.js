import {
    Scale,
    TrendingUp,
    Target,
    ArrowLeftRight,
    Calendar,
    Layers,
    ArrowDownRight,
    Shield,
    Wallet,
    Landmark,
    RefreshCw,
    ShieldCheck,
    Briefcase,
    Activity
} from 'lucide-react';

export const ASSET_CLASSES = {
    // Cash & Equivalents
    CASH: { id: 'money_market', name: 'Money Market / Cash Equiv.', color: '#71717a', type: 'fixed', taxPref: ['taxable', 'deferred', 'roth'] },

    // US Equities - Core
    US_BROAD: { id: 'us_broad', name: 'US Broad Market', color: '#10b981', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
    US_LARGE: { id: 'us_large', name: 'US Large Cap (S&P 500)', color: '#34d399', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
    US_MID: { id: 'us_mid', name: 'US Mid Cap', color: '#2dd4bf', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },
    US_SMALL: { id: 'us_small', name: 'US Small Cap', color: '#06b6d4', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },

    // US Equities - Style
    US_LARGE_GROWTH: { id: 'us_large_growth', name: 'US Large Growth', color: '#3b82f6', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
    US_LARGE_VALUE: { id: 'us_large_value', name: 'US Large Value', color: '#6366f1', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
    US_SMALL_VAL: { id: 'us_small_val', name: 'US Small Value', color: '#8b5cf6', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },
    US_SMALL_GROWTH: { id: 'us_small_growth', name: 'US Small Growth', color: '#d946ef', type: 'equity', taxPref: ['roth', 'taxable', 'deferred'] },

    // International
    INTL: { id: 'intl', name: 'Intl Broad Market', color: '#f59e0b', type: 'equity', taxPref: ['taxable', 'deferred', 'roth'] },
    INTL_DEV: { id: 'intl_dev', name: 'Intl Developed Mkts', color: '#fbbf24', type: 'equity', taxPref: ['taxable', 'deferred', 'roth'] },
    INTL_EMERG: { id: 'intl_emerg', name: 'Emerging Markets', color: '#f97316', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },
    INTL_SMALL: { id: 'intl_small', name: 'Intl Small Cap', color: '#ea580c', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },
    EUROPE: { id: 'europe', name: 'Europe ETF', color: '#38bdf8', type: 'equity', taxPref: ['taxable', 'deferred'] },
    PACIFIC: { id: 'pacific', name: 'Pacific / Asia ETF', color: '#0ea5e9', type: 'equity', taxPref: ['taxable', 'deferred'] },

    // Sectors & Thematic
    SECTOR_TECH: { id: 'sector_tech', name: 'Technology Sector', color: '#06b6d4', type: 'equity', taxPref: ['taxable', 'roth'] },
    SECTOR_HEALTH: { id: 'sector_health', name: 'Healthcare Sector', color: '#ec4899', type: 'equity', taxPref: ['taxable', 'roth'] },
    SECTOR_ENERGY: { id: 'sector_energy', name: 'Energy Sector', color: '#ef4444', type: 'equity', taxPref: ['taxable', 'roth'] },
    SECTOR_FINANCE: { id: 'sector_finance', name: 'Financials Sector', color: '#64748b', type: 'equity', taxPref: ['taxable', 'deferred', 'roth'] },

    // Specialized / Alternatives
    DIVIDEND: { id: 'dividend', name: 'Dividend Growth', color: '#8b5cf6', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
    REIT: { id: 'reit', name: 'Real Estate (REITs)', color: '#be185d', type: 'equity', taxPref: ['deferred', 'roth', 'taxable'] },
    GOLD: { id: 'gold', name: 'Gold / Precious Metals', color: '#eab308', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
    COMMODITIES: { id: 'commodities', name: 'Broad Commodities', color: '#a16207', type: 'equity', taxPref: ['taxable', 'roth'] },
    CRYPTO: { id: 'crypto', name: 'Bitcoin / Crypto', color: '#f59e0b', type: 'equity', taxPref: ['taxable', 'roth'] },

    // Fixed Income & Cash
    BONDS: { id: 'bonds', name: 'Bonds', color: '#f43f5e', type: 'fixed', taxPref: ['deferred', 'roth', 'taxable'] },

    // Individual Stocks
    INDIVIDUAL_STOCK: { id: 'individual_stock', name: 'Individual Stocks', color: '#a855f7', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
};

export const TICKER_MAPPING = {
    'VTI': 'us_broad', 'ITOT': 'us_broad', 'SCHB': 'us_broad',
    'VOO': 'us_large', 'IVV': 'us_large', 'SPY': 'us_large',
    'VO': 'us_mid', 'IJH': 'us_mid',
    'VB': 'us_small', 'IJR': 'us_small',
    'VUG': 'us_large_growth', 'QQQ': 'us_large_growth',
    'VTV': 'us_large_value',
    'VXUS': 'intl', 'IXUS': 'intl', 'VEU': 'intl',
    'VEA': 'intl_dev', 'IEFA': 'intl_dev',
    'VWO': 'intl_emerg', 'IEMG': 'intl_emerg',
    'BND': 'bonds', 'AGG': 'bonds', 'BNDX': 'bonds',
    'VNQ': 'reit', 'IYR': 'reit',
    'GLD': 'gold', 'IAU': 'gold',
    'VGT': 'sector_tech', 'XLK': 'sector_tech',
    'VHT': 'sector_health', 'XLV': 'sector_health',
    // Money Market Funds (Cash)
    'SWVXX': 'money_market', 'SNOXX': 'money_market', 'SNVXX': 'money_market', // Schwab money market
    'VMFXX': 'money_market', 'VMMXX': 'money_market', 'VUSXX': 'money_market', // Vanguard money market
    'FDRXX': 'money_market', 'SPAXX': 'money_market', 'FCASH': 'money_market', 'FGTXX': 'money_market', 'SPRXX': 'money_market' // Fidelity money market
};

export const TAX_STRATEGIES = {
    STANDARD: {
        id: 'standard',
        name: 'Standard Tax Efficiency',
        icon: Scale,
        desc: 'Optimizes for annual tax savings. Prioritizes Stocks in Taxable for Qualified Dividends, Foreign Tax Credits, and Tax Loss Harvesting. Places Bonds in IRA/401k to defer Ordinary Income.'
    },
    ROTH_GROWTH: {
        id: 'roth_growth',
        name: 'Maximize Roth Growth',
        icon: TrendingUp,
        desc: 'Maximizes long-term tax-free growth. Prioritizes all Stocks in Roth first. Trade-off: International stocks in Roth cannot claim Foreign Tax Credits, and Roth assets cannot be tax-loss harvested.'
    },
    BALANCED_ROTH: {
        id: 'balanced_roth',
        name: 'Balanced Roth Growth',
        icon: Target,
        desc: 'Balances tax-free growth with tax optimization. Prioritizes Domestic Stocks in Roth, International in Taxable (to preserve FTCs), and Bonds in Traditional. Well-suited for portfolios with significant international allocation.'
    },
    MIRRORED: {
        id: 'mirrored',
        name: 'Mirrored Allocation',
        icon: ArrowLeftRight,
        desc: 'Prioritizes simplicity and ease of rebalancing. Replicates target allocation in each account. Trade-off: Does not optimize asset location for tax efficiency, potentially leaving tax benefits on the table.'
    }
};

export const REBALANCE_MODES = {
    STRICT: {
        id: 'strict',
        name: 'Strict / Calendar',
        icon: Calendar,
        desc: 'Rebalance immediately on any deviation. Best for tax-advantaged accounts or strict index tracking.'
    },
    BANDS: {
        id: 'bands',
        name: 'Drift Bands (5/25 Rule)',
        icon: Layers,
        desc: '5% absolute drift for major assets (>20%), 25% relative drift for minor assets (<20%).'
    },
    INFLOW: {
        id: 'inflow',
        name: 'Inflow Only (Accumulate)',
        icon: ArrowDownRight,
        desc: 'Never sell. Only use new cash deposits to buy underweight assets.'
    }
};

export const ACCOUNT_CREATION_OPTIONS = [
    { id: 'emergency_fund', name: 'Emergency Fund / Cash Savings', taxType: 'taxable', icon: Shield, desc: 'High-yield savings, Money Market, or T-Bills.' },
    { id: 'taxable', name: 'Individual / Joint Brokerage', taxType: 'taxable', icon: Wallet, desc: 'Standard taxable account.' },
    { id: 'trad_ira', name: 'Traditional IRA', taxType: 'deferred', icon: Landmark, desc: 'Tax-deferred retirement account.' },
    { id: 'rollover_ira', name: 'Rollover IRA', taxType: 'deferred', icon: RefreshCw, desc: 'Consolidated 401(k) funds.' },
    { id: 'roth_ira', name: 'Roth IRA', taxType: 'roth', icon: ShieldCheck, desc: 'Tax-free growth and withdrawals.' },
    { id: 'trad_401k', name: 'Traditional 401(k) / 403(b)', taxType: 'deferred', icon: Briefcase, desc: 'Employer-sponsored pre-tax plan.' },
    { id: 'roth_401k', name: 'Roth 401(k)', taxType: 'roth', icon: ShieldCheck, desc: 'Employer-sponsored post-tax plan.' },
    { id: 'hsa', name: 'Health Savings Account (HSA)', taxType: 'deferred', icon: Activity, desc: 'Triple-tax advantaged for medical.' },
];

export const EQUITY_PRESETS = [
    {
        name: 'Total World Market (Default)',
        desc: 'Market-cap weighted global portfolio.',
        allocation: { us_broad: 60, intl: 40 }
    },
    {
        name: 'US Bias',
        desc: 'Heavy US exposure with some international.',
        allocation: { us_broad: 80, intl: 20 }
    },
    {
        name: 'Factor Tilt',
        desc: 'Slight tilt towards Small Cap Value & Emerging.',
        allocation: { us_broad: 52, us_small_val: 8, intl: 35, intl_emerg: 5 }
    },
    {
        name: 'Rick Ferri Core 4',
        desc: 'Classic lazy portfolio structure.',
        allocation: { us_broad: 48, intl: 24, reit: 8, us_small_val: 20 }
    },
    {
        name: 'Custom / Build Your Own',
        desc: 'Start fresh with an empty allocation.',
        allocation: {}
    }
];

export const DEMO_DATA = {
    accounts: {
        'demo_1': { id: 'demo_1', name: 'Vanguard Brokerage', typeId: 'taxable', taxType: 'taxable', cash: 5000, funds: [{ id: 1, name: 'VTI', type: 'us_broad', value: 150000 }, { id: 2, name: 'VXUS', type: 'intl', value: 80000 }] },
        'demo_2': { id: 'demo_2', name: 'Fidelity IRA', typeId: 'trad_ira', taxType: 'deferred', cash: 1000, funds: [{ id: 3, name: 'BND', type: 'bonds', value: 40000 }, { id: 4, name: 'VTV', type: 'us_large_value', value: 20000 }] },
        'demo_3': { id: 'demo_3', name: 'Roth IRA', typeId: 'roth_ira', taxType: 'roth', cash: 500, funds: [{ id: 5, name: 'VUG', type: 'us_large_growth', value: 30000 }, { id: 6, name: 'VNQ', type: 'reit', value: 10000 }] },
        'demo_ef': { id: 'demo_ef', name: 'HYSA Emergency Fund', typeId: 'emergency_fund', taxType: 'taxable', cash: 25000, funds: [] }
    },
    bondAllocation: 15,
    emergencyFund: 25000,
    userAge: 35,
    bondStrategyMode: 'smart',
    equityStrategy: { us_broad: 50, us_large_value: 10, us_large_growth: 10, intl: 20, reit: 10 },
    taxStrategy: 'standard'
};

export const TOUR_STEPS = [
    { id: 'dashboard', title: 'Your Portfolio Dashboard', description: 'This is your command center. See your total net worth, asset allocation, and portfolio health at a glance.', target: 'dashboard' },
    { id: 'accounts', title: 'Manage Your Accounts', description: 'Add all your investment accounts here - brokerage, IRAs, 401(k)s, and even your emergency fund.', target: 'accounts' },
    { id: 'strategy', title: 'Customize Your Strategy', description: 'Set your target bond allocation and customize which stocks you want to hold. Start simple with 2-3 asset classes, or go deep with 20+.', target: 'configure' },
    { id: 'balance', title: 'Rebalance Your Portfolio', description: 'See exactly what to buy and sell to get back to your target allocation. Choose between strict rebalancing, drift bands, or inflow-only strategies.', target: 'rebalance' },
    { id: 'settings', title: 'Privacy & Data Management', description: 'Your data never leaves your device. Everything is stored locally in your browser. Export backups anytime, and import them to restore your portfolio.', target: 'settings' },
    { id: 'complete', title: "You're All Set!", description: 'Ready to get started? Load demo data to explore features, or add your first account to begin tracking your real portfolio.', target: null }
];

// --- Non-Linear Glide Path Constants ---
export const RETIREMENT_AGE = 65;
export const GLIDE_PATH_START_AGE = 40;
export const BOND_MIN = 10;
export const BOND_MAX = 70;

export const DEFAULT_EQUITY_SPLIT = EQUITY_PRESETS[0].allocation;
