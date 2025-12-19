import type { MonthlyData } from '../types';
import { getCurrentMonth } from './calculations';

export interface ProjectionResult {
    averageIncome: number;
    averageExpenses: number;
    averageSavings: number;
    yearlyProjection: number;
    headline: string;
    monthsAnalyzed: number;
}

/**
 * Filter and identify the last 3-6 completed months for analysis.
 * Excludes the current month.
 */
export const getAnalysisMonths = (history: MonthlyData[], limit: number = 6): MonthlyData[] => {
    const currentMonth = getCurrentMonth();

    // Filter out current month and months with zero income
    const completedMonths = history
        .filter(m => m.month < currentMonth)
        .filter(m => m.income > 0)
        .sort((a, b) => b.month.localeCompare(a.month)); // Newest first

    return completedMonths.slice(0, limit);
};

/**
 * Calculate projections based on historical averages.
 */
export const calculateProjections = (analysisMonths: MonthlyData[]): ProjectionResult | null => {
    if (analysisMonths.length < 3) {
        return null;
    }

    const totalIncome = analysisMonths.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = analysisMonths.reduce((sum, m) => sum + m.expenses, 0);
    const totalSavings = analysisMonths.reduce((sum, m) => sum + m.savings, 0);

    const averageIncome = totalIncome / analysisMonths.length;
    const averageExpenses = totalExpenses / analysisMonths.length;
    const averageSavings = totalSavings / analysisMonths.length;

    const yearlyProjection = averageSavings * 12;
    const headline = generateProjectionHeadline(yearlyProjection);

    return {
        averageIncome,
        averageExpenses,
        averageSavings,
        yearlyProjection,
        headline,
        monthsAnalyzed: analysisMonths.length
    };
};

/**
 * Generate a neutral, factual headline for the projection.
 * Neutral verbs: grows, shrinks, remains, disappears.
 */
const generateProjectionHeadline = (yearlySavings: number): string => {
    // The amount will be formatted by the component using formatCurrency

    if (yearlySavings > 0) {
        return `Savings grow by ~##AMOUNT##.`;
    } else if (yearlySavings < 0) {
        return `Spending exceeds income by ~##AMOUNT##.`;
    } else {
        return `Savings remain unchanged.`;
    }
};
