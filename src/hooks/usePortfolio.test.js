import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolio } from './usePortfolio';
import { ACCOUNT_CREATION_OPTIONS } from '../utils/constants';

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('usePortfolio Hook', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => usePortfolio());

        expect(result.current.state.accounts).toEqual({});
        expect(result.current.state.emergencyFund).toBe(10000);
        expect(result.current.state.bondAllocation).toBe(10);
    });

    it('should create a new account', () => {
        const { result } = renderHook(() => usePortfolio());

        act(() => {
            result.current.actions.setNewAccountName('My Vanguard');
        });

        act(() => {
            result.current.actions.setNewAccountType('taxable');
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accounts = result.current.state.accounts;
        const accountIds = Object.keys(accounts);
        expect(accountIds).toHaveLength(1);
        expect(accounts[accountIds[0]].name).toBe('My Vanguard');
        expect(accounts[accountIds[0]].taxType).toBe('taxable');
    });

    it('should calculate net worth correctly', () => {
        const { result } = renderHook(() => usePortfolio());

        act(() => {
            result.current.actions.setNewAccountName('Checking');
            result.current.actions.setNewAccountType('taxable');
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accId = Object.keys(result.current.state.accounts)[0];

        act(() => {
            result.current.actions.updateAccountCash(accId, 50000);
        });

        expect(result.current.state.accounts[accId].cash).toBe(50000);
        expect(result.current.metrics.totalNetWorth).toBe(50000);
        expect(result.current.metrics.investableTotal).toBe(50000);
    });

    it('should update emergency fund logic', () => {
        const { result } = renderHook(() => usePortfolio());

        act(() => {
            result.current.actions.setNewAccountName('HYSA');
            result.current.actions.setNewAccountType('emergency_fund');
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accId = Object.keys(result.current.state.accounts)[0];

        act(() => {
            result.current.actions.updateAccountCash(accId, 20000);
            result.current.actions.updateAccount(accId, 'cashIsEmergency', true);
        });

        expect(result.current.metrics.emergencyActual).toBe(20000);
        expect(result.current.metrics.emergencyTarget).toBe(10000);
        expect(result.current.metrics.investableTotal).toBe(10000);
    });

    it('should import funds into an account', () => {
        const { result } = renderHook(() => usePortfolio());

        act(() => {
            result.current.actions.setNewAccountName('Brokerage');
            result.current.actions.setNewAccountType('taxable');
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accId = Object.keys(result.current.state.accounts)[0];

        const parsedFunds = [
            { name: 'VTI', value: 10000, type: 'us_broad' },
            { name: 'VXUS', value: 5000, type: 'intl_developed' }
        ];

        act(() => {
            result.current.actions.importFunds(accId, parsedFunds);
        });

        const account = result.current.state.accounts[accId];
        expect(account.funds).toHaveLength(2);
        expect(account.funds[0].name).toBe('VTI');
        expect(account.funds[0].value).toBe(10000);
        expect(account.funds[1].name).toBe('VXUS');
    });

    it('should import cash to cash field and funds to funds array', () => {
        const { result } = renderHook(() => usePortfolio());

        act(() => {
            result.current.actions.setNewAccountName('Brokerage');
            result.current.actions.setNewAccountType('taxable');
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accId = Object.keys(result.current.state.accounts)[0];

        // Set initial cash to 1000
        act(() => {
            result.current.actions.updateAccountCash(accId, 1000);
        });

        const parsedData = [
            { name: 'Cash', value: 5000, type: 'cash' },
            { name: 'VTSAX', value: 10000, type: 'us_broad' },
            { name: 'VMFXX', value: 2000, type: 'money_market' }
        ];

        act(() => {
            result.current.actions.importFunds(accId, parsedData);
        });

        const account = result.current.state.accounts[accId];

        // Cash should be added to cash field (1000 + 5000 = 6000)
        expect(account.cash).toBe(6000);

        // Only non-cash entries should be in funds (2 items: VTSAX and VMFXX)
        expect(account.funds).toHaveLength(2);
        expect(account.funds[0].name).toBe('VTSAX');
        expect(account.funds[0].value).toBe(10000);
        expect(account.funds[1].name).toBe('VMFXX');
        expect(account.funds[1].type).toBe('money_market');
    });

    // === DRIFT BAND REBALANCING TESTS ===
    describe('Drift Band Rebalancing', () => {
        it('should trigger rebalancing when 5% absolute drift exceeded for major holdings', () => {
            const { result } = renderHook(() => usePortfolio());

            // Create account with 60/40 target that drifts to 66/34
            act(() => {
                result.current.actions.setBondAllocation(40);
                result.current.actions.setRebalanceModeTaxable('bands');
                result.current.actions.setEquityStrategy({ us_broad: 100 }); // Set equity strategy

                result.current.actions.setNewAccountName('Brokerage');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            const accId = Object.keys(result.current.state.accounts)[0];

            act(() => {
                result.current.actions.importFunds(accId, [
                    { name: 'VTI', value: 66000, type: 'us_broad' },
                    { name: 'BND', value: 34000, type: 'bonds' }
                ]);
            });

            const plan = result.current.rebalancingPlan;
            const actions = plan.accountActions[accId]?.actions || [];

            // Should have rebalance actions (not all HOLD)
            expect(actions.length).toBeGreaterThan(0);
        });

        it('should use 25% relative drift for minor holdings', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setBondAllocation(10);
                result.current.actions.setRebalanceModeTaxable('bands');
                result.current.actions.setEquityStrategy({ us_broad: 80, reit: 20 });

                result.current.actions.setNewAccountName('Brokerage');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            const accId = Object.keys(result.current.state.accounts)[0];

            // 18% REIT (target 20%) - within 25% relative (±5pp)
            act(() => {
                result.current.actions.importFunds(accId, [
                    { name: 'VTI', value: 72000, type: 'us_broad' },
                    { name: 'VNQ', value: 18000, type: 'reit' },
                    { name: 'BND', value: 10000, type: 'bonds' }
                ]);
            });

            const plan = result.current.rebalancingPlan;
            const actions = plan.accountActions[accId]?.actions || [];

            // 18% is within ±5pp of 20% target, should NOT trigger
            expect(actions.length).toBe(0);
        });

        it('should NOT trigger when portfolio within bands', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setBondAllocation(40);
                result.current.actions.setRebalanceModeTaxable('bands');
                result.current.actions.setEquityStrategy({ us_broad: 100 });

                result.current.actions.setNewAccountName('Brokerage');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            const accId = Object.keys(result.current.state.accounts)[0];

            // 60/40 portfolio with minimal drift (within 5% bands)
            act(() => {
                result.current.actions.importFunds(accId, [
                    { name: 'VTI', value: 61000, type: 'us_broad' }, // 61% (within ±5%)
                    { name: 'BND', value: 39000, type: 'bonds' } // 39% (within ±5%)
                ]);
            });

            const plan = result.current.rebalancingPlan;
            const actions = plan.accountActions[accId]?.actions || [];

            // Should have no actions (all filtered as HOLD)
            expect(actions.length).toBe(0);
        });
    });

    // === EMERGENCY FUND SURPLUS TESTS ===
    describe('Emergency Fund Surplus', () => {
        it('should add emergency surplus to investable total', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setEmergencyFund(20000); // Target $20k
            });

            act(() => {
                result.current.actions.setNewAccountName('HYSA');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            const accId = Object.keys(result.current.state.accounts)[0];

            act(() => {
                result.current.actions.updateAccountCash(accId, 30000); // $30k actual
                result.current.actions.updateAccount(accId, 'cashIsEmergency', true);
            });

            // $30k - $20k = $10k surplus should be investable
            expect(result.current.metrics.emergencyActual).toBe(30000);
            expect(result.current.metrics.emergencyTarget).toBe(20000);
            expect(result.current.metrics.investableTotal).toBe(10000);
        });
    });

    // === DIVISION BY ZERO EDGE CASES ===
    describe('Edge Cases - Division by Zero', () => {
        it('should handle empty portfolio without crashing', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setNewAccountName('Empty');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            // Account has $0
            const plan = result.current.rebalancingPlan;

            // Should not crash, should handle gracefully
            expect(plan).toBeDefined();
            expect(plan.accountActions).toBeDefined();
        });

        it('should handle zero equity strategy total', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                // Set all equity weights to 0
                result.current.actions.setEquityStrategy({});
            });

            // Should not crash
            expect(result.current.metrics.targets).toBeDefined();
        });
    });

    // === TAX OPTIMIZATION TESTS ===
    describe('Tax Optimization', () => {
        it('should handle mirrored tax strategy with multiple accounts', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setTaxStrategy('mirrored');
                result.current.actions.setBondAllocation(40);
                result.current.actions.setEquityStrategy({ us_broad: 100 });
            });

            act(() => {
                result.current.actions.setNewAccountName('Account1');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            const acc1Id = Object.keys(result.current.state.accounts)[0];

            act(() => {
                result.current.actions.updateAccountCash(acc1Id, 50000);
            });

            const plan = result.current.rebalancingPlan;

            // Should calculate plan without crashing
            expect(plan).toBeDefined();
            expect(plan.accountActions[acc1Id]).toBeDefined();
        });
    });

    // === ALLOCATION CONSTRAINT TESTS ===
    describe('Allocation Constraints', () => {
        it('should calculate equity as 100 - bonds - cash', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setBondAllocation(30);
                result.current.actions.setCashAllocation(15);
            });

            // Equity should be 100 - 30 - 15 = 55
            const bondPct = result.current.state.bondAllocation;
            const cashPct = result.current.state.cashAllocation;
            const equityPct = 100 - bondPct - cashPct;

            expect(equityPct).toBe(55);
        });

        it('should handle funds marked as emergency', () => {
            const { result } = renderHook(() => usePortfolio());

            act(() => {
                result.current.actions.setNewAccountName('Brokerage');
                result.current.actions.setNewAccountType('taxable');
                result.current.actions.createAccount();
            });

            const accId = Object.keys(result.current.state.accounts)[0];

            // Import a fund
            act(() => {
                result.current.actions.importFunds(accId, [
                    { name: 'VTI', value: 50000, type: 'us_broad' }
                ]);
            });

            // Verify it's initially investable
            expect(result.current.metrics.investableTotal).toBe(50000);

            // Get fund ID and mark as emergency
            const account = result.current.state.accounts[accId];
            const fundId = account.funds[0].id;

            act(() => {
                result.current.actions.updateFund(accId, fundId, 'isEmergency', true);
            });

            // Now should be counted as emergency, not investable
            expect(result.current.metrics.emergencyActual).toBe(50000);
            expect(result.current.metrics.investableTotal).toBe(0);
        });
    });
});
