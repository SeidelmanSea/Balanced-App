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
            retirementYear,
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

                            if (importedData.retirementYear) {
                                setRetirementYear(importedData.retirementYear);
                                setUserAge(65 - (importedData.retirementYear - currentYear));
                            } else if (importedData.userAge) {
                                setUserAge(importedData.userAge);
                                setRetirementYear(currentYear + (65 - importedData.userAge));
                            } else {
                                setUserAge(38);
                                setRetirementYear(currentYear + 27);
                            }

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
        const currentAllocation = {};
        const accountTotals = {};

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

            if (accData.cashIsEmergency) {
                autoEmergencyFund += effectiveCash;
            } else {
                investableTotal += effectiveCash;
                const cashKey = 'cash';
                currentAllocation[cashKey] = (currentAllocation[cashKey] || 0) + effectiveCash;
            }

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

        const emergencyTarget = parseFloat(emergencyFund) || 0;
        const emergencyActual = autoEmergencyFund;
        const emergencySurplus = Math.max(0, emergencyActual - emergencyTarget);

        const effectiveInvestableTotal = investableTotal + emergencySurplus;

        const targets = {};
        const cashKey = 'cash';
        const moneyMarketKey = 'money_market';
        const bondKey = 'bonds';

        // Three-part macro allocation: Bonds + Cash & Equivalents + Equity = 100%
        const cashEquivPct = cashAllocation || 0;
        const bondPct = bondAllocation || 0;
        const equityPct = 100 - bondPct - cashEquivPct;

        // Calculate targets
        const cashTarget = effectiveInvestableTotal * (cashEquivPct / 100);
        targets[cashKey] = cashTarget;
        targets[moneyMarketKey] = 0; // Money market is part of cash & equivalents, no separate target
        targets[bondKey] = effectiveInvestableTotal * (bondPct / 100);

        const equityTotalValue = effectiveInvestableTotal * (equityPct / 100);

        const totalStrat = Object.values(equityStrategy).reduce((a, b) => a + b, 0) || 100;
        Object.entries(equityStrategy).forEach(([assetId, weight]) => {
            const safeTotal = totalStrat === 0 ? 1 : totalStrat;
            targets[assetId] = equityTotalValue * (weight / safeTotal);
        });

        return { totalNetWorth, investableTotal: effectiveInvestableTotal, emergencyTarget, emergencyActual, currentAllocation, accountTotals, targets };
    }, [accounts, bondAllocation, cashAllocation, emergencyFund, equityStrategy]);

    const rebalancingPlan = useMemo(() => {
        const { investableTotal, targets, accountTotals, emergencyActual, emergencyTarget } = portfolioMetrics;

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

        const processActions = (rawActions, accTotal, mode, availableCash, portfolioTotal) => {
            let inflowRatio = 1;
            if (mode === 'inflow') {
                const totalBuyNeeded = rawActions.reduce((sum, a) => (a.diff > 0 && a.assetId !== 'money_market') ? sum + a.diff : sum, 0);
                if (totalBuyNeeded > availableCash && totalBuyNeeded > 0) {
                    inflowRatio = Math.max(0, availableCash) / totalBuyNeeded;
                }
            }

            let bandsTriggered = false;
            if (mode === 'bands') {
                bandsTriggered = rawActions.some(action => {
                    let { current, target } = action;
                    const denominator = portfolioTotal > 0 ? portfolioTotal : accTotal;
                    const targetPct = denominator > 0 ? (target / denominator) * 100 : 0;
                    const currentPct = denominator > 0 ? (current / denominator) * 100 : 0;

                    let threshold = 0;
                    if (targetPct >= 20) {
                        threshold = 5;
                    } else {
                        threshold = targetPct * 0.25;
                    }

                    return Math.abs(currentPct - targetPct) > threshold;
                });
            }

            return rawActions.map(action => {
                let { diff, current, target, assetId } = action;

                const denominator = portfolioTotal > 0 ? portfolioTotal : accTotal;
                const targetPct = denominator > 0 ? (target / denominator) * 100 : 0;
                const currentPct = denominator > 0 ? (current / denominator) * 100 : 0;

                let actionLabel = diff > 0 ? 'BUY' : 'SELL';
                if (assetId === 'cash') actionLabel = diff > 0 ? 'RAISE CASH' : 'INVEST CASH';
                let finalAction = actionLabel;
                let explanation = '';

                if (mode === 'strict') {
                    if (Math.abs(diff) < 10) finalAction = 'HOLD';
                }

                if (mode === 'bands') {
                    if (!bandsTriggered) {
                        finalAction = 'HOLD';
                        explanation = 'Portfolio within bands';
                    } else {
                        explanation = 'Band breached - Rebalancing';
                    }
                }

                if (mode === 'inflow') {
                    if (diff < 0 && assetId !== 'money_market') {
                        finalAction = 'HOLD';
                    }
                    if (diff > 0 && assetId !== 'money_market') {
                        if (availableCash <= 0) {
                            finalAction = 'HOLD';
                            explanation = 'No settlement cash';
                        } else if (inflowRatio < 1) {
                            diff = diff * inflowRatio;
                            explanation = 'Reduced (Cash Limit)';
                        }
                    }
                }

                return { ...action, diff, action: finalAction, explanation };
            }).filter(a => a.action !== 'HOLD');
        };


        if (taxStrategy === 'mirrored') {
            investmentAccounts.forEach(accData => {
                const accTotal = accountTotals[accData.id] || 0;
                if (accTotal <= 0) {
                    accountActions[accData.id] = { targetHoldings: {}, currentTotal: 0, actions: [] };
                    return;
                }

                let accShielded = 0;
                if (accData.cashIsEmergency) accShielded += (parseFloat(accData.cash) || 0);
                if (Array.isArray(accData.funds)) {
                    accData.funds.forEach(f => {
                        if (f.isEmergency) accShielded += (parseFloat(f.value) || 0);
                    });
                }
                const accInvestable = Math.max(0, accTotal - accShielded);

                const ratio = accInvestable / investableTotal;
                const targetHoldings = {};
                Object.entries(targets).forEach(([assetId, globalAmount]) => {
                    targetHoldings[assetId] = globalAmount * ratio;
                });
                const currentHoldings = {};
                Object.keys(ASSET_CLASSES).forEach(k => currentHoldings[ASSET_CLASSES[k].id] = 0);
                if (accData && Array.isArray(accData.funds)) {
                    accData.funds.forEach(f => {
                        if (f.isEmergency) return;
                        let type = f.type;
                        currentHoldings[type] = (currentHoldings[type] || 0) + parseFloat(f.value);
                    });
                }
                const actualCashInAccount = accData ? (parseFloat(accData.cash) || 0) : 0;
                const cashKey = 'money_market';
                if (!accData.cashIsEmergency) {
                    currentHoldings[cashKey] = (currentHoldings[cashKey] || 0) + actualCashInAccount;
                }

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
                const processedActions = processActions(rawActions, accTotal, mode, actualCashInAccount, accTotal);
                accountActions[accData.id] = { targetHoldings, currentTotal: accTotal, actions: processedActions.sort((a, b) => a.diff - b.diff) };
            });
        } else {
            let buckets = {
                taxable: { capacity: 0, accounts: [], filled: 0, allocations: {} },
                deferred: { capacity: 0, accounts: [], filled: 0, allocations: {} },
                roth: { capacity: 0, accounts: [], filled: 0, allocations: {} }
            };

            investmentAccounts.forEach(acc => {
                const bucket = buckets[acc.taxType];
                if (bucket) {
                    const accTotal = accountTotals[acc.id] || 0;
                    let emergencyAmount = 0;

                    if (acc.cashIsEmergency) {
                        emergencyAmount += (parseFloat(acc.cash) || 0);
                    }
                    if (Array.isArray(acc.funds)) {
                        acc.funds.forEach(f => {
                            if (f.isEmergency) emergencyAmount += (parseFloat(f.value) || 0);
                        });
                    }

                    bucket.capacity += (accTotal - emergencyAmount);
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
                const rothCapacity = buckets.roth.capacity - buckets.roth.filled;
                if (rothCapacity > 0) {
                    const domesticEquities = Object.keys(remainingTargets).filter(assetId => {
                        if (remainingTargets[assetId] <= 0) return false;
                        if (assetId === 'intl_developed' || assetId === 'emerging_markets') return false;
                        const asset = Object.values(ASSET_CLASSES).find(a => a.id === assetId);
                        return asset?.type === 'equity';
                    });

                    const totalDomesticTarget = domesticEquities.reduce((sum, assetId) => sum + remainingTargets[assetId], 0);

                    if (totalDomesticTarget > 0) {
                        const rothRatio = Math.min(1, rothCapacity / totalDomesticTarget);
                        domesticEquities.forEach(assetId => {
                            const amountForRoth = remainingTargets[assetId] * rothRatio;
                            addToBucket(assetId, 'roth', amountForRoth);
                        });
                    }
                }

                const taxableCapacity = buckets.taxable.capacity - buckets.taxable.filled;
                if (taxableCapacity > 0) {
                    ['intl_developed', 'emerging_markets'].forEach(assetId => {
                        if (remainingTargets[assetId] > 0) {
                            const intlAmount = Math.min(taxableCapacity, remainingTargets[assetId]);
                            if (intlAmount > 0) {
                                addToBucket(assetId, 'taxable', intlAmount);
                            }
                        }
                    });
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

                let accShielded = 0;
                if (accData.cashIsEmergency) accShielded += (parseFloat(accData.cash) || 0);
                if (Array.isArray(accData.funds)) {
                    accData.funds.forEach(f => {
                        if (f.isEmergency) accShielded += (parseFloat(f.value) || 0);
                    });
                }
                const accInvestable = Math.max(0, accTotal - accShielded);

                const share = bucketTotal > 0 ? accInvestable / bucketTotal : 0;
                const targetHoldings = {};
                Object.entries(bucket.allocations).forEach(([assetId, amount]) => targetHoldings[assetId] = amount * share);

                let rawActions = [];
                const currentHoldings = {};
                Object.keys(ASSET_CLASSES).forEach(k => currentHoldings[ASSET_CLASSES[k].id] = 0);

                if (accData && Array.isArray(accData.funds)) {
                    accData.funds.forEach(f => {
                        if (f.isEmergency) return;
                        let type = f.type;
                        currentHoldings[type] = (currentHoldings[type] || 0) + parseFloat(f.value);
                    });
                }
                const actualCashInAccount = accData ? (parseFloat(accData.cash) || 0) : 0;
                const cashKey = 'money_market';
                if (!accData.cashIsEmergency) {
                    currentHoldings[cashKey] = (currentHoldings[cashKey] || 0) + actualCashInAccount;
                }

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
                const processedActions = processActions(rawActions, accTotal, mode, actualCashInAccount, investableTotal);
                accountActions[accId] = { targetHoldings, currentTotal: accTotal, actions: processedActions.sort((a, b) => a.diff - b.diff) };
            });
        }

        return { efAction, accountActions };
    }, [portfolioMetrics, accounts, emergencyFund, taxStrategy, rebalanceModeTaxable, rebalanceModeSheltered, equityStrategy]);


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
        setConfirmModal({
            isOpen: true,
            title: 'Remove Fund',
            message: 'Are you sure you want to remove this fund?',
            onConfirm: () => {
                setAccounts(prev => ({
                    ...prev,
                    [accId]: {
                        ...prev[accId],
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

    const importFunds = (accId, newFunds) => {
        if (!accId || !newFunds || !newFunds.length) return;

        setAccounts(prev => {
            const account = prev[accId];
            if (!account) return prev;

            // Separate cash from other funds
            const cashEntries = newFunds.filter(f => f.type === 'cash');
            const fundEntries = newFunds.filter(f => f.type !== 'cash');

            // Sum up all cash entries
            const totalCash = cashEntries.reduce((sum, f) => sum + (parseFloat(f.value) || 0), 0);

            // Map fund entries to internal structure with new IDs
            const fundsToAdd = fundEntries.map(f => ({
                id: Date.now() + Math.random(), // Ensure unique ID
                name: f.name,
                value: f.value,
                type: f.type || 'us_broad',
                isEmergency: false
            }));

            // Update account with new cash and funds
            return {
                ...prev,
                [accId]: {
                    ...prev[accId],
                    cash: (parseFloat(prev[accId].cash) || 0) + totalCash,
                    funds: [...(prev[accId].funds || []), ...fundsToAdd]
                }
            };
        });

        const fundCount = newFunds.filter(f => f.type !== 'cash').length;
        const cashCount = newFunds.filter(f => f.type === 'cash').length;
        const cashTotal = newFunds.filter(f => f.type === 'cash').reduce((sum, f) => sum + f.value, 0);

        let message = '';
        if (fundCount > 0 && cashCount > 0) {
            message = `Imported ${fundCount} fund${fundCount > 1 ? 's' : ''} and $${cashTotal.toLocaleString()} cash`;
        } else if (fundCount > 0) {
            message = `Successfully imported ${fundCount} fund${fundCount > 1 ? 's' : ''}`;
        } else if (cashCount > 0) {
            message = `Successfully imported $${cashTotal.toLocaleString()} cash`;
        }

        setNotification({ message, type: 'success' });
    };


    return {
        state: {
            isDarkMode, bondAllocation, cashAllocation, emergencyFund, userAge, retirementYear,
            bondStrategyMode, equityStrategy, isAddingAsset, taxStrategy,
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
            setBondStrategyMode, setEquityStrategy, setIsAddingAsset, setTaxStrategy,
            setRebalanceModeTaxable, setRebalanceModeSheltered, setAccounts,
            setShowAccountModal, setNewAccountName, setNewAccountType, setActiveTab,
            setNotification, setConfirmModal, setPasteModal, setShowWelcome,
            setTourActive, setTourStep,
            createAccount, deleteAccount, updateAccount, updateAccountCash,
            addFund, updateFund, removeFund, toggleTheme,
            updateEquityStrategy, addEquityAsset, removeEquityAsset, resetEquityStrategy, importFunds,
            handleExportData, handleImportData, resetAllData, loadDemoData,
            startTour, nextTourStep, prevTourStep, endTour, dismissWelcome, handleLoadDemoFromWelcome
        }
    };
}
