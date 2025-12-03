import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  Moon,
  Sun,
  Percent,
  AlertTriangle,
  Undo2,
  Target,
  SlidersHorizontal,
  X,
  ChevronDown,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Lock,
  Briefcase,
  Landmark,
  ShieldCheck,
  Shield,
  LayoutDashboard,
  ArrowLeftRight,
  Scale,
  Download,
  Upload,
  Save,
  AlertCircle,
  PieChart as PieChartIcon,
  MousePointerClick,
  Layers,
  Coffee,
  Heart
} from 'lucide-react';
import tickerDatabase from './tickerDatabase.json';

// --- Constants & Configuration ---

const ASSET_CLASSES = {
  // Cash & Equivalents
  CASH: { id: 'money_market', name: 'Money Market / Cash Equiv.', color: '#71717a', type: 'fixed', taxPref: ['taxable', 'deferred', 'roth'] },

  // US Equities - Core
  US_BROAD: { id: 'us_broad', name: 'US Broad Market', color: '#10b981', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
  US_LARGE: { id: 'us_large', name: 'US Large Cap (S&P 500)', color: '#34d399', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
  US_MID: { id: 'us_mid', name: 'US Mid Cap', color: '#2dd4bf', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },
  US_SMALL: { id: 'us_small', name: 'US Small Cap', color: '#06b6d4', type: 'equity', taxPref: ['roth', 'deferred', 'taxable'] },

  // US Equities - Style
  US_LARGE_GROWTH: { id: 'us_large_growth', name: 'US Large Growth', color: '#3b82f6', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
  US_LARGE_VALUE: { id: 'us_large_value', name: 'US Large Value', color: '#6366f1', type: 'equity', taxPref: ['deferred', 'roth', 'taxable'] },
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
  SECTOR_FINANCE: { id: 'sector_finance', name: 'Financials Sector', color: '#64748b', type: 'equity', taxPref: ['deferred', 'taxable'] },

  // Specialized / Alternatives
  DIVIDEND: { id: 'dividend', name: 'Dividend Growth', color: '#8b5cf6', type: 'equity', taxPref: ['roth', 'taxable', 'deferred'] },
  REIT: { id: 'reit', name: 'Real Estate (REITs)', color: '#be185d', type: 'equity', taxPref: ['deferred', 'roth', 'taxable'] },
  GOLD: { id: 'gold', name: 'Gold / Precious Metals', color: '#eab308', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },
  COMMODITIES: { id: 'commodities', name: 'Broad Commodities', color: '#a16207', type: 'equity', taxPref: ['taxable', 'roth'] },
  CRYPTO: { id: 'crypto', name: 'Bitcoin / Crypto', color: '#f59e0b', type: 'equity', taxPref: ['taxable', 'roth'] },

  // Fixed Income & Cash
  BONDS: { id: 'bonds', name: 'Bonds', color: '#f43f5e', type: 'fixed', taxPref: ['deferred', 'roth', 'taxable'] },

  // Individual Stocks
  INDIVIDUAL_STOCK: { id: 'individual_stock', name: 'Individual Stocks', color: '#a855f7', type: 'equity', taxPref: ['taxable', 'roth', 'deferred'] },

};

const TICKER_MAPPING = {
  'VTI': 'us_broad', 'ITOT': 'us_broad', 'SCHB': 'us_broad',
  'VOO': 'us_large', 'IVV': 'us_large', 'SPY': 'us_large',
  'VO': 'us_mid', 'IJH': 'us_mid',
  'VB': 'us_small', 'IJR': 'us_small',
  'VUG': 'us_large_growth', 'QQQ': 'us_large_growth',
  'VTV': 'us_large_value',
  'VXUS': 'intl', 'IXUS': 'intl',
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

// Strategies for Asset Location
const TAX_STRATEGIES = {
  STANDARD: {
    id: 'standard',
    name: 'Standard Tax Efficiency',
    icon: Scale,
    desc: 'Prioritize annual tax savings. Places Stocks in Taxable (Qualified Dividends) and Bonds in IRA/401k (Ordinary Income).'
  },
  ROTH_GROWTH: {
    id: 'roth_growth',
    name: 'Maximize Roth Growth',
    icon: TrendingUp,
    desc: 'Prioritize long-term tax-free growth. Forces Stocks into Roth accounts first. Pushes Bonds to Traditional IRA or Taxable.'
  },
  MIRRORED: {
    id: 'mirrored',
    name: 'Mirrored Allocation',
    icon: ArrowLeftRight,
    desc: 'Prioritize simplicity. Replicates your target asset allocation (e.g. 60/40) equally inside every single account.'
  }
};

const REBALANCE_MODES = {
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

// Define available account types for creation
const ACCOUNT_CREATION_OPTIONS = [
  { id: 'emergency_fund', name: 'Emergency Fund / Cash Savings', taxType: 'taxable', icon: Shield, desc: 'High-yield savings, Money Market, or T-Bills.' },
  { id: 'taxable', name: 'Individual / Joint Brokerage', taxType: 'taxable', icon: Wallet, desc: 'Standard taxable account.' },
  { id: 'trad_ira', name: 'Traditional IRA', taxType: 'deferred', icon: Landmark, desc: 'Tax-deferred retirement account.' },
  { id: 'rollover_ira', name: 'Rollover IRA', taxType: 'deferred', icon: RefreshCw, desc: 'Consolidated 401(k) funds.' },
  { id: 'roth_ira', name: 'Roth IRA', taxType: 'roth', icon: ShieldCheck, desc: 'Tax-free growth and withdrawals.' },
  { id: 'trad_401k', name: 'Traditional 401(k) / 403(b)', taxType: 'deferred', icon: Briefcase, desc: 'Employer-sponsored pre-tax plan.' },
  { id: 'roth_401k', name: 'Roth 401(k)', taxType: 'roth', icon: ShieldCheck, desc: 'Employer-sponsored post-tax plan.' },
  { id: 'hsa', name: 'Health Savings Account (HSA)', taxType: 'deferred', icon: Activity, desc: 'Triple-tax advantaged for medical.' },
];

const EQUITY_PRESETS = [
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

const DEMO_DATA = {
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

const DEFAULT_EQUITY_SPLIT = EQUITY_PRESETS[0].allocation;

const TOUR_STEPS = [
  { id: 'dashboard', title: 'Your Portfolio Dashboard', description: 'This is your command center. See your total net worth, asset allocation, and portfolio health at a glance.', target: 'dashboard' },
  { id: 'accounts', title: 'Manage Your Accounts', description: 'Add all your investment accounts here - brokerage, IRAs, 401(k)s, and even your emergency fund.', target: 'accounts' },
  { id: 'strategy', title: 'Customize Your Strategy', description: 'Set your target bond allocation and customize which stocks you want to hold. Start simple with 2-3 asset classes, or go deep with 20+.', target: 'configure' },
  { id: 'balance', title: 'Rebalance Your Portfolio', description: 'See exactly what to buy and sell to get back to your target allocation. Choose between strict rebalancing, drift bands, or inflow-only strategies.', target: 'rebalance' },
  { id: 'settings', title: 'Privacy & Data Management', description: 'Your data never leaves your device. Everything is stored locally in your browser. Export backups anytime, and import them to restore your portfolio.', target: 'settings' },
  { id: 'complete', title: "You're All Set!", description: 'Ready to get started? Load demo data to explore features, or add your first account to begin tracking your real portfolio.', target: null }
];

// --- Non-Linear Glide Path Constants ---
const RETIREMENT_AGE = 65;
const GLIDE_PATH_START_AGE = 40;
const BOND_MIN = 10;
const BOND_MAX = 70;

const getSuggestedBondAllocation = (age) => {
  const numericAge = parseInt(age, 10);
  if (isNaN(numericAge) || numericAge < 18) return BOND_MIN;
  if (numericAge < GLIDE_PATH_START_AGE) return BOND_MIN;
  if (numericAge >= RETIREMENT_AGE) return BOND_MAX;

  const totalBondRange = BOND_MAX - BOND_MIN;
  const totalGlidePathYears = RETIREMENT_AGE - GLIDE_PATH_START_AGE;
  const yearsIntoGlidePath = numericAge - GLIDE_PATH_START_AGE;
  const P = yearsIntoGlidePath / totalGlidePathYears;
  const bondIncrease = totalBondRange * (P * P);
  const bondPercentage = BOND_MIN + bondIncrease;

  return Math.round(bondPercentage);
};

const detectStrategy = (age, allocation) => {
  const numericAge = parseInt(age, 10) || 0;
  if (allocation === getSuggestedBondAllocation(numericAge)) return 'smart';
  if (allocation === Math.max(0, numericAge - 20)) return 'aggressive';
  if (allocation === Math.max(0, numericAge - 10)) return 'moderate';
  if (allocation === Math.min(100, numericAge)) return 'conservative';
  return 'manual';
};

const generateGlidePathData = (strategyType) => {
  const data = [];
  for (let age = 18; age <= 90; age++) {
    let bonds = 0;
    switch (strategyType) {
      case 'aggressive': bonds = Math.max(0, age - 20); break;
      case 'moderate': bonds = Math.max(0, age - 10); break;
      case 'conservative': bonds = Math.min(100, age); break;
      case 'smart': default: bonds = getSuggestedBondAllocation(age); break;
    }
    data.push({ age, bonds });
  }
  return data;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-200 ${className}`}>
    {children}
  </div>
);

const formatCurrency = (value) => {
  if (isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

// --- Sub-Components ---

const FundRow = React.memo(({ fund, accountId, updateFund, removeFund }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in slide-in-from-left-2 duration-300 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm md:shadow-none md:border-0 md:bg-transparent md:p-0 mb-3 md:mb-0">

      <div className="md:col-span-4">
        <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Fund Name</label>
        <input
          type="text"
          placeholder="e.g. VTI"
          className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
          value={fund.name}
          onChange={(e) => updateFund(accountId, fund.id, 'name', e.target.value)}
          onBlur={(e) => {
            const ticker = e.target.value.trim().toUpperCase();
            const assetClass = tickerDatabase[ticker];
            if (assetClass && fund.type !== assetClass) {
              updateFund(accountId, fund.id, 'type', assetClass);
            }
          }}
        />
      </div>

      <div className="md:col-span-4">
        <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Asset Class</label>
        <div className="relative">
          <select
            className="w-full pl-3 pr-8 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
            value={fund.type}
            onChange={(e) => updateFund(accountId, fund.id, 'type', e.target.value)}
          >
            {Object.values(ASSET_CLASSES).map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="md:col-span-3 relative">
        <label className="block md:hidden text-xs font-medium text-zinc-500 mb-1">Value ($)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
          <input
            type="number"
            className="w-full pl-6 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            value={fund.value}
            onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => updateFund(accountId, fund.id, 'value', e.target.value)}
          />
        </div>
      </div>

      <div className="md:col-span-1 flex justify-end gap-1">
        <button
          onClick={() => updateFund(accountId, fund.id, 'isEmergency', !fund.isEmergency)}
          className={`p-2 rounded-md transition-colors ${fund.isEmergency ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-zinc-300 hover:text-zinc-400'}`}
          title={fund.isEmergency ? "Fund counts as Emergency Fund" : "Fund counts as Investment"}
        >
          <Shield className="w-4 h-4" />
        </button>
        <button
          onClick={() => removeFund(accountId, fund.id)}
          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          aria-label="Remove Fund"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});


// --- Main Application Component ---

export default function PortfolioApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bondAllocation, setBondAllocation] = useState(10);
  const [emergencyFund, setEmergencyFund] = useState(10000);
  const [userAge, setUserAge] = useState(38);
  const [bondStrategyMode, setBondStrategyMode] = useState('smart');
  const [equityStrategy, setEquityStrategy] = useState(DEFAULT_EQUITY_SPLIT);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [taxStrategy, setTaxStrategy] = useState('standard');

  // Rebalancing Settings - Split by Account Type
  const [rebalanceModeTaxable, setRebalanceModeTaxable] = useState('bands');
  const [rebalanceModeSheltered, setRebalanceModeSheltered] = useState('strict');

  const [accounts, setAccounts] = useState({});
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState(ACCOUNT_CREATION_OPTIONS[1].id);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('dashboard');

  // --- UI State for Notifications & Confirmations ---
  const [notification, setNotification] = useState({ message: '', type: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [pasteModal, setPasteModal] = useState({ isOpen: false, accountId: null, text: '', parsed: [] });

  // Onboarding state
  const [showWelcome, setShowWelcome] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Define activeAssets here, as it no longer depends on isSimpleMode
  const activeAssets = ASSET_CLASSES;

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: null }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Check for first-time visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('balanced_has_visited');
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load Data
  useEffect(() => {
    const savedData = localStorage.getItem('balanced_data_v7');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.bondAllocation !== undefined) setBondAllocation(parsed.bondAllocation);
        if (parsed.emergencyFund !== undefined) setEmergencyFund(parsed.emergencyFund);
        if (parsed.userAge !== undefined) setUserAge(parsed.userAge);
        if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
        if (parsed.equityStrategy !== undefined) setEquityStrategy(parsed.equityStrategy);
        if (parsed.taxStrategy) setTaxStrategy(parsed.taxStrategy);

        // Load split rebalance modes, fallback to old global mode if present
        if (parsed.rebalanceModeTaxable) setRebalanceModeTaxable(parsed.rebalanceModeTaxable);
        else if (parsed.rebalanceMode) setRebalanceModeTaxable(parsed.rebalanceMode);

        if (parsed.rebalanceModeSheltered) setRebalanceModeSheltered(parsed.rebalanceModeSheltered);
        else if (parsed.rebalanceMode) setRebalanceModeSheltered(parsed.rebalanceMode);

        if (parsed.bondStrategyMode) {
          setBondStrategyMode(parsed.bondStrategyMode);
        } else if (parsed.bondAllocation !== undefined) {
          const detected = detectStrategy(parsed.userAge || 38, parsed.bondAllocation);
          setBondStrategyMode(detected === 'manual' ? 'custom' : detected);
        }
        if (parsed.accounts) {
          setAccounts(parsed.accounts);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save Data (Debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('balanced_data_v7', JSON.stringify({
        accounts, bondAllocation, emergencyFund, userAge, isDarkMode, equityStrategy, bondStrategyMode, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered
      }));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [accounts, bondAllocation, emergencyFund, userAge, isDarkMode, equityStrategy, bondStrategyMode, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered]);

  // --- Core Logic ---

  const createAccount = () => {
    if (!newAccountName.trim()) return;

    const accountTypeInfo = ACCOUNT_CREATION_OPTIONS.find(o => o.id === newAccountType);

    if (!accountTypeInfo) {
      console.error(`Invalid account type selected: ${newAccountType}`);
      setNotification({ message: `Error: Invalid account type selected: "${newAccountType}"`, type: 'error' });
      return;
    }

    const newId = `acc_${Date.now()}`;

    setAccounts(prev => ({
      ...prev,
      [newId]: {
        id: newId,
        name: newAccountName,
        typeId: newAccountType,
        taxType: accountTypeInfo.taxType,
        iconId: newAccountType,
        cash: 0,
        funds: []
      }
    }));

    setNewAccountName('');
    setShowAccountModal(false);
    if (Object.keys(accounts).length === 0) {
      setActiveTab('accounts');
    }
    setNotification({ message: 'Account created successfully', type: 'success' });
  };

  const deleteAccount = (accountId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you sure you want to delete this account? This action cannot be undone.',
      onConfirm: () => {
        setAccounts(prev => {
          const next = { ...prev };
          delete next[accountId];
          return next;
        });
        setNotification({ message: 'Account deleted', type: 'success' });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- Import / Export Functions ---
  const handleExportData = () => {
    const dataToExport = {
      version: 'v7',
      timestamp: new Date().toISOString(),
      accounts,
      bondAllocation,
      emergencyFund,
      userAge,
      bondStrategyMode,
      equityStrategy,
      taxStrategy,
      rebalanceModeTaxable,
      rebalanceModeSheltered
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balanced_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ message: 'Backup exported successfully', type: 'success' });
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (importedData.accounts && importedData.version) {
          setConfirmModal({
            isOpen: true,
            title: 'Restore Backup',
            message: 'This will overwrite your current portfolio data with the data from the backup file. Are you sure you want to proceed?',
            onConfirm: () => {
              setAccounts(importedData.accounts || {});
              setBondAllocation(importedData.bondAllocation || 10);
              setEmergencyFund(importedData.emergencyFund || 10000);
              setUserAge(importedData.userAge || 38);
              setBondStrategyMode(importedData.bondStrategyMode || 'smart');
              setEquityStrategy(importedData.equityStrategy || DEFAULT_EQUITY_SPLIT);
              setTaxStrategy(importedData.taxStrategy || 'standard');
              if (importedData.rebalanceModeTaxable) setRebalanceModeTaxable(importedData.rebalanceModeTaxable);
              if (importedData.rebalanceModeSheltered) setRebalanceModeSheltered(importedData.rebalanceModeSheltered);
              setNotification({ message: 'Data restored successfully', type: 'success' });
              setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
            }
          });
        } else {
          setNotification({ message: 'Invalid file format. Please upload a valid backup file.', type: 'error' });
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setNotification({ message: 'Failed to parse file. Ensure it is a valid JSON backup.', type: 'error' });
      }
    };
    reader.readAsText(file);
    event.target.value = null; // Reset input
    event.target.value = null; // Reset input
    return parsed;
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse CSV handling quoted fields
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    // Find the header row (first row with multiple commas that looks like headers)
    let headerIdx = 0;
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length > 2 && cols.some(c => c.toLowerCase().includes('symbol') || c.toLowerCase().includes('ticker') || c.toLowerCase().includes('description'))) {
        headerIdx = i;
        break;
      }
    }

    const headers = parseCSVLine(lines[headerIdx]).map(h => h.toLowerCase());

    // Detect column indices
    const symbolIdx = headers.findIndex(h => h.includes('symbol') || h.includes('ticker'));
    const nameIdx = headers.findIndex(h => h.includes('description') || h.includes('name') || h.includes('security'));
    const quantityIdx = headers.findIndex(h => h.includes('quantity') || h.includes('shares'));
    const valueIdx = headers.findIndex(h => h.includes('value') || h.includes('market') || h.includes('total'));

    const parsed = [];
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 2) continue; // Skip invalid rows

      // Get symbol/ticker
      let symbol = symbolIdx >= 0 ? cols[symbolIdx] : '';
      let name = nameIdx >= 0 ? cols[nameIdx] : '';

      // Use whichever is available
      const displayName = symbol || name;
      if (!displayName) continue;

      // Skip total/summary rows
      const lowerDisplay = displayName.toLowerCase();
      if (lowerDisplay.includes('total') ||
        lowerDisplay.includes('subtotal') ||
        lowerDisplay.includes('account total') ||
        lowerDisplay.includes('grand total') ||
        lowerDisplay === 'totals' ||
        lowerDisplay === 'total:') {
        continue;
      }

      // Get value
      let valueStr = valueIdx >= 0 ? cols[valueIdx] : '';
      if (!valueStr && quantityIdx >= 0) {
        valueStr = cols[quantityIdx];
      }

      valueStr = valueStr.replace(/[$,]/g, '');
      const value = parseFloat(valueStr);
      if (isNaN(value) || value <= 0) continue;

      // Enhanced asset class detection
      const upperSymbol = symbol.toUpperCase();
      const upperName = name.toUpperCase();
      const combined = (upperSymbol + ' ' + upperName).toUpperCase();

      let type = 'us_broad'; // Default

      // Check ticker mapping first
      if (tickerDatabase[upperSymbol]) {
        type = tickerDatabase[upperSymbol];
      }
      // Check fund name for keywords
      else if (combined.includes('BOND') || combined.includes('FIXED') || combined.includes('TREASURY')) {
        type = 'bonds';
      }
      else if (combined.includes('INTERNATIONAL') || combined.includes('FOREIGN') || combined.includes('GLOBAL') || combined.includes('WORLD') || combined.includes('EMERGING')) {
        if (combined.includes('EMERGING') || combined.includes('EMERG')) {
          type = 'intl_emerg';
        } else if (combined.includes('DEVELOPED') || combined.includes('EUROPE') || combined.includes('PACIFIC')) {
          type = 'intl_dev';
        } else {
          type = 'intl';
        }
      }
      else if (combined.includes('REIT') || combined.includes('REAL ESTATE')) {
        type = 'reit';
      }
      else if (combined.includes('SMALL CAP') || combined.includes('SMALL-CAP')) {
        if (combined.includes('VALUE')) {
          type = 'us_small_val';
        } else if (combined.includes('GROWTH')) {
          type = 'us_small_growth';
        } else {
          type = 'us_small';
        }
      }
      else if (combined.includes('MID CAP') || combined.includes('MID-CAP')) {
        type = 'us_mid';
      }
      else if (combined.includes('LARGE CAP') || combined.includes('LARGE-CAP')) {
        if (combined.includes('VALUE')) {
          type = 'us_large_value';
        } else if (combined.includes('GROWTH')) {
          type = 'us_large_growth';
        } else {
          type = 'us_large';
        }
      }
      else if (combined.includes('VALUE')) {
        type = 'us_large_value';
      }
      else if (combined.includes('GROWTH')) {
        type = 'us_large_growth';
      }
      else if (combined.includes('DIVIDEND')) {
        type = 'dividend';
      }
      else if (combined.includes('TECH') || combined.includes('TECHNOLOGY')) {
        type = 'sector_tech';
      }
      else if (combined.includes('HEALTH') || combined.includes('MEDICAL')) {
        type = 'sector_health';
      }
      else if (combined.includes('ENERGY')) {
        type = 'sector_energy';
      }
      else if (combined.includes('FINANCE') || combined.includes('FINANCIAL')) {
        type = 'sector_finance';
      }
      else if (combined.includes('GOLD') || combined.includes('PRECIOUS')) {
        type = 'gold';
      }
      else if (combined.includes('COMMODITY') || combined.includes('COMMODITIES')) {
        type = 'commodities';
      }
      else if (combined.includes('CRYPTO') || combined.includes('BITCOIN')) {
        type = 'crypto';
      }
      else if (combined.includes('CASH') || combined.includes('MONEY MARKET')) {
        type = 'money_market';
      }

      parsed.push({ id: Date.now() + Math.random(), name: displayName, value, type });
    }

    return parsed;
  };

  const parsePasteData = (text) => {
    // Check if input looks like CSV (has commas and multiple lines)
    const hasCommas = text.includes(',');
    const lineCount = text.split(/\r?\n/).filter(l => l.trim()).length;

    if (hasCommas && lineCount > 1) {
      // Try CSV parsing first
      const csvResult = parseCSV(text);
      if (csvResult.length > 0) return csvResult;
    }

    // Fall back to original tab/space parsing
    const lines = text.split(/\r?\n/);
    const parsed = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Try to split by tab or comma
      const parts = trimmed.split(/[\t,]+/);
      if (parts.length < 2) return;

      // Simple heuristic: First part is ticker/name, Last part is value
      // This handles "VTI  $10,000" or "VTI 10000"
      const name = parts[0].trim();
      let valueStr = parts[parts.length - 1].trim();

      // Remove currency symbols and commas
      valueStr = valueStr.replace(/[$,]/g, '');
      const value = parseFloat(valueStr);

      if (!isNaN(value)) {
        // Guess type using tickerDatabase
        const upperName = name.toUpperCase();
        let type = 'us_broad'; // Default
        if (tickerDatabase[upperName]) {
          type = tickerDatabase[upperName];
        } else if (upperName.includes('BOND') || upperName.includes('AGG')) {
          type = 'bonds';
        } else if (upperName.includes('INTL') || upperName.includes('EMERG')) {
          type = 'intl';
        }

        parsed.push({ id: Date.now() + Math.random(), name, value, type });
      }
    });
    return parsed;
  };

  const resetAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset All Data',
      message: 'This will permanently delete all your accounts, settings, and portfolio data. This action cannot be undone. Are you sure?',
      onConfirm: () => {
        setAccounts({});
        setBondAllocation(10);
        setEmergencyFund(10000);
        setUserAge(38);
        setBondStrategyMode('smart');
        setEquityStrategy(DEFAULT_EQUITY_SPLIT);
        setTaxStrategy('standard');
        setRebalanceModeTaxable('strict');
        setRebalanceModeSheltered('strict');
        setNotification({ message: 'All data has been reset', type: 'success' });
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        setActiveTab('dashboard');
      }
    });
  };

  const loadDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Load Demo Portfolio',
      message: 'This will overwrite your current data with a sample portfolio. Are you sure?',
      onConfirm: () => {
        setAccounts(DEMO_DATA.accounts);
        setBondAllocation(DEMO_DATA.bondAllocation);
        setEmergencyFund(DEMO_DATA.emergencyFund);
        setUserAge(DEMO_DATA.userAge);
        setBondStrategyMode(DEMO_DATA.bondStrategyMode);
        setEquityStrategy(DEMO_DATA.equityStrategy);
        setTaxStrategy(DEMO_DATA.taxStrategy);
        setNotification({ message: 'Demo portfolio loaded!', type: 'success' });
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        setActiveTab('dashboard');
      }
    });
  };

  const startTour = () => {
    setShowWelcome(false);
    setTourActive(true);
    setTourStep(0);
    setActiveTab('dashboard'); // Always start at dashboard
    localStorage.setItem('balanced_has_visited', 'true');
  };

  const nextTourStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      // Auto-navigate to the correct tab
      const step = TOUR_STEPS[nextStep];
      if (step.target) {
        setActiveTab(step.target);
      }
    } else {
      endTour();
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      const step = TOUR_STEPS[prevStep];
      if (step.target) {
        setActiveTab(step.target);
      }
    }
  };

  const endTour = () => {
    setTourActive(false);
    setTourStep(0);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('balanced_has_visited', 'true');
  };

  const handleLoadDemoFromWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('balanced_has_visited', 'true');
    loadDemoData();
  };

  // --- Metrics Calculation ---
  const portfolioMetrics = useMemo(() => {
    let totalNetWorth = 0;
    let investableTotal = 0;
    let autoEmergencyFund = 0; // Auto-detected from marked accounts
    const currentAllocation = {};
    const accountTotals = {};

    // Initialize allocation buckets
    Object.keys(ASSET_CLASSES).forEach(key => currentAllocation[ASSET_CLASSES[key].id] = 0);

    Object.values(accounts).forEach((accData) => {
      if (!accData) return;

      // Calculate total value of this account
      let effectiveCash = parseFloat(accData.cash) || 0;
      let accFundsTotal = 0;
      if (Array.isArray(accData.funds)) {
        accData.funds.forEach(fund => {
          accFundsTotal += parseFloat(fund.value) || 0;
        });
      }

      const accTotal = effectiveCash + accFundsTotal;
      accountTotals[accData.id] = accTotal;
      totalNetWorth += accTotal;

      // Process Cash
      if (accData.cashIsEmergency) {
        autoEmergencyFund += effectiveCash;
      } else {
        investableTotal += effectiveCash;
        const cashKey = 'money_market';
        currentAllocation[cashKey] = (currentAllocation[cashKey] || 0) + effectiveCash;
      }

      // Process Funds
      if (Array.isArray(accData.funds)) {
        accData.funds.forEach(fund => {
          const val = parseFloat(fund.value) || 0;

          if (fund.isEmergency) {
            autoEmergencyFund += val;
          } else {
            investableTotal += val;
            let type = fund.type || 'us_broad';
            if (currentAllocation[type] !== undefined) {
              currentAllocation[type] += val;
            }
          }
        });
      }
    });



    // Calculate Emergency Fund Surplus
    const emergencyTarget = parseFloat(emergencyFund) || 0;
    const emergencyActual = autoEmergencyFund;
    const emergencySurplus = Math.max(0, emergencyActual - emergencyTarget);

    // Treat surplus as investable cash for rebalancing calculations
    const effectiveInvestableTotal = investableTotal + emergencySurplus;

    const targets = {};
    const cashKey = 'money_market';
    const bondKey = 'bonds';

    targets[cashKey] = 0; // Investment cash target is 0 (fully invested assumption)

    const equityPct = 100 - bondAllocation;
    targets[bondKey] = effectiveInvestableTotal * (bondAllocation / 100);

    const equityTotalValue = effectiveInvestableTotal * (equityPct / 100);

    const totalStrat = Object.values(equityStrategy).reduce((a, b) => a + b, 0) || 100;
    Object.entries(equityStrategy).forEach(([assetId, weight]) => {
      const safeTotal = totalStrat === 0 ? 1 : totalStrat;
      targets[assetId] = equityTotalValue * (weight / safeTotal);
    });

    return { totalNetWorth, investableTotal: effectiveInvestableTotal, emergencyTarget, emergencyActual, currentAllocation, accountTotals, targets };
  }, [accounts, bondAllocation, emergencyFund, equityStrategy]);

  const rebalancingPlan = useMemo(() => {
    const { investableTotal, targets, accountTotals, emergencyActual, emergencyTarget } = portfolioMetrics;

    // 1. Emergency Fund Action Plan
    const efDiff = emergencyActual - emergencyTarget;
    const efAction = {
      status: Math.abs(efDiff) < 100 ? 'balanced' : (efDiff > 0 ? 'surplus' : 'deficit'),
      diff: Math.abs(efDiff),
      current: emergencyActual,
      target: emergencyTarget
    };

    // 2. Investment Portfolio Rebalancing
    if (investableTotal === 0) return { efAction, accountActions: {} };

    const accountActions = {};
    const investmentAccounts = Object.values(accounts).filter(a => !a.isEmergencyFund);

    // Helper to process actions based on Mode
    const processActions = (rawActions, accTotal, mode, availableCash, portfolioTotal) => {
      // Pre-calculation for Inflow Mode: Check if we can afford all buys
      let inflowRatio = 1;
      if (mode === 'inflow') {
        const totalBuyNeeded = rawActions.reduce((sum, a) => (a.diff > 0 && a.assetId !== 'money_market') ? sum + a.diff : sum, 0);
        if (totalBuyNeeded > availableCash && totalBuyNeeded > 0) {
          inflowRatio = Math.max(0, availableCash) / totalBuyNeeded;
        }
      }

      // Pre-calculation for Bands Mode: Check if ANY asset has drifted
      let bandsTriggered = false;
      if (mode === 'bands') {
        bandsTriggered = rawActions.some(action => {
          let { current, target } = action;
          const denominator = portfolioTotal > 0 ? portfolioTotal : accTotal;
          const targetPct = denominator > 0 ? (target / denominator) * 100 : 0;
          const currentPct = denominator > 0 ? (current / denominator) * 100 : 0;

          let threshold = 0;
          if (targetPct >= 20) {
            threshold = 5; // Absolute 5%
          } else {
            threshold = targetPct * 0.25; // Relative 25%
          }

          return Math.abs(currentPct - targetPct) > threshold;
        });
      }

      return rawActions.map(action => {
        let { diff, current, target, assetId } = action;

        // Drift Calculation: Use Portfolio Total if provided, otherwise Account Total
        const denominator = portfolioTotal > 0 ? portfolioTotal : accTotal;
        const targetPct = denominator > 0 ? (target / denominator) * 100 : 0;
        const currentPct = denominator > 0 ? (current / denominator) * 100 : 0;

        // Default action
        let actionLabel = diff > 0 ? 'BUY' : 'SELL';
        if (assetId === 'cash') actionLabel = diff > 0 ? 'RAISE CASH' : 'INVEST CASH';
        let finalAction = actionLabel;
        let explanation = '';

        // MODE 1: STRICT
        if (mode === 'strict') {
          if (Math.abs(diff) < 10) finalAction = 'HOLD';
        }

        // MODE 2: BANDS (5/25 Rule)
        if (mode === 'bands') {
          if (!bandsTriggered) {
            finalAction = 'HOLD';
            explanation = 'Portfolio within bands';
          } else {
            // If triggered, we do a full rebalance (Strict behavior)
            explanation = 'Band breached - Rebalancing';
          }
        }

        // MODE 3: INFLOW ONLY
        if (mode === 'inflow') {
          // Logic: never sell assets (unless it's purely cash management)
          if (diff < 0 && assetId !== 'money_market') {
            finalAction = 'HOLD';
          }
          // Logic: Only suggest buying if there is cash available
          if (diff > 0 && assetId !== 'money_market') {
            if (availableCash <= 0) {
              finalAction = 'HOLD';
              explanation = 'No settlement cash';
            } else if (inflowRatio < 1) {
              // Proportional reduction
              diff = diff * inflowRatio;
              explanation = 'Reduced (Cash Limit)';
            }
          }
        }

        return { ...action, diff, action: finalAction, explanation };
      }).filter(a => a.action !== 'HOLD'); // Filter out HOLDs for the UI
    };


    if (taxStrategy === 'mirrored') {
      investmentAccounts.forEach(accData => {
        const accTotal = accountTotals[accData.id] || 0;
        if (accTotal <= 0) {
          accountActions[accData.id] = { targetHoldings: {}, currentTotal: 0, actions: [] };
          return;
        }
        const ratio = accTotal / investableTotal;
        const targetHoldings = {};
        Object.entries(targets).forEach(([assetId, globalAmount]) => {
          targetHoldings[assetId] = globalAmount * ratio;
        });
        const currentHoldings = {};
        Object.keys(ASSET_CLASSES).forEach(k => currentHoldings[ASSET_CLASSES[k].id] = 0);
        if (accData && Array.isArray(accData.funds)) {
          accData.funds.forEach(f => {
            if (f.isEmergency) return; // SKIP Emergency Funds
            let type = f.type;
            currentHoldings[type] = (currentHoldings[type] || 0) + parseFloat(f.value);
          });
        }
        const actualCashInAccount = accData ? (parseFloat(accData.cash) || 0) : 0;
        const cashKey = 'money_market';
        if (!accData.cashIsEmergency) { // SKIP Emergency Cash
          currentHoldings[cashKey] = (currentHoldings[cashKey] || 0) + actualCashInAccount;
        }

        let rawActions = [];
        Object.values(ASSET_CLASSES).forEach(assetClass => {
          const assetId = assetClass.id;
          const target = targetHoldings[assetId] || 0;
          const current = currentHoldings[assetId] || 0;
          const diff = target - current;

          if (current > 1 || target > 1) {
            rawActions.push({ assetId, assetName: assetClass.name, current, target, diff });
          }
        });

        const mode = accData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;
        // For Mirrored, the "Portfolio" is just this account
        const processedActions = processActions(rawActions, accTotal, mode, actualCashInAccount, accTotal);
        accountActions[accData.id] = { targetHoldings, currentTotal: accTotal, actions: processedActions.sort((a, b) => a.diff - b.diff) };
      });
    } else {
      // Global Buckets Logic
      let buckets = {
        taxable: { capacity: 0, accounts: [], filled: 0, allocations: {} },
        deferred: { capacity: 0, accounts: [], filled: 0, allocations: {} },
        roth: { capacity: 0, accounts: [], filled: 0, allocations: {} }
      };

      investmentAccounts.forEach(acc => {
        const bucket = buckets[acc.taxType];
        if (bucket) {
          bucket.capacity += (accountTotals[acc.id] || 0);
          bucket.accounts.push(acc.id);
        }
      });

      let remainingTargets = { ...targets };

      const addToBucket = (assetId, bucketType, amount) => {
        if (amount <= 0) return;
        const bucket = buckets[bucketType];
        if (!bucket) return;

        const available = bucket.capacity - bucket.filled;
        const actualAmount = Math.min(available, amount);

        bucket.allocations[assetId] = (bucket.allocations[assetId] || 0) + actualAmount;
        bucket.filled += actualAmount;
        remainingTargets[assetId] = Math.max(0, remainingTargets[assetId] - actualAmount);
      }

      const allocateAssetStandard = (assetId) => {
        let amount = remainingTargets[assetId];
        if (amount <= 0) return;

        const assetInfo = Object.values(ASSET_CLASSES).find(a => a.id === assetId);
        let prefs = ['taxable'];

        if (assetId === 'money_market') {
          prefs = ['taxable', 'deferred', 'roth'];
        } else if (taxStrategy === 'roth_growth') {
          if (assetInfo?.type === 'fixed') {
            prefs = ['deferred', 'taxable', 'roth'];
          } else {
            prefs = ['roth', 'taxable', 'deferred'];
          }
        } else {
          prefs = assetInfo?.taxPref || ['taxable', 'roth', 'deferred'];
        }

        for (let prefType of prefs) {
          if (remainingTargets[assetId] <= 0) break;
          const bucket = buckets[prefType];
          const available = bucket.capacity - bucket.filled;
          if (available > 0) {
            const take = Math.min(available, remainingTargets[assetId]);
            addToBucket(assetId, prefType, take);
          }
        }
      }

      allocateAssetStandard('money_market');
      if (targets['bonds']) allocateAssetStandard('bonds');

      if (taxStrategy !== 'mirrored') {
        const taxableCapacity = buckets.taxable.capacity - buckets.taxable.filled;
        if (taxableCapacity > 0) {
          const taxableCandidates = Object.keys(remainingTargets).filter(key => {
            if (key === 'money_market' || key === 'bonds') return false;
            if (remainingTargets[key] <= 0) return false;
            const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
            let prefs = asset?.taxPref || ['taxable'];
            if (taxStrategy === 'roth_growth') {
              if (asset?.type === 'fixed') prefs = ['deferred', 'taxable', 'roth'];
              else prefs = ['roth', 'taxable', 'deferred'];
            }
            return prefs[0] === 'taxable';
          });

          const totalCandidateTarget = taxableCandidates.reduce((sum, key) => sum + remainingTargets[key], 0);

          if (totalCandidateTarget > 0) {
            const ratio = Math.min(1, taxableCapacity / totalCandidateTarget);
            taxableCandidates.forEach(assetId => {
              const amountForTaxable = remainingTargets[assetId] * ratio;
              addToBucket(assetId, 'taxable', amountForTaxable);
            });
          }
        }
      }

      Object.keys(remainingTargets).forEach(assetId => {
        if (remainingTargets[assetId] > 0) {
          allocateAssetStandard(assetId);
        }
      });

      investmentAccounts.forEach(accData => {
        const accId = accData.id;
        const bucket = buckets[accData.taxType];
        const accTotal = accountTotals[accId] || 0;
        const bucketTotal = bucket.capacity;
        const share = bucketTotal > 0 ? accTotal / bucketTotal : 0;
        const targetHoldings = {};
        Object.entries(bucket.allocations).forEach(([assetId, amount]) => targetHoldings[assetId] = amount * share);

        let rawActions = [];
        const currentHoldings = {};
        Object.keys(ASSET_CLASSES).forEach(k => currentHoldings[ASSET_CLASSES[k].id] = 0);

        if (accData && Array.isArray(accData.funds)) {
          accData.funds.forEach(f => {
            if (f.isEmergency) return; // SKIP Emergency Funds
            let type = f.type;
            currentHoldings[type] = (currentHoldings[type] || 0) + parseFloat(f.value);
          });
        }
        const actualCashInAccount = accData ? (parseFloat(accData.cash) || 0) : 0;
        const cashKey = 'money_market';
        if (!accData.cashIsEmergency) { // SKIP Emergency Cash
          currentHoldings[cashKey] = (currentHoldings[cashKey] || 0) + actualCashInAccount;
        }

        Object.values(ASSET_CLASSES).forEach(assetClass => {
          const assetId = assetClass.id;
          const target = targetHoldings[assetId] || 0;
          const current = currentHoldings[assetId] || 0;
          const diff = target - current; // Positive = Buy, Negative = Sell

          if (current > 1 || target > 1) {
            rawActions.push({ assetId, assetName: assetClass.name, current, target, diff });
          }
        });

        const mode = accData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;
        // For Global, the "Portfolio" is the entire investable total
        const processedActions = processActions(rawActions, accTotal, mode, actualCashInAccount, investableTotal);
        accountActions[accId] = { targetHoldings, currentTotal: accTotal, actions: processedActions.sort((a, b) => a.diff - b.diff) };
      });
    }

    return { efAction, accountActions };
  }, [accounts, emergencyFund, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered]);

  // ... (Helper functions remain same)
  const updateAccount = (accId, field, val) => {
    setAccounts(prev => ({
      ...prev,
      [accId]: { ...prev[accId], [field]: val }
    }));
  };

  const updateAccountCash = (accId, val) => {
    setAccounts(prev => ({
      ...prev,
      [accId]: { ...prev[accId], cash: val }
    }));
  };

  const addFund = (accId) => {
    setAccounts(prev => ({
      ...prev,
      [accId]: {
        ...prev[accId],
        funds: [...prev[accId].funds, { id: Date.now(), name: '', type: 'us_broad', value: 0 }]
      }
    }));
  };

  const updateFund = (accId, fundId, field, val) => {
    setAccounts(prev => ({
      ...prev,
      [accId]: {
        ...prev[accId],
        funds: prev[accId].funds.map(f => f.id === fundId ? { ...f, [field]: val } : f)
      }
    }));
  };

  const removeFund = (accId, fundId) => {
    setAccounts(prev => ({
      ...prev,
      [accId]: {
        ...prev[accId],
        funds: prev[accId].funds.filter(f => f.id !== fundId)
      }
    }));
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const updateEquityStrategy = (key, val) => setEquityStrategy(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
  const addEquityAsset = (assetId) => { if (equityStrategy[assetId] !== undefined) return; setEquityStrategy(prev => ({ ...prev, [assetId]: 0 })); setIsAddingAsset(false); };
  const removeEquityAsset = (assetId) => { setEquityStrategy(prev => { const next = { ...prev }; delete next[assetId]; return next; }); };
  const resetEquityStrategy = () => setEquityStrategy(DEFAULT_EQUITY_SPLIT);


  // --- Renderers ---

  const renderDashboard = () => {
    const { currentAllocation, targets, totalNetWorth, investableTotal, emergencyActual, emergencyTarget } = portfolioMetrics;
    const hasAccounts = Object.keys(accounts).length > 0;

    if (!hasAccounts) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-full mb-6">
            <Wallet className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Welcome to Balanced</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">Start by adding your investment accounts to see your portfolio analysis.</p>
          <button
            onClick={() => { setActiveTab('accounts'); setShowAccountModal(true); }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Your First Account
          </button>
        </div>
      );
    }

    const chartDataRaw = Object.keys(ASSET_CLASSES).map(key => {
      const id = ASSET_CLASSES[key].id;
      return {
        name: ASSET_CLASSES[key].name,
        current: currentAllocation[id] || 0,
        target: targets[id] || 0,
        color: ASSET_CLASSES[key].color
      };
    });
    const chartData = chartDataRaw.filter(d => d.current > 1 || d.target > 1);

    const chartTextColor = isDarkMode ? '#a1a1aa' : '#64748b';
    const chartTooltipStyle = {
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      borderColor: isDarkMode ? '#52525b' : '#e5e7eb',
      color: isDarkMode ? '#ffffff' : '#000',
      borderRadius: '8px',
      borderWidth: '1px',
      borderStyle: 'solid'
    };

    const chartTooltipLabelStyle = {
      color: isDarkMode ? '#ffffff' : '#000',
      fontWeight: '500'
    };

    const chartTooltipItemStyle = {
      color: isDarkMode ? '#ffffff' : '#000'
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 flex flex-col justify-center items-center border-l-4 border-l-emerald-500">
            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Net Worth</h3>
            <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(totalNetWorth)}</p>
          </Card>
          <Card className="p-6 flex flex-col justify-center items-center border-l-4 border-l-blue-500">
            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Investable Portfolio</h3>
            <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(investableTotal)}</p>
          </Card>
          <Card className="p-6 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-amber-500">
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col items-center w-full">
                <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500" /> Emergency Reserve</h3>
                <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">{formatCurrency(emergencyActual)}</p>
                <p className="text-xs text-zinc-400 mt-1">Target: {formatCurrency(emergencyTarget)}</p>
              </div>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${emergencyActual >= emergencyTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, (emergencyActual / (emergencyTarget || 1)) * 100)}%` }}
              ></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-emerald-600" /> Allocation Overview</h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="current" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} stroke={isDarkMode ? '#18181b' : '#fff'}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(val) => formatCurrency(val)} contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
                    <Legend formatter={(value) => <span style={{ color: chartTextColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400 text-sm">Add funds to see breakdown</div>
              )}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Current vs Target ($)</h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#27272a' : '#e5e7eb'} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '10px', fill: chartTextColor }} />
                    <RechartsTooltip formatter={(val) => formatCurrency(val)} contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
                    <Bar dataKey="current" name="Current" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="target" name="Target" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400 text-sm">Add funds to see comparison</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderAccounts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Your Accounts</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 hidden sm:inline">Total: {formatCurrency(portfolioMetrics.totalNetWorth)}</span>
          <button
            onClick={() => setShowAccountModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      </div>

      {/* Shield Toggle Legend */}
      {Object.values(accounts).length > 0 && (
        <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">Emergency Fund Shield</h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Use the <Shield className="w-3 h-3 inline mx-0.5" /> shield icon to mark cash or funds as emergency reserves.
                Shielded assets are excluded from rebalancing calculations and count toward your emergency fund target.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Account List */}
      <div className="grid grid-cols-1 gap-6">
        {Object.values(accounts).length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
            <p className="text-zinc-400 mb-4">You haven't added any accounts yet.</p>
            <button
              onClick={() => setShowAccountModal(true)}
              className="text-emerald-600 font-medium hover:underline"
            >
              Create your first account
            </button>
          </div>
        ) : (
          Object.values(accounts).map((accountData) => {
            const typeOption = ACCOUNT_CREATION_OPTIONS.find(o => o.id === accountData.typeId);
            const Icon = typeOption ? typeOption.icon : Wallet;

            const totalAccountValue = (parseFloat(accountData.cash) || 0) + (Array.isArray(accountData.funds) ? accountData.funds.reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0) : 0);

            return (
              <Card key={accountData.id} className="p-0">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-zinc-500 shadow-sm'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{accountData.name}</h3>
                        <span className="text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded uppercase tracking-wide">{accountData.taxType}</span>
                        <div className="flex items-center gap-1 ml-2">
                          <span className="text-xs text-zinc-500">Cash:</span>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                            <input
                              type="number"
                              value={accountData.cash}
                              onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                              onWheel={(e) => e.target.blur()}
                              onChange={(e) => updateAccountCash(accountData.id, e.target.value)}
                              className="w-24 pl-5 pr-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                            />
                          </div>
                          <button
                            onClick={() => updateAccount(accountData.id, 'cashIsEmergency', !accountData.cashIsEmergency)}
                            className={`p-1 rounded transition-colors ${accountData.cashIsEmergency ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-zinc-300 hover:text-zinc-400'}`}
                            title={accountData.cashIsEmergency ? "Cash counts as Emergency Fund" : "Cash counts as Investment"}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500">{typeOption ? typeOption.name : 'Custom Account'} • {formatCurrency(totalAccountValue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPasteModal({ isOpen: true, accountId: accountData.id, text: '', parsed: [] })} className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all" title="Smart Paste Import">
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAccount(accountData.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      aria-label="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {accountData.funds.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-3">No funds added to this account yet.</p>
                      <button
                        onClick={() => addFund(accountData.id)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add First Fund
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="hidden md:grid grid-cols-12 gap-4 px-2 pb-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        <div className="col-span-4">Fund Name</div>
                        <div className="col-span-4">Asset Class</div>
                        <div className="col-span-3">Value ($)</div>
                        <div className="col-span-1"></div>
                      </div>

                      {/* Render Fund Rows */}
                      {accountData.funds.map((fund) => (
                        <FundRow
                          key={fund.id}
                          fund={fund}
                          accountId={accountData.id}
                          updateFund={updateFund}
                          removeFund={removeFund}
                        />
                      ))}

                      <button
                        onClick={() => addFund(accountData.id)}
                        className="w-full py-3 flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg transition-all mt-4"
                      >
                        <Plus className="w-4 h-4" /> Add Another Fund
                      </button>
                    </>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Add New Account</h3>
              <button onClick={() => setShowAccountModal(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fidelity Brokerage"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Type</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {ACCOUNT_CREATION_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setNewAccountType(option.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${newAccountType === option.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                    >
                      <div className={`p-2 rounded-full ${newAccountType === option.id ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        <option.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${newAccountType === option.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{option.name}</div>
                        <div className="text-xs text-zinc-400">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-3">
              <button onClick={() => setShowAccountModal(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">Cancel</button>
              <button onClick={createAccount} disabled={!newAccountName.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfigure = () => {
    const numericAge = parseInt(userAge) || 0;
    const totalEquityAllocation = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
    const isEquityValid = Math.abs(totalEquityAllocation - 100) < 0.1;
    const bondStrategies = [
      { id: 'smart', name: 'Target Date (Smart)', value: getSuggestedBondAllocation(numericAge), desc: 'Non-linear glide path based on retirement age.' },
      { id: 'aggressive', name: 'Aggressive (Age - 20)', value: Math.max(0, numericAge - 20), desc: 'Focuses on maximum growth.' },
      { id: 'moderate', name: 'Moderate (Age - 10)', value: Math.max(0, numericAge - 10), desc: 'Standard rule of thumb.' },
      { id: 'conservative', name: 'Conservative (Age Match)', value: Math.min(100, numericAge), desc: 'Lower risk, preserves capital.' },
    ];
    const activeStrategy = bondStrategyMode === 'custom' ? 'manual' : bondStrategyMode;
    const availableAssets = Object.values(ASSET_CLASSES).filter(a => a.id !== 'cash' && a.id !== 'bonds' && equityStrategy[a.id] === undefined);
    const isCustomMode = bondStrategyMode === 'custom';

    return (
      <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-6 h-6 text-zinc-400" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Portfolio Configuration</h2>
        </div>

        {/* EMERGENCY FUND CONFIGURATION - MOVED TO TOP */}
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"><Shield className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Emergency Fund Target</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Set aside cash before investing. This target is separate from your portfolio.</p></div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-zinc-500">$</span></div>
              <input
                type="number"
                min="0"
                value={emergencyFund}
                onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                onChange={(e) => {
                  const val = e.target.value;
                  setEmergencyFund(val === '' ? '' : parseInt(val));
                }}
                onWheel={(e) => e.target.blur()}
                className="block w-full pl-7 pr-12 py-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Funds in accounts marked as "Emergency Fund" will count towards this goal.</p>
          </div>
        </Card>

        {/* TAX STRATEGY SELECTOR */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><LayoutDashboard className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Asset Location Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Control how assets are distributed across your taxable and tax-advantaged accounts.</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(TAX_STRATEGIES).map(strategy => (
              <button
                key={strategy.id}
                onClick={() => setTaxStrategy(strategy.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${taxStrategy === strategy.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-zinc-900'}`}
              >
                {taxStrategy === strategy.id && <div className="absolute top-3 right-3 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-md ${taxStrategy === strategy.id ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                    <strategy.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`font-bold mb-1 ${taxStrategy === strategy.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{strategy.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{strategy.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* BOND ALLOCATION */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Calendar className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Macro Allocation (Bonds vs. Stocks)</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Determine your risk tolerance based on your age and timeline.</p></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => {
                if (isCustomMode) {
                  setBondStrategyMode('smart');
                  setBondAllocation(getSuggestedBondAllocation(parseInt(userAge) || 0));
                }
              }}
              className={`p-4 rounded-xl border-2 text-center transition-all relative overflow-hidden ${!isCustomMode ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-zinc-900'}`}
            >
              {!isCustomMode && <div className="absolute top-2 right-2 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>}
              <div className="flex justify-center mb-2"><Activity className={`w-6 h-6 ${!isCustomMode ? 'text-emerald-600' : 'text-zinc-400'}`} /></div>
              <div className={`font-bold ${!isCustomMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>Strategy Based</div>
              <div className="text-xs text-zinc-500 mt-1">Adjusts automatically with age</div>
            </button>

            <button
              onClick={() => setBondStrategyMode('custom')}
              className={`p-4 rounded-xl border-2 text-center transition-all relative overflow-hidden ${isCustomMode ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-zinc-900'}`}
            >
              {isCustomMode && <div className="absolute top-2 right-2 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>}
              <div className="flex justify-center mb-2"><Lock className={`w-6 h-6 ${isCustomMode ? 'text-emerald-600' : 'text-zinc-400'}`} /></div>
              <div className={`font-bold ${isCustomMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>Fixed Allocation</div>
              <div className="text-xs text-zinc-500 mt-1">Set a specific percentage</div>
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-zinc-900 p-2 rounded-full border border-zinc-200 dark:border-zinc-700"><Target className="w-5 h-5 text-emerald-600" /></div>
                  <div><h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Current Bond Allocation</h4><p className="text-xs text-zinc-500 dark:text-zinc-400">Lower % = Higher Risk / Higher % = Lower Risk</p></div>
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{bondAllocation}%</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Age</label>
                  <input type="number" min="18" max="100" value={userAge} onChange={(e) => { const val = parseInt(e.target.value); setUserAge(isNaN(val) ? '' : val); }} className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">Your age is used to calculate the heuristic strategies on the right.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Allocation Strategies</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bondStrategies.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setBondStrategyMode(s.id); setBondAllocation(s.value); }}
                        className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden ${bondStrategyMode === s.id ? 'bg-emerald-5 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                      >
                        <div className="flex justify-between items-center mb-1"><span className={`text-xs font-bold ${bondStrategyMode === s.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{s.name}</span><span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">{s.value}%</span></div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in">
              <div className="flex flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-10 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center">
                <div>
                  <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Fixed Allocation</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">Enter a fixed percentage for your bond allocation. This number will remain static regardless of your age.</p>
                </div>
                <div className="relative w-48">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={bondAllocation}
                    onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setBondAllocation('');
                        return;
                      }
                      let intVal = parseInt(val);
                      if (isNaN(intVal)) intVal = 0;
                      if (intVal > 100) intVal = 100;
                      setBondAllocation(intVal);
                    }}
                    className="block w-full pl-4 pr-12 py-4 text-3xl font-bold text-center border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none"><span className="text-zinc-400 text-xl font-medium">%</span></div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 overflow-visible">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><PieChartIcon className="w-5 h-5" /></div>
              <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Equity Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Customize your stock portfolio breakdown.</p></div>
            </div>
            <button onClick={resetEquityStrategy} title="Reset to Default" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Undo2 className="w-4 h-4" /></button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Popular Strategies</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {EQUITY_PRESETS.map(preset => {
                const isMatch = Object.keys(preset.allocation).length === Object.keys(equityStrategy).length && Object.keys(preset.allocation).every(key => equityStrategy[key] === preset.allocation[key]);
                return (
                  <button key={preset.name} onClick={() => setEquityStrategy(preset.allocation)} className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden ${isMatch ? 'bg-emerald-5 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'}`}>
                    <div className="font-bold text-xs text-zinc-800 dark:text-zinc-100 mb-1">{preset.name}</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden flex relative mt-6">
            {Object.entries(equityStrategy).map(([key, val]) => {
              const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
              if (!asset || val <= 0) return null;
              return (<div key={key} style={{ width: `${(val / totalEquityAllocation) * 100}%`, backgroundColor: asset.color }} className="h-full transition-all duration-500" />);
            })}
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Total Allocation</div>
            <div className={`flex items-center gap-2 ${isEquityValid ? 'text-emerald-600' : 'text-red-500'}`}>
              {!isEquityValid && <AlertTriangle className="w-4 h-4" />}
              <span className="font-bold font-mono">{totalEquityAllocation}%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(equityStrategy).map(([key, val]) => {
              const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
              if (!asset) return null;
              return (
                <div key={key} className="relative group animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>{asset.name}</label>
                    <button onClick={() => removeEquityAsset(key)} className="text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Asset Class"><X className="w-3 h-3" /></button>
                  </div>
                  <div className="relative">
                    <input type="number" value={val} onFocus={(e) => { if (!e.target.value || e.target.value === '0') e.target.select(); }} onWheel={(e) => e.target.blur()} onChange={(e) => updateEquityStrategy(key, e.target.value)} className={`block w-full pl-3 pr-8 py-2 border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-md outline-none focus:ring-1 ${isEquityValid ? 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500' : 'border-red-300 focus:border-red-500 focus:ring-red-500'}`} />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Percent className="w-3 h-3 text-zinc-400" /></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 relative">
            <button
              onClick={() => setIsAddingAsset(!isAddingAsset)}
              className="w-full flex justify-center items-center gap-2 text-sm font-medium text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-2 rounded-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Asset Class
            </button>

            {isAddingAsset && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAddingAsset(false)}></div>
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-md shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">Available Assets</div>
                  {availableAssets.length > 0 ? availableAssets.map(asset => (
                    <button key={asset.id} onClick={() => { addEquityAsset(asset.id); setIsAddingAsset(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>{asset.name}</button>
                  )) : (<div className="px-4 py-4 text-sm text-zinc-500 text-center italic">All available asset classes have been added.</div>)}
                </div>
              </>
            )}
          </div>
          {!isEquityValid && (<p className="text-xs text-red-500 mt-4 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">Total equity allocation must equal 100%. Please adjust your values.</p>)}
        </Card>
      </div>
    );
  };

  const renderPasteModal = () => {
    if (!pasteModal.isOpen) return null;

    const handleTextChange = (e) => {
      const text = e.target.value;
      const parsed = parsePasteData(text);
      setPasteModal(prev => ({ ...prev, text, parsed }));
    };

    const handleFileUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsed = parsePasteData(text);
        setPasteModal(prev => ({ ...prev, text, parsed }));
      };
      reader.readAsText(file);
      e.target.value = null; // Reset input
    };

    const handleTypeChange = (idx, newType) => {
      const newParsed = [...pasteModal.parsed];
      newParsed[idx].type = newType;
      setPasteModal(prev => ({ ...prev, parsed: newParsed }));
    };

    const handleSave = () => {
      if (pasteModal.parsed.length === 0) return;

      setAccounts(prev => {
        const acc = prev[pasteModal.accountId];
        const newFunds = [...(acc.funds || [])];

        pasteModal.parsed.forEach(item => {
          // Check if fund already exists to update it, or add new
          const existingIdx = newFunds.findIndex(f => f.name === item.name);
          if (existingIdx >= 0) {
            newFunds[existingIdx].value = item.value;
            newFunds[existingIdx].type = item.type;
          } else {
            newFunds.push({ id: Date.now() + Math.random(), name: item.name, value: item.value, type: item.type });
          }
        });

        return { ...prev, [pasteModal.accountId]: { ...acc, funds: newFunds } };
      });

      setPasteModal({ isOpen: false, accountId: null, text: '', parsed: [] });
      setNotification({ message: 'Imported successfully!', type: 'success' });
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Smart Paste Import</h3>
            <button onClick={() => setPasteModal({ isOpen: false, accountId: null, text: '', parsed: [] })} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Upload CSV or Paste Data</label>

              {/* File Upload Button */}
              <div className="mb-3">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4" /> Upload CSV File
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">or paste manually</span>
                </div>
              </div>

              <textarea
                className="w-full h-32 p-3 text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={`Ticker   Value\nVTI      15000\nVXUS     5000`}
                value={pasteModal.text}
                onChange={handleTextChange}
              />
              <p className="text-xs text-zinc-500 mt-2">Copy two columns (Name/Ticker and Value) and paste them here.</p>
            </div>

            {pasteModal.parsed.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-3">Preview ({pasteModal.parsed.length} items)</h4>
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Value</th>
                        <th className="px-4 py-2">Asset Class</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {pasteModal.parsed.map((row, idx) => (
                        <tr key={idx} className="bg-white dark:bg-zinc-900">
                          <td className="px-4 py-2 font-medium">{row.name}</td>
                          <td className="px-4 py-2">${row.value.toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <select
                              value={row.type}
                              onChange={(e) => handleTypeChange(idx, e.target.value)}
                              className="w-full bg-transparent border-none outline-none text-zinc-700 dark:text-zinc-300 cursor-pointer"
                            >
                              {Object.values(ASSET_CLASSES).map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <button onClick={() => setPasteModal({ isOpen: false, accountId: null, text: '', parsed: [] })} className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
            <button
              onClick={handleSave}
              disabled={pasteModal.parsed.length === 0}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {pasteModal.parsed.length} Items
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWelcomeModal = () => {
    if (!showWelcome) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Welcome to Balanced!</h2>
              <p className="text-zinc-600 dark:text-zinc-400">A tax-efficient portfolio rebalancing tool for serious investors.</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={handleLoadDemoFromWelcome}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all shadow-sm hover:shadow-md"
              >
                <MousePointerClick className="w-4 h-4" /> Load Demo Data
              </button>
              <button
                onClick={startTour}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all"
              >
                <Activity className="w-4 h-4" /> Take a Tour
              </button>
              <button
                onClick={dismissWelcome}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                Start Fresh
              </button>
            </div>

            <p className="text-xs text-center text-zinc-500 dark:text-zinc-500">This message won't appear again.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderProductTour = () => {
    if (!tourActive) return null;

    const currentStep = TOUR_STEPS[tourStep];
    const isLastStep = tourStep === TOUR_STEPS.length - 1;

    // Get target element for spotlight
    let targetElement = null;
    if (currentStep.target === 'dashboard') {
      targetElement = document.querySelector('main');
    } else if (currentStep.target === 'accounts') {
      targetElement = document.querySelector('[data-tour="accounts"]');
    } else if (currentStep.target === 'configure') {
      targetElement = document.querySelector('[data-tour="strategy"]');
    } else if (currentStep.target === 'rebalance') {
      targetElement = document.querySelector('[data-tour="balance"]');
    } else if (currentStep.target === 'settings') {
      targetElement = document.querySelector('[data-tour="settings"]');
    }

    let spotlightStyle = {};
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      spotlightStyle = {
        position: 'fixed',
        top: `${rect.top - 8}px`,
        left: `${rect.left - 8}px`,
        width: `${rect.width + 16}px`,
        height: `${rect.height + 16}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)', // Reduced from 0.7 to 0.5 for less blur
        borderRadius: '12px',
        border: '3px solid rgb(16, 185, 129)', // Emerald border to highlight
        pointerEvents: 'none',
        zIndex: 45,
        transition: 'all 300ms ease-in-out'
      };
    }

    return (
      <>
        {/* Dark overlay with spotlight cutout */}
        {targetElement && <div style={spotlightStyle} className="animate-in fade-in duration-300" />}
        {!targetElement && <div className="fixed inset-0 z-40 bg-black/50" />}

        {/* Tour tooltip - always centered for simplicity */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    Step {tourStep + 1} of {TOUR_STEPS.length}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{currentStep.title}</h3>
                </div>
                <button onClick={endTour} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 mb-6">{currentStep.description}</p>

              {isLastStep && (
                <>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => { endTour(); loadDemoData(); }}
                      className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all"
                    >
                      Load Demo Data
                    </button>
                    <button
                      onClick={endTour}
                      className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                    >
                      Start Fresh
                    </button>
                  </div>

                  <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg mb-4">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                      Balanced is free and privacy-focused. No data ever leaves your device.
                    </p>
                    <a
                      href="https://buymeacoffee.com/balanced"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Coffee className="w-3 h-3" />
                      Support development
                    </a>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={prevTourStep}
                  disabled={tourStep === 0}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {TOUR_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${idx === tourStep ? 'bg-emerald-500 w-6' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                    />
                  ))}
                </div>

                {!isLastStep ? (
                  <button
                    onClick={nextTourStep}
                    className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={endTour}
                    className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSettings = () => {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-6 h-6 text-zinc-400" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Application Settings</h2>
        </div>

        {/* DATA MANAGEMENT */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Save className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Data Management</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Export your portfolio data or restore from a backup.</p></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
            >
              <Download className="w-4 h-4" /> Export Backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
            >
              <Upload className="w-4 h-4" /> Import Backup
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportData}
              className="hidden"
              accept=".json"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={loadDemoData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 transition-all"
            >
              <MousePointerClick className="w-4 h-4" /> Load Demo Data
            </button>
          </div>
        </Card>

        {/* TOUR LAUNCHER */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"><Activity className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Product Tour</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Learn how to use Balanced with a guided walkthrough.</p></div>
          </div>
          <button
            onClick={startTour}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all"
          >
            <Activity className="w-4 h-4" /> Take a Tour
          </button>
        </Card>

        {/* SUPPORT DEVELOPMENT */}
        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"><Heart className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Support Development</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Balanced is free and open-source. Help keep it that way!</p></div>
          </div>
          <a
            href="https://buymeacoffee.com/balanced"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-medium transition-all shadow-sm"
          >
            <Coffee className="w-4 h-4" /> Buy Me a Coffee
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">Your support helps maintain and improve Balanced for everyone</p>
        </Card>

        {/* DANGER ZONE */}
        <Card className="p-6 border-red-200 dark:border-red-900/30">
          <div className="flex items-center gap-3 mb-6 border-b border-red-100 dark:border-red-900/30 pb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><AlertCircle className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-red-800 dark:text-red-100">Danger Zone</h3><p className="text-xs text-red-600 dark:text-red-400">Irreversible actions that will delete your data.</p></div>
          </div>
          <button
            onClick={resetAllData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-300 dark:border-red-800 hover:bg-red-500 hover:border-red-500 hover:text-white text-red-600 dark:text-red-400 font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" /> Reset All Data
          </button>
        </Card>
      </div>
    );
  };

  const renderRebalance = () => {
    const hasAccounts = Object.keys(accounts).length > 0;

    // Rebalance Settings Panel
    const renderStrategyPanel = () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Taxable Strategy */}
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Wallet className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Brokerage Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Rebalancing rules for taxable accounts.</p></div>
          </div>
          <div className="space-y-2">
            {Object.values(REBALANCE_MODES).map(mode => (
              <button
                key={`taxable-${mode.id}`}
                onClick={() => setRebalanceModeTaxable(mode.id)}
                className={`w-full relative p-3 rounded-lg border text-left transition-all ${rebalanceModeTaxable === mode.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300'}`}
              >
                {rebalanceModeTaxable === mode.id && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle2 className="w-4 h-4" /></div>}
                <div className="flex items-center gap-2 mb-1">
                  <mode.icon className={`w-4 h-4 ${rebalanceModeTaxable === mode.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`} />
                  <span className={`text-sm font-bold ${rebalanceModeTaxable === mode.id ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'}`}>{mode.name}</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight pr-6">{mode.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Tax Advantaged Strategy */}
        <Card className="p-6 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><ShieldCheck className="w-5 h-5" /></div>
            <div><h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Retirement Strategy</h3><p className="text-xs text-zinc-500 dark:text-zinc-400">Rebalancing rules for IRAs and 401ks.</p></div>
          </div>
          <div className="space-y-2">
            {Object.values(REBALANCE_MODES).map(mode => (
              <button
                key={`sheltered-${mode.id}`}
                onClick={() => setRebalanceModeSheltered(mode.id)}
                className={`w-full relative p-3 rounded-lg border text-left transition-all ${rebalanceModeSheltered === mode.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300'}`}
              >
                {rebalanceModeSheltered === mode.id && <div className="absolute top-2 right-2 text-indigo-600"><CheckCircle2 className="w-4 h-4" /></div>}
                <div className="flex items-center gap-2 mb-1">
                  <mode.icon className={`w-4 h-4 ${rebalanceModeSheltered === mode.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                  <span className={`text-sm font-bold ${rebalanceModeSheltered === mode.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'}`}>{mode.name}</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight pr-6">{mode.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );

    if (!hasAccounts) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
            <Scale className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">No Rebalancing Needed</h3>
          <p className="text-zinc-500 max-w-md mt-2">Please add accounts and funds to see your action plan.</p>
          <button onClick={() => setActiveTab('accounts')} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Go to Accounts</button>
        </div>
      );
    }

    const { efAction, accountActions } = rebalancingPlan;
    const hasActions = Object.values(accountActions).some(p => p.actions.length > 0);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Rebalance Configuration */}
        {renderStrategyPanel()}

        {/* Individual Stocks Notice */}
        {Object.values(accounts).some(acc => acc.funds?.some(f => f.type === 'individual_stock')) && (
          <Card className="p-4 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">Individual Stocks Detected</h4>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Individual stocks are rebalanced by total value only. Tax-efficient location strategies apply to index funds only.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* EMERGENCY FUND STATUS SECTION */}
        {efAction && (
          <Card className={`p-6 border-l-4 ${efAction.status === 'surplus' ? 'border-l-emerald-500' : (efAction.status === 'deficit' ? 'border-l-red-500' : 'border-l-zinc-400')}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-zinc-500" /> Emergency Fund Action
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {efAction.status === 'balanced' && "Your emergency reserves are on target."}
                  {efAction.status === 'deficit' && "Your emergency fund is below target."}
                  {efAction.status === 'surplus' && "You have excess cash in your emergency fund."}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${efAction.status === 'deficit' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {efAction.status === 'balanced' ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : formatCurrency(efAction.diff)}
                </div>
                {efAction.status !== 'balanced' && (
                  <div className="text-xs font-bold uppercase tracking-wider mt-1">
                    {efAction.status === 'deficit' ? 'DEPOSIT NEEDED' : 'INVESTABLE SURPLUS'}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          {Object.entries(accountActions).map(([accId, plan]) => {
            // if (plan.actions.length === 0) return null; // Show all accounts
            const accountData = accounts[accId];
            const typeOption = ACCOUNT_CREATION_OPTIONS.find(o => o.id === accountData?.typeId);
            const Icon = typeOption ? typeOption.icon : Wallet;

            const activeMode = accountData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;

            return (
              <Card key={accId} className="overflow-visible">
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
                      <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{accountData.name}</h3>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">{accountData.taxType}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded font-medium text-zinc-600 dark:text-zinc-300">
                    Mode: {REBALANCE_MODES[activeMode.toUpperCase()]?.name || activeMode}
                  </div>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {plan.actions.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                      <p className="text-sm">No actions needed. This account is balanced.</p>
                    </div>
                  ) : (
                    plan.actions.map((action, idx) => {
                      const isBuy = action.diff > 0;

                      return (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBuy ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                              }`}>
                              {isBuy ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${isBuy ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                                  }`}>
                                  {action.action}
                                </span>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">{action.assetName}</span>
                              </div>
                              <div className="text-xs text-zinc-400 mt-1 pl-1">
                                Current: {formatCurrency(action.current)} &rarr; Target: {formatCurrency(action.target)}
                                {action.explanation && <span className="ml-2 text-zinc-500 italic">• {action.explanation}</span>}
                              </div>
                            </div>
                          </div>
                          <div className={`text-lg font-mono font-semibold ${isBuy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                            {(isBuy ? '+' : '') + formatCurrency(action.diff)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            );
          })}
          {!hasActions && (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Portfolio Balanced</h3>
              <p className="text-zinc-500 max-w-md mx-auto px-4">Your investment portfolio is within target ranges. No actions needed.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-200 font-sans">
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-500/30"><PieChartIcon className="w-5 h-5" /></div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Balanced</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-zinc-400 hidden sm:block font-medium">Tax-Efficient Portfolio Manager</div>
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex space-x-1 bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8 w-full sm:w-auto inline-flex overflow-x-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'accounts', icon: Wallet, label: 'My Accounts' },
            { id: 'configure', icon: SlidersHorizontal, label: 'Configure' },
            { id: 'rebalance', icon: Scale, label: 'Balance' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'accounts' && <div data-tour="accounts">{renderAccounts()}</div>}
          {activeTab === 'configure' && <div data-tour="strategy" className="overflow-visible">{renderConfigure()}</div>}
          {activeTab === 'rebalance' && <div data-tour="balance">{renderRebalance()}</div>}
          {activeTab === 'settings' && <div data-tour="settings">{renderSettings()}</div>}
        </div>

        {renderPasteModal()}
        {renderWelcomeModal()}
        {renderProductTour()}

        {/* Global Notification */}
        {notification.message && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-2 ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'}`}>
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{confirmModal.title}</h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{confirmModal.message}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="max-w-5xl mx-auto px-4 py-8 border-t border-zinc-200 dark:border-zinc-800 mt-12">
          <div className="flex flex-col items-center gap-6">

            {/* Main Footer Links */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About & Methodology</a>
              <a href="https://github.com/SeidelmanSea/Balanced-App" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">GitHub</a>
              <a href="https://buymeacoffee.com/balanced" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <span>Support Development</span>
                <span className="text-xs">☕</span>
              </a>
            </div>

            {/* Risk Disclosure & Copyright */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-600">
                <span className="font-semibold uppercase tracking-wider opacity-80 block mb-1">Risk Disclosure</span>
                This application is for informational and educational purposes only and does not constitute financial advice. All investing involves risk. Past performance is not indicative of future results.
              </p>
            </div>

          </div>
        </footer>
      </main>
    </div>
  );
}
