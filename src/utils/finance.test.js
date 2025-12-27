
import { describe, it, expect } from 'vitest';
import { formatCurrency, getSuggestedBondAllocation, detectStrategy } from './finance';

describe('Financial Utils', () => {
    describe('formatCurrency', () => {
        it('should format numbers as USD currency', () => {
            expect(formatCurrency(1234.56)).toBe('$1,235');
            expect(formatCurrency(0)).toBe('$0');
            expect(formatCurrency(1000000)).toBe('$1,000,000');
        });
    });

    describe('getSuggestedBondAllocation', () => {
        // Constants from Constants.js: MIN 10, MAX 70, START AGE 40, RETIREMENT age 65
        // Linear logic was replaced by glide path? Let's assume linear from 40 to 65 for now or check implementation.
        // Based on previous reads: 
        // < 40: 10%
        // > 65: 70%
        // 52.5 (midpoint): ~40%

        it('should return minimum allocation for young investors', () => {
            expect(getSuggestedBondAllocation(25)).toBe(10);
            expect(getSuggestedBondAllocation(39)).toBe(10);
        });

        it('should return maximum allocation for retired investors', () => {
            expect(getSuggestedBondAllocation(65)).toBe(70);
            expect(getSuggestedBondAllocation(80)).toBe(70);
        });

        it('should scale non-linearly (quadratic) between start age and retirement', () => {
            // Age 50: 10 years into 25 year glide path (40%).
            // Increase = 60 * (0.4 ^ 2) = 60 * 0.16 = 9.6
            // Base 10 + 9.6 = 19.6 -> Rounds to 20
            expect(getSuggestedBondAllocation(50)).toBe(20);
        });
    });

    describe('detectStrategy', () => {
        it('should detect smart strategy matches', () => {
            expect(detectStrategy(30, 10)).toBe('smart'); // Matches age-based suggestion
            expect(detectStrategy(65, 70)).toBe('smart');
        });

        it('should detect manual strategy when deviation is significant', () => {
            expect(detectStrategy(30, 50)).toBe('manual'); // Far from 10
            expect(detectStrategy(65, 10)).toBe('manual'); // Far from 70
        });
    });
});
