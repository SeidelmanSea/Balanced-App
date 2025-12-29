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
});
