import React, { useState, useEffect } from 'react';

const CurrencyInput = ({ value, onChange, className, placeholder }) => {
    const [localValue, setLocalValue] = useState(value?.toString() || '');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            setLocalValue(value === undefined || value === null ? '' : value.toString());
        }
    }, [value, isFocused]);

    const handleChange = (e) => {
        let raw = e.target.value.replace(/[^0-9.]/g, '');
        // Prevent multiple decimals
        const parts = raw.split('.');
        if (parts.length > 2) {
            raw = parts[0] + '.' + parts.slice(1).join('');
        }
        setLocalValue(raw);
        onChange(raw);
    };

    const displayValue = isFocused ? localValue : (localValue && !isNaN(Number(localValue)) ? Number(localValue).toLocaleString() : localValue);

    return (
        <input
            type="text"
            className={className}
            value={displayValue}
            placeholder={placeholder}
            onFocus={(e) => {
                setIsFocused(true);
                if (!e.target.value || e.target.value === '0') {
                    // Small timeout to allow state to settle before selecting
                    setTimeout(() => e.target.select(), 0);
                }
            }}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            inputMode="decimal"
        />
    );
};

export default CurrencyInput;
