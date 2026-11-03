import { useState, useEffect, useMemo, useRef } from 'react';
import { ASSET_CLASSES, ACCOUNT_CREATION_OPTIONS, DEMO_DATA, DEFAULT_EQUITY_SPLIT, TOUR_STEPS } from '../utils/constants';
import { detectStrategy } from '../utils/finance';
import { parseCSV, parsePasteData } from '../utils/parsers';

export function usePortfolio() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [bondAllocation, setBondAllocation] = useState(10);
    const [cashAllocation, setCashAllocation] = useState(0);
    const [emergencyFund, setEmergencyFund] = useState(10000);
    const [userAge, setUserAge] = useState(38);
    const [retirementYear, setRetirementYear] = useState(() => new Date().getFullYear() + 27);
    const [bondStrategyMode, setBondStrategyMode] = useState('smart');
    const [equityStrategy, setEquityStrategy] = useState(DEFAULT_EQUITY_SPLIT);
    const [isAddingAsset, setIsAddingAsset] = useState(false);
    const [taxStrategy, setTaxStrategy] = useState('standard');
    const [hsaStrategy, setHsaStrategy] = useState('roth');

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

    // Calculate effective age from retirement year
    const currentYear = new Date().getFullYear();
    const yearsToRetirement = retirementYear - currentYear;
    const effectiveAge = 65 - yearsToRetirement;

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
                if (parsed.retirementYear !== undefined) {
                    setRetirementYear(parsed.retirementYear);
                    setUserAge(65 - (parsed.retirementYear - new Date().getFullYear()));
                } else if (parsed.userAge !== undefined) {
                    setUserAge(parsed.userAge);
                    setRetirementYear(new Date().getFullYear() + (65 - parsed.userAge));
                }
                if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
                if (parsed.equityStrategy !== undefined) setEquityStrategy(parsed.equityStrategy);
                if (parsed.cashAllocation !== undefined) setCashAllocation(parsed.cashAllocation);
                if (parsed.taxStrategy) setTaxStrategy(parsed.taxStrategy);
                if (parsed.hsaStrategy !== undefined) setHsaStrategy(parsed.hsaStrategy);

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
                accounts, bondAllocation, cashAllocation, emergencyFund, userAge, retirementYear, isDarkMode, equityStrategy, bondStrategyMode, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered, hsaStrategy
            }));
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [accounts, bondAllocation, cashAllocation, emergencyFund, userAge, retirementYear, isDarkMode, equityStrategy, bondStrategyMode, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered, hsaStrategy]);


    const createAccount = (nameArg, typeArg) => {
        const nameToUse = nameArg !== undefined ? nameArg : newAccountName;
        const typeToUse = typeArg !== undefined ? typeArg : newAccountType;

        if (!nameToUse.trim()) return;

        const accountTypeInfo = ACCOUNT_CREATION_OPTIONS.find(o => o.id === typeToUse);

        if (!accountTypeInfo) {
            console.error(`Invalid account type selected: ${typeToUse}`);
            setNotification({ message: `Error: Invalid account type selected: "${typeToUse}"`, type: 'error' });
            return;
        }

        const newId = `acc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const isEmergencyAccount = typeToUse === 'emergency_fund';

        setAccounts(prev => ({
            ...prev,
            [newId]: {
                id: newId,
                name: nameToUse,
                typeId: typeToUse,
                taxType: accountTypeInfo.taxType,
                iconId: typeToUse,
                cash: 0,
                cashIsEmergency: isEmergencyAccount,
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
            cashAllocation,
            emergencyFund,
            userAge,
            retirementYear,
            bondStrategyMode,
            equityStrategy,
            taxStrategy,
            hsaStrategy,
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
                            setBondAllocation(importedData.bondAllocation !== undefined ? importedData.bondAllocation : 10);
                            setCashAllocation(importedData.cashAllocation !== undefined ? importedData.cashAllocation : 0);
                            setEmergencyFund(importedData.emergencyFund !== undefined ? importedData.emergencyFund : 10000);

                            if (importedData.retirementYear !== undefined) {
                                setRetirementYear(importedData.retirementYear);
                                setUserAge(65 - (importedData.retirementYear - currentYear));
                            } else if (importedData.userAge !== undefined) {
                                setUserAge(importedData.userAge);
                                setRetirementYear(currentYear + (65 - importedData.userAge));
                            } else {
                                setUserAge(38);
                                setRetirementYear(currentYear + 27);
                            }

                            setBondStrategyMode(importedData.bondStrategyMode || 'smart');
                            setEquityStrategy(importedData.equityStrategy || DEFAULT_EQUITY_SPLIT);
                            setTaxStrategy(importedData.taxStrategy || 'standard');
                            if (importedData.hsaStrategy !== undefined) setHsaStrategy(importedData.hsaStrategy);
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
    };

    const resetAllData = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Reset All Data',
            message: 'This will permanently delete all your accounts, settings, and portfolio data. This action cannot be undone. Are you sure?',
            onConfirm: () => {
                setAccounts({});
                setBondAllocation(10);
                setCashAllocation(0);
                setEmergencyFund(10000);
                setUserAge(38);
                setRetirementYear(new Date().getFullYear() + 27);
                setBondStrategyMode('smart');
                setEquityStrategy(DEFAULT_EQUITY_SPLIT);
                setTaxStrategy('standard');
                setHsaStrategy('roth');
                setRebalanceModeTaxable('bands');
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
                setCashAllocation(DEMO_DATA.cashAllocation || 0);
                setEmergencyFund(DEMO_DATA.emergencyFund);
                setUserAge(DEMO_DATA.userAge);
                setRetirementYear(new Date().getFullYear() + (65 - DEMO_DATA.userAge));
                setBondStrategyMode(DEMO_DATA.bondStrategyMode);
                setEquityStrategy(DEMO_DATA.equityStrategy);
                setTaxStrategy(DEMO_DATA.taxStrategy);
                setHsaStrategy('roth');
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
        setActiveTab('dashboard');
        localStorage.setItem('balanced_has_visited', 'true');
    };

    const nextTourStep = () => {
        if (tourStep < TOUR_STEPS.length - 1) {
            const nextStep = tourStep + 1;
            setTourStep(nextStep);
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
        let autoEmergencyFund = 0;
        let emergencyCashRaw = 0;
        const currentAllocation = {};
        const accountTotals = {};
        const accountEmergencyMap = {};

        Object.keys(ASSET_CLASSES).forEach(key => currentAllocation[ASSET_CLASSES[key].id] = 0);

        Object.values(accounts).forEach((accData) => {
            if (!accData) return;

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

            const isCashShielded = Boolean(accData.cashIsEmergency || accData.isEmergencyFund);
            let accEmergencyRaw = 0;
            let accEmergencyCashRaw = 0;

            if (isCashShielded) {
                autoEmergencyFund += effectiveCash;
                emergencyCashRaw += effectiveCash;
                accEmergencyRaw += effectiveCash;
                accEmergencyCashRaw += effectiveCash;
            } else {
                investableTotal += effectiveCash;
                // Unified Cash: All cash goes to 'cash' key
                currentAllocation['cash'] = (currentAllocation['cash'] || 0) + effectiveCash;
            }

            if (Array.isArray(accData.funds)) {
                accData.funds.forEach(fund => {
                    const val = parseFloat(fund.value) || 0;
                    const isFundShielded = Boolean(fund.isEmergency || accData.isEmergencyFund);

                    if (isFundShielded) {
                        autoEmergencyFund += val;
                        accEmergencyRaw += val;
                        if (fund.type === 'money_market' || fund.type === 'cash') {
                            emergencyCashRaw += val;
                            accEmergencyCashRaw += val;
                        }
                    } else {
                        investableTotal += val;
                        // Unified Cash: Money market funds are added to 'cash' key
                        let type = fund.type || 'us_broad';
                        if (type === 'money_market') {
                            currentAllocation['cash'] += val;
                        } else if (currentAllocation[type] !== undefined) {
                            currentAllocation[type] += val;
                        }
                    }
                });
            }

            accountEmergencyMap[accData.id] = {
                raw: accEmergencyRaw,
                cashRaw: accEmergencyCashRaw,
                effective: accEmergencyRaw,
                spilloverCash: 0
            };
        });

        const emergencyTarget = parseFloat(emergencyFund) || 0;
        const emergencyActual = autoEmergencyFund;
        // Spillover: only shielded CASH / MONEY MARKET above emergencyTarget spills over into investableTotal.
        // Shielded equity/bond funds remain excluded from investableTotal.
        const emergencySurplus = Math.max(0, Math.min(emergencyCashRaw, emergencyActual - emergencyTarget));

        if (emergencySurplus > 0 && emergencyCashRaw > 0) {
            currentAllocation['cash'] = (currentAllocation['cash'] || 0) + emergencySurplus;
            Object.keys(accountEmergencyMap).forEach(accId => {
                const entry = accountEmergencyMap[accId];
                const share = (entry.cashRaw / emergencyCashRaw) * emergencySurplus;
                entry.spilloverCash = share;
                entry.effective = Math.max(0, entry.raw - share);
            });
        }

        const effectiveInvestableTotal = investableTotal + emergencySurplus;

        const targets = {};
        const cashKey = 'cash';
        const bondKey = 'bonds';

        // Three-part macro allocation: Bonds + Cash & Equivalents + Equity = 100%
        const cashEquivPct = Math.max(0, Math.min(100, cashAllocation || 0));
        const bondPct = Math.max(0, Math.min(100, bondAllocation || 0));
        const equityPct = Math.max(0, 100 - bondPct - cashEquivPct);

        // Unified Cash Target: Single target for 'cash' representing all equivalents
        targets[cashKey] = effectiveInvestableTotal * (cashEquivPct / 100);
        targets[bondKey] = effectiveInvestableTotal * (bondPct / 100);

        const equityTotalValue = effectiveInvestableTotal * (equityPct / 100);

        const totalStrat = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
        const safeTotal = totalStrat > 0 ? totalStrat : 100;
        Object.entries(equityStrategy).forEach(([assetId, weight]) => {
            targets[assetId] = equityTotalValue * (weight / safeTotal);
        });

        return {
            totalNetWorth,
            investableTotal: effectiveInvestableTotal,
            emergencyTarget,
            emergencyActual,
            emergencySurplus,
            currentAllocation,
            accountTotals,
            accountEmergencyMap,
            targets
        };
    }, [accounts, bondAllocation, cashAllocation, emergencyFund, equityStrategy]);

    const rebalancingPlan = useMemo(() => {
        const { investableTotal, targets, accountTotals, accountEmergencyMap, emergencyActual, emergencyTarget, currentAllocation } = portfolioMetrics;

        const efDiff = emergencyActual - emergencyTarget;
        const efAction = {
            status: Math.abs(efDiff) < 100 ? 'balanced' : (efDiff > 0 ? 'surplus' : 'deficit'),
            diff: Math.abs(efDiff),
            current: emergencyActual,
            target: emergencyTarget
        };

        if (investableTotal === 0) return { efAction, accountActions: {} };

        const accountActions = {};
        const investmentAccounts = Object.values(accounts).filter(a => !a.isEmergencyFund);

        // --- Fix 2: Compute bandsTriggered ONCE at the portfolio level ---
        // We use portfolio-wide currentAllocation vs targets so that tax-location
        // decisions (bonds in one account, equities in another) don't falsely
        // trigger rebalancing on a per-account basis.
        // Exclude 'cash' and 'money_market' from triggering full sell-to-rebalance bands
        // so that uninvested cash / dividends deploy cleanly via inflow fallback instead of causing taxable sales.
        const allAssetIds = new Set([
            ...Object.keys(targets),
            ...Object.keys(currentAllocation).filter(k => currentAllocation[k] > 0)
        ]);

        const globalBandsTriggered = Array.from(allAssetIds).some(assetId => {
            if (assetId === 'cash' || assetId === 'money_market') return false;
            const target = targets[assetId] || 0;
            const current = currentAllocation[assetId] || 0;
            const targetPct = investableTotal > 0 ? (target / investableTotal) * 100 : 0;
            const currentPct = investableTotal > 0 ? (current / investableTotal) * 100 : 0;
            
            // 5/25 rule: 5% absolute or 25% relative (whichever is tighter)
            // Added a 0.5% absolute floor to prevent dust/pennies in 0% target assets from triggering rebalances
            const theoreticalThreshold = targetPct >= 20 ? 5 : targetPct * 0.25;
            const threshold = Math.max(0.5, theoreticalThreshold);
            
            return Math.abs(currentPct - targetPct) > threshold;
        });

        const processActions = (rawActions, accTotal, mode, availableCash, portfolioTotal) => {
            let inflowRatio = 1;
            const totalBuyNeeded = rawActions.reduce((sum, a) => (a.diff > 0 && a.assetId !== 'cash' && a.assetId !== 'money_market') ? sum + a.diff : sum, 0);
            if (totalBuyNeeded > availableCash && totalBuyNeeded > 0) {
                inflowRatio = Math.max(0, availableCash) / totalBuyNeeded;
            }

            return rawActions.map(action => {
                let { diff, current, target, assetId } = action;

                let actionLabel = diff > 0 ? 'BUY' : 'SELL';
                if (assetId === 'cash' || assetId === 'money_market') actionLabel = diff > 0 ? 'RAISE CASH' : 'INVEST CASH';
                let finalAction = actionLabel;
                let explanation = '';

                if (mode === 'strict') {
                    if (Math.abs(diff) < 10) finalAction = 'HOLD';
                }

                if (mode === 'bands') {
                    if (!globalBandsTriggered) {
                        // Drift bands not breached. However, if there is significant uninvested cash (>$10)
                        // we should gracefully fall back to inflow-only mode so the user knows where
                        // to deploy it, without triggering any unnecessary tax-generating sales.
                        if (availableCash > 10) {
                            if (diff < 0 && assetId !== 'cash' && assetId !== 'money_market') {
                                finalAction = 'HOLD'; // Don't sell equities
                            } else if (diff > 0 && assetId !== 'cash' && assetId !== 'money_market') {
                                diff = diff * inflowRatio;
                                if (diff < 10) finalAction = 'HOLD';
                                explanation = inflowRatio < 1 ? 'Deploying cash (pro-rata)' : 'Deploying cash';
                            } else if ((assetId === 'cash' || assetId === 'money_market') && diff < 0) {
                                diff = -Math.min(Math.abs(diff), totalBuyNeeded * inflowRatio);
                                if (Math.abs(diff) < 10) finalAction = 'HOLD';
                                explanation = 'Deploying cash';
                            } else {
                                finalAction = 'HOLD';
                            }
                        } else {
                            finalAction = 'HOLD';
                            explanation = 'Portfolio within bands';
                        }
                    } else {
                        if (Math.abs(diff) < 10) finalAction = 'HOLD';
                        explanation = 'Band breached - Rebalancing';
                    }
                }

                if (mode === 'inflow') {
                    if (diff < 0 && assetId !== 'cash' && assetId !== 'money_market') {
                        finalAction = 'HOLD';
                    } else if (diff > 0 && assetId !== 'cash' && assetId !== 'money_market') {
                        if (availableCash <= 10) {
                            finalAction = 'HOLD';
                            explanation = 'No settlement cash';
                        } else {
                            if (inflowRatio < 1) {
                                diff = diff * inflowRatio;
                                explanation = 'Reduced (Cash Limit)';
                            }
                            if (diff < 10) finalAction = 'HOLD';
                        }
                    } else if ((assetId === 'cash' || assetId === 'money_market') && diff < 0) {
                        diff = -Math.min(Math.abs(diff), totalBuyNeeded * inflowRatio);
                        if (Math.abs(diff) < 10 || totalBuyNeeded <= 0) finalAction = 'HOLD';
                    } else if ((assetId === 'cash' || assetId === 'money_market') && diff > 0) {
                        finalAction = 'HOLD'; // Never sell investments to raise cash in inflow-only mode
                    }
                }

                return { ...action, diff, action: finalAction, explanation };
            }).filter(a => a.action !== 'HOLD');
        };


        if (taxStrategy === 'mirrored') {
            investmentAccounts.forEach(accData => {
                const accTotal = accountTotals[accData.id] || 0;
                const efEntry = accountEmergencyMap?.[accData.id] || { effective: 0, spilloverCash: 0 };
                const accInvestable = Math.max(0, accTotal - efEntry.effective);

                if (accInvestable <= 0) {
                    accountActions[accData.id] = { targetHoldings: {}, currentTotal: accTotal, actions: [] };
                    return;
                }

                const ratio = investableTotal > 0 ? accInvestable / investableTotal : 0;
                const targetHoldings = {};
                Object.entries(targets).forEach(([assetId, globalAmount]) => {
                    targetHoldings[assetId] = globalAmount * ratio;
                });
                const currentHoldings = {};
                Object.keys(ASSET_CLASSES).forEach(k => currentHoldings[ASSET_CLASSES[k].id] = 0);
                if (accData && Array.isArray(accData.funds)) {
                    accData.funds.forEach(f => {
                        if (f.isEmergency) return;
                        let type = (f.type === 'money_market' || f.type === 'cash') ? 'cash' : f.type;
                        currentHoldings[type] = (currentHoldings[type] || 0) + (parseFloat(f.value) || 0);
                    });
                }
                const actualCashInAccount = accData ? (parseFloat(accData.cash) || 0) : 0;
                if (!accData.cashIsEmergency) {
                    currentHoldings['cash'] = (currentHoldings['cash'] || 0) + actualCashInAccount;
                }
                if (efEntry.spilloverCash > 0) {
                    currentHoldings['cash'] = (currentHoldings['cash'] || 0) + efEntry.spilloverCash;
                }

                // Deployable cash in this account: unshielded cash + money_market + emergency spillover above target cash
                const deployableCashInAccount = Math.max(0, (currentHoldings['cash'] || 0) - (targetHoldings['cash'] || 0));

                let rawActions = [];
                Object.values(ASSET_CLASSES).forEach(assetClass => {
                    const assetId = assetClass.id;
                    const target = targetHoldings[assetId] || 0;
                    const current = currentHoldings[assetId] || 0;
                    const diff = target - current;

                    if ((current > 1 || target > 1) && Math.abs(diff) > 0.01) {
                        rawActions.push({ assetId, assetName: assetClass.name, current, target, diff });
                    }
                });

                const mode = accData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;
                const processedActions = processActions(rawActions, accTotal, mode, deployableCashInAccount, investableTotal);
                accountActions[accData.id] = { targetHoldings, currentTotal: accTotal, actions: processedActions.sort((a, b) => a.diff - b.diff) };
            });
        } else {
            let buckets = {
                taxable: { capacity: 0, accounts: [], filled: 0, allocations: {} },
                deferred: { capacity: 0, accounts: [], filled: 0, allocations: {} },
                roth: { capacity: 0, accounts: [], filled: 0, allocations: {} }
            };

            const getEffectiveTaxType = (acc) => {
                if (acc && (acc.typeId === 'hsa' || acc.id === 'hsa')) {
                    return hsaStrategy === 'roth' ? 'roth' : 'deferred';
                }
                return acc?.taxType;
            };

            investmentAccounts.forEach(acc => {
                const effectiveTaxType = getEffectiveTaxType(acc);
                const bucket = buckets[effectiveTaxType];
                if (bucket) {
                    const accTotal = accountTotals[acc.id] || 0;
                    const efEntry = accountEmergencyMap?.[acc.id] || { effective: 0 };
                    const accInvestable = Math.max(0, accTotal - efEntry.effective);

                    bucket.capacity += accInvestable;
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
            };

            const allocateAssetStandard = (assetId) => {
                let amount = remainingTargets[assetId];
                if (amount <= 0) return;

                const assetInfo = Object.values(ASSET_CLASSES).find(a => a.id === assetId);
                let prefs = ['taxable', 'deferred', 'roth'];

                // Use taxPref from constants - ensure all 3 buckets are in fallback order
                if (taxStrategy === 'roth_growth') {
                    // Cash & money_market prefer taxable first, then deferred/roth if no taxable capacity
                    if (assetId === 'cash' || assetId === 'money_market') {
                        prefs = ['taxable', 'deferred', 'roth'];
                    } else if (assetInfo?.type === 'fixed') {
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
            };

            // Allocate cash & equivalents first (always prefer taxable)
            if (targets['cash']) allocateAssetStandard('cash');
            if (targets['money_market']) allocateAssetStandard('money_market');
            if (targets['bonds']) allocateAssetStandard('bonds');

            if (taxStrategy === 'standard') {
                const taxableCapacity = buckets.taxable.capacity - buckets.taxable.filled;
                if (taxableCapacity > 0) {
                    const taxableCandidates = Object.keys(remainingTargets).filter(key => {
                        if (key === 'money_market' || key === 'bonds' || key === 'cash') return false;
                        if (remainingTargets[key] <= 0) return false;
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                        const prefs = asset?.taxPref || ['taxable'];
                        return prefs[0] === 'taxable';
                    });

                    // Proportional blend of all tax-efficient core equities (US Broad/Large + Developed/Broad Intl)
                    // while high-dividend-drag / non-qualified assets (Emerging Markets, Small Cap, REITs)
                    // naturally stay excluded because their taxPref[0] is 'roth' or 'deferred'.
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

            if (taxStrategy === 'roth_growth') {
                const rothCapacity = buckets.roth.capacity - buckets.roth.filled;
                if (rothCapacity > 0) {
                    const equityAssets = Object.keys(remainingTargets).filter(assetId => {
                        if (remainingTargets[assetId] <= 0) return false;
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === assetId);
                        return asset?.type === 'equity';
                    });

                    const totalEquityTarget = equityAssets.reduce((sum, assetId) => sum + remainingTargets[assetId], 0);

                    if (totalEquityTarget > 0) {
                        const rothRatio = Math.min(1, rothCapacity / totalEquityTarget);
                        equityAssets.forEach(assetId => {
                            const amountForRoth = remainingTargets[assetId] * rothRatio;
                            addToBucket(assetId, 'roth', amountForRoth);
                        });
                    }
                }
            }

            if (taxStrategy === 'balanced_roth') {
                // Step 1: Prioritize high-growth & high-non-qualified-dividend equities (Emerging Markets, Small Cap, etc.)
                // into Roth first so they never create tax drag in Taxable.
                const rothFirstEquities = Object.keys(remainingTargets).filter(assetId => {
                    if (remainingTargets[assetId] <= 0) return false;
                    const asset = Object.values(ASSET_CLASSES).find(a => a.id === assetId);
                    return asset?.type === 'equity' && asset?.taxPref?.[0] === 'roth';
                });

                const totalRothFirstTarget = rothFirstEquities.reduce((sum, id) => sum + remainingTargets[id], 0);
                const availRoth1 = buckets.roth.capacity - buckets.roth.filled;
                if (totalRothFirstTarget > 0 && availRoth1 > 0) {
                    const r1 = Math.min(1, availRoth1 / totalRothFirstTarget);
                    rothFirstEquities.forEach(assetId => {
                        addToBucket(assetId, 'roth', remainingTargets[assetId] * r1);
                    });
                }

                // If Roth is full and any high-drag equities (e.g. Emerging Markets) remain, shelter them in Tax-Deferred before Taxable
                const availDeferredForHighDrag = buckets.deferred.capacity - buckets.deferred.filled;
                const remainingRothFirst = rothFirstEquities.filter(id => remainingTargets[id] > 0);
                const totalRemRothFirst = remainingRothFirst.reduce((sum, id) => sum + remainingTargets[id], 0);
                if (totalRemRothFirst > 0 && availDeferredForHighDrag > 0) {
                    const d1 = Math.min(1, availDeferredForHighDrag / totalRemRothFirst);
                    remainingRothFirst.forEach(assetId => {
                        addToBucket(assetId, 'deferred', remainingTargets[assetId] * d1);
                    });
                }

                // Step 2: Fill remaining Roth capacity with a proportional blend of Domestic & Developed/Broad International equities
                const availRoth2 = buckets.roth.capacity - buckets.roth.filled;
                if (availRoth2 > 0) {
                    const coreEquities = Object.keys(remainingTargets).filter(assetId => {
                        if (remainingTargets[assetId] <= 0) return false;
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === assetId);
                        return asset?.type === 'equity';
                    });
                    const totalCoreTarget = coreEquities.reduce((sum, id) => sum + remainingTargets[id], 0);
                    if (totalCoreTarget > 0) {
                        const r2 = Math.min(1, availRoth2 / totalCoreTarget);
                        coreEquities.forEach(assetId => {
                            addToBucket(assetId, 'roth', remainingTargets[assetId] * r2);
                        });
                    }
                }

                // Step 3: Fill Taxable capacity with a proportional blend of remaining tax-efficient Core Equities
                // (US Broad/Large + Developed/Broad International) instead of concentrating high-yield Intl in Taxable
                const availTaxable = buckets.taxable.capacity - buckets.taxable.filled;
                if (availTaxable > 0) {
                    const taxableCoreCandidates = Object.keys(remainingTargets).filter(key => {
                        if (key === 'money_market' || key === 'bonds' || key === 'cash') return false;
                        if (remainingTargets[key] <= 0) return false;
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === key);
                        return asset?.type === 'equity' && asset?.taxPref?.[0] === 'taxable';
                    });
                    const totalTaxCandidate = taxableCoreCandidates.reduce((sum, key) => sum + remainingTargets[key], 0);
                    if (totalTaxCandidate > 0) {
                        const tRatio = Math.min(1, availTaxable / totalTaxCandidate);
                        taxableCoreCandidates.forEach(assetId => {
                            addToBucket(assetId, 'taxable', remainingTargets[assetId] * tRatio);
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
                const effectiveTaxType = getEffectiveTaxType(accData);
                const bucket = buckets[effectiveTaxType];
                const accTotal = accountTotals[accId] || 0;
                const bucketTotal = bucket ? bucket.capacity : 0;

                const efEntry = accountEmergencyMap?.[accId] || { effective: 0, spilloverCash: 0 };
                const accInvestable = Math.max(0, accTotal - efEntry.effective);

                const share = bucketTotal > 0 ? accInvestable / bucketTotal : 0;
                const targetHoldings = {};
                if (bucket) {
                    Object.entries(bucket.allocations).forEach(([assetId, amount]) => targetHoldings[assetId] = amount * share);
                }

                let rawActions = [];
                const currentHoldings = {};
                Object.keys(ASSET_CLASSES).forEach(k => currentHoldings[ASSET_CLASSES[k].id] = 0);

                if (accData && Array.isArray(accData.funds)) {
                    accData.funds.forEach(f => {
                        if (f.isEmergency) return;
                        let type = (f.type === 'money_market' || f.type === 'cash') ? 'cash' : f.type;
                        currentHoldings[type] = (currentHoldings[type] || 0) + (parseFloat(f.value) || 0);
                    });
                }
                const actualCashInAccount = accData ? (parseFloat(accData.cash) || 0) : 0;
                if (!accData.cashIsEmergency) {
                    currentHoldings['cash'] = (currentHoldings['cash'] || 0) + actualCashInAccount;
                }
                if (efEntry.spilloverCash > 0) {
                    currentHoldings['cash'] = (currentHoldings['cash'] || 0) + efEntry.spilloverCash;
                }

                // Deployable cash in this account: unshielded cash + money_market + emergency spillover above target cash
                const deployableCashInAccount = Math.max(0, (currentHoldings['cash'] || 0) - (targetHoldings['cash'] || 0));

                Object.values(ASSET_CLASSES).forEach(assetClass => {
                    const assetId = assetClass.id;
                    const target = targetHoldings[assetId] || 0;
                    const current = currentHoldings[assetId] || 0;
                    const diff = target - current;

                    if ((current > 1 || target > 1) && Math.abs(diff) > 0.01) {
                        rawActions.push({ assetId, assetName: assetClass.name, current, target, diff });
                    }
                });

                const mode = accData.taxType === 'taxable' ? rebalanceModeTaxable : rebalanceModeSheltered;
                const processedActions = processActions(rawActions, accTotal, mode, deployableCashInAccount, investableTotal);
                accountActions[accId] = { targetHoldings, currentTotal: accTotal, actions: processedActions.sort((a, b) => a.diff - b.diff) };
            });
        }

        return { efAction, accountActions, globalBandsTriggered };
    }, [portfolioMetrics, accounts, emergencyFund, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered, equityStrategy, hsaStrategy]);


    const updateAccount = (accId, field, val) => {
        setAccounts(prev => ({
            ...prev,
            [accId]: { ...prev[accId], [field]: val }
        }));
    };

    const updateAccountCash = (accId, val) => {
        setAccounts(prev => ({
            ...prev,
            [accId]: { ...prev[accId], cash: val, lastUpdated: Date.now() }
        }));
    };

    const addFund = (accId, defaultType = 'us_broad') => {
        setAccounts(prev => ({
            ...prev,
            [accId]: {
                ...prev[accId],
                lastUpdated: Date.now(),
                funds: [...prev[accId].funds, { id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name: '', type: defaultType, value: 0 }]
            }
        }));
    };

    const updateFund = (accId, fundId, field, val) => {
        setAccounts(prev => ({
            ...prev,
            [accId]: {
                ...prev[accId],
                lastUpdated: Date.now(),
                funds: prev[accId].funds.map(f => f.id === fundId ? { ...f, [field]: val } : f)
            }
        }));
    };

    const removeFund = (accId, fundId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Fund',
            message: 'Are you sure you want to remove this fund?',
            onConfirm: () => {
                setAccounts(prev => ({
                    ...prev,
                    [accId]: {
                        ...prev[accId],
                        lastUpdated: Date.now(),
                        funds: prev[accId].funds.filter(f => f.id !== fundId)
                    }
                }));
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const updateEquityStrategy = (key, val) => setEquityStrategy(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));

    const addEquityAsset = (assetId) => {
        if (equityStrategy[assetId] !== undefined) return;
        setEquityStrategy(prev => ({ ...prev, [assetId]: 0 }));
        setIsAddingAsset(false);
    };

    const removeEquityAsset = (assetId) => {
        setEquityStrategy(prev => {
            const next = { ...prev };
            delete next[assetId];
            return next;
        });
    };

    const resetEquityStrategy = () => setEquityStrategy(DEFAULT_EQUITY_SPLIT);

    const normalizeEquityStrategy = () => {
        const total = Object.values(equityStrategy).reduce((a, b) => a + b, 0);
        if (total === 0) return;
        const normalized = {};
        Object.entries(equityStrategy).forEach(([key, val]) => {
            normalized[key] = Math.round((val / total) * 1000) / 10; // 1 decimal place
        });
        // Correct rounding drift so sum is exactly 100
        const normTotal = Object.values(normalized).reduce((a, b) => a + b, 0);
        const diff = Math.round((100 - normTotal) * 10) / 10;
        if (diff !== 0) {
            const largestKey = Object.entries(normalized).sort((a, b) => b[1] - a[1])[0][0];
            normalized[largestKey] = Math.round((normalized[largestKey] + diff) * 10) / 10;
        }
        setEquityStrategy(normalized);
    };

    const importFunds = (accId, newFunds) => {
        if (!accId || !newFunds || !newFunds.length) return;

        const currentAcc = accounts[accId];
        const existingNames = new Set(
            (currentAcc?.funds || []).map(f => (f.name || '').trim().toLowerCase())
        );

        let updatedCount = 0;
        let addedCount = 0;
        const cashEntries = newFunds.filter(f => f.type === 'cash');
        const fundEntries = newFunds.filter(f => f.type !== 'cash');

        fundEntries.forEach(imported => {
            const norm = (imported.name || '').trim().toLowerCase();
            if (existingNames.has(norm)) {
                updatedCount++;
            } else {
                existingNames.add(norm);
                addedCount++;
            }
        });

        setAccounts(prev => {
            const account = prev[accId];
            if (!account) return prev;

            // Replace cash with the imported snapshot total (not additive)
            const totalCash = cashEntries.reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0);
            const newCash = cashEntries.length > 0 ? totalCash : (parseFloat(account.cash) || 0);

            // Merge fund entries: update existing funds matched by name (case-insensitive),
            // append genuinely new ones.
            const existingFunds = [...(account.funds || [])];
            const updatedFunds = existingFunds.map(f => ({ ...f })); // shallow-copy each fund

            fundEntries.forEach(imported => {
                const normalizedImportName = (imported.name || '').trim().toLowerCase();
                const matchIdx = updatedFunds.findIndex(
                    f => (f.name || '').trim().toLowerCase() === normalizedImportName
                );

                if (matchIdx !== -1) {
                    // Update existing fund's value (and type if the import has a better guess)
                    updatedFunds[matchIdx] = {
                        ...updatedFunds[matchIdx],
                        value: imported.value,
                        type: imported.type || updatedFunds[matchIdx].type,
                    };
                } else {
                    // Append as a new fund
                    updatedFunds.push({
                        id: Date.now() + Math.random(),
                        name: imported.name,
                        value: imported.value,
                        type: imported.type || 'us_broad',
                        isEmergency: false,
                    });
                }
            });

            return {
                ...prev,
                [accId]: {
                    ...prev[accId],
                    cash: newCash,
                    lastUpdated: Date.now(),
                    funds: updatedFunds,
                }
            };
        });

        const cashTotal = cashEntries.reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0);
        const hasCash = cashEntries.length > 0;

        const parts = [];
        if (updatedCount > 0) parts.push(`updated ${updatedCount} fund${updatedCount > 1 ? 's' : ''}`);
        if (addedCount > 0) parts.push(`added ${addedCount} new fund${addedCount > 1 ? 's' : ''}`);
        if (hasCash) parts.push(`set cash to $${cashTotal.toLocaleString()}`);

        const message = parts.length > 0
            ? `Import complete: ${parts.join(', ')}.`
            : 'No changes made.';

        setNotification({ message, type: 'success' });
    };


    return {
        state: {
            isDarkMode, bondAllocation, cashAllocation, emergencyFund, userAge, retirementYear,
            bondStrategyMode, equityStrategy, isAddingAsset, taxStrategy, hsaStrategy,
            rebalanceModeTaxable, rebalanceModeSheltered, accounts,
            showAccountModal, newAccountName, newAccountType, fileInputRef,
            activeTab, notification, confirmModal, pasteModal,
            showWelcome, tourActive, tourStep,
            activeAssets
        },
        metrics: portfolioMetrics,
        rebalancingPlan,
        actions: {
            setIsDarkMode, setBondAllocation, setCashAllocation, setEmergencyFund, setUserAge, setRetirementYear,
            setBondStrategyMode, setEquityStrategy, setIsAddingAsset, setTaxStrategy, setHsaStrategy,
            setRebalanceModeTaxable, setRebalanceModeSheltered, setAccounts,
            setShowAccountModal, setNewAccountName, setNewAccountType, setActiveTab,
            setNotification, setConfirmModal, setPasteModal, setShowWelcome,
            setTourActive, setTourStep,
            createAccount, deleteAccount, updateAccount, updateAccountCash,
            addFund, updateFund, removeFund, toggleTheme,
            updateEquityStrategy, addEquityAsset, removeEquityAsset, resetEquityStrategy, normalizeEquityStrategy, importFunds,
            handleExportData, handleImportData, resetAllData, loadDemoData,
            startTour, nextTourStep, prevTourStep, endTour, dismissWelcome, handleLoadDemoFromWelcome
        }
    };
}
