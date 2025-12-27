
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
        // Split act to allow state update to settle if needed, though act should handle it. 
        // The issue might be that setNewAccountType defaults are used if not updated.

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

        // Create Account
        act(() => {
            result.current.actions.setNewAccountName('Checking');
            result.current.actions.setNewAccountType('taxable'); // id: taxable
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accId = Object.keys(result.current.state.accounts)[0];

        // Add Cash
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
            result.current.actions.setNewAccountType('emergency_fund'); // id: emergency_fund
        });

        act(() => {
            result.current.actions.createAccount();
        });

        const accId = Object.keys(result.current.state.accounts)[0];

        // Check if it really detected as emergency fund
        // emergency_fund type has taxType 'taxable' but is checked via acc.typeId usually? 
        // Wait, let's check usePortfolio logic.
        // Logic: if (accData.cashIsEmergency) ...
        // When creating 'emergency_fund' type, does it set cashIsEmergency?

        // Let's force it for the test if the auto-detection isn't in createAccount (which it probably isn't, relying on typeId for icons/UI, but logic uses flags).
        // Actually, let's seeing "cashIsEmergency" in usePortfolio.js:
        // It's a property on the account object.

        // Let's verify if `createAccount` sets it. 
        // Inspecting usePortfolio code (memory): It sets id, name, typeId, taxType, iconId. 
        // It does NOT set cashIsEmergency by default in createAccount.
        // Users toggle it? Or is it implied by type?

        // If I look at `AccountsManager` (which I created), maybe it sets it?
        // Start simple: Test what `metrics` does.

        act(() => {
            result.current.actions.updateAccountCash(accId, 20000);
            // Manually set cashIsEmergency for now as the hook might expects UI to toggle it
            result.current.actions.updateAccount(accId, 'cashIsEmergency', true);
        });

        // Default emergency fund target is 10000
        // Actual 20000. Surplus 10000.

        expect(result.current.metrics.emergencyActual).toBe(20000);
        expect(result.current.metrics.emergencyTarget).toBe(10000);
        // Surplus is added to investable?
        // effectiveInvestableTotal = investableTotal + emergencySurplus;
        // investableTotal (from non-emergency accounts) = 0.
        // surplus = 10000.
        // effective = 10000.

        expect(result.current.metrics.investableTotal).toBe(10000);
    });
});
