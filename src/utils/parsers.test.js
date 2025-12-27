
import { describe, it, expect } from 'vitest';
import { parseCSV, parsePasteData } from './parsers';

describe('Parser Utils', () => {
    describe('parseCSV', () => {
        it('should parse valid CSV data', () => {
            const csv = `Symbol,Description,Quantity,Market Value
VTI,Vanguard Total Stock,100,"20,000.00"
VXUS,Vanguard Total Intl,50,2500.00`;

            const result = parseCSV(csv);
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({ name: 'VTI', value: 20000 });
            expect(result[1]).toMatchObject({ name: 'VXUS', value: 2500 });
        });

        it('should handle dollar signs and commas in values', () => {
            const csv = `Symbol,Quantity,Current Value
VTI,"1,000","$200,500.00"`;

            const result = parseCSV(csv);
            expect(result[0].value).toBe(200500);
        });

        it('should ignore empty lines and non-data rows', () => {
            const csv = `
Symbol,Shares,Value
VTI,10,100
Account Total,,,1000`;
            const result = parseCSV(csv);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('VTI');
        });
    });

    describe('parsePasteData', () => {
        it('should parse space/tab separated data', () => {
            const text = `VTI 10 200`;
            const result = parsePasteData(text);
            expect(result).toHaveLength(1);
            // Parser takes the last number as the value (assuming it's Total Value)
            expect(result[0].value).toBe(200);
        });
    });
});
