import type { FinancialData } from '../types';

const STORAGE_KEY = 'kannadi-data';
const LEGACY_STORAGE_KEY = 'simple-finance-data';

export const saveFinancialData = (data: FinancialData): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save financial data:', error);
    }
};

export const loadFinancialData = (): FinancialData | null => {
    try {
        // Try new key first
        let data = localStorage.getItem(STORAGE_KEY);

        // If not found, check legacy key and migrate
        if (!data) {
            data = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (data) {
                // Migrate to new key
                localStorage.setItem(STORAGE_KEY, data);
                localStorage.removeItem(LEGACY_STORAGE_KEY);
                console.log('Migrated data from simple-finance to kannadi');
            }
        }

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load financial data:', error);
        return null;
    }
};

export const clearFinancialData = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY); // Also clear legacy
    } catch (error) {
        console.error('Failed to clear financial data:', error);
    }
};
