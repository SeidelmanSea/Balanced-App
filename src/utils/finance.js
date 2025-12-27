import { RETIREMENT_AGE, GLIDE_PATH_START_AGE, BOND_MIN, BOND_MAX } from './constants';

export const formatCurrency = (value) => {
    if (isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
};

export const getSuggestedBondAllocation = (age) => {
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

export const detectStrategy = (age, allocation) => {
    const numericAge = parseInt(age, 10) || 0;
    if (allocation === getSuggestedBondAllocation(numericAge)) return 'smart';
    if (allocation === Math.max(0, numericAge - 20)) return 'aggressive';
    if (allocation === Math.max(0, numericAge - 10)) return 'moderate';
    if (allocation === Math.min(100, numericAge)) return 'conservative';
    return 'manual';
};

export const generateGlidePathData = (strategyType) => {
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
