import tickerDatabase from '../tickerDatabase.json';

export const parseCSV = (text) => {
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

export const parsePasteData = (text) => {
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
