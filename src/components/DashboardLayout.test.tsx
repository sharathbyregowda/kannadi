import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import { FinanceProvider, useFinance } from '../context/FinanceContext';

// Mock all sub-components to focus purely on layout structure
vi.mock('./MonthlySummary', () => ({ default: () => <div data-testid="monthly-summary" /> }));
vi.mock('./YearlySummary', () => ({ default: () => <div data-testid="yearly-summary" /> }));
vi.mock('./IfThisContinues', () => ({ default: () => <div className="projection-card" data-testid="if-this-continues" /> }));
vi.mock('./FinancialJourney', () => ({ default: () => <div className="financial-journey-card" data-testid="financial-journey" /> }));
vi.mock('./SavingsSummary', () => ({ default: () => <div data-testid="savings-summary" /> }));
vi.mock('./ReportTabs', () => ({ default: () => <div data-testid="report-tabs" /> }));
vi.mock('./CategoryBreakdown', () => ({ default: () => <div data-testid="category-breakdown" /> }));
vi.mock('./IncomeForm', () => ({ default: () => <div data-testid="income-form" /> }));
vi.mock('./ExpenseLedger', () => ({ default: () => <div data-testid="expense-ledger" /> }));
vi.mock('./Settings', () => ({ default: () => <div data-testid="settings" /> }));
vi.mock('./CategoryManager', () => ({ default: () => <div data-testid="category-manager" /> }));

// Mock useFinance
vi.mock('../context/FinanceContext', async () => {
    const actual = await vi.importActual('../context/FinanceContext');
    return {
        ...actual,
        useFinance: vi.fn(),
    };
});

describe('Dashboard Layout Consistency', () => {
    it('ensures IfThisContinues is a direct child of the grid in yearly view', () => {
        vi.mocked(useFinance).mockReturnValue({
            data: {
                expenses: [],
                incomes: [],
                currentMonth: '2023-ALL', // Yearly view
                currency: 'USD',
                customCategories: [],
            },
            budgetSummary: {},
            setCurrentMonth: vi.fn(),
        } as any);

        render(
            <FinanceProvider>
                <Dashboard />
            </FinanceProvider>
        );

        const grid = document.querySelector('.dashboard-grid');
        const projectionCard = document.querySelector('.projection-card');

        expect(grid).toBeInTheDocument();
        expect(projectionCard).toBeInTheDocument();
        expect(projectionCard?.parentElement).toBe(grid);
    });

    it('ensures IfThisContinues is correctly containerized in monthly view', () => {
        vi.mocked(useFinance).mockReturnValue({
            data: {
                expenses: [],
                incomes: [],
                currentMonth: '2023-01', // Monthly view
                currency: 'USD',
                customCategories: [],
            },
            budgetSummary: {},
            setCurrentMonth: vi.fn(),
        } as any);

        render(
            <FinanceProvider>
                <Dashboard />
            </FinanceProvider>
        );

        const summaryContainer = document.querySelector('.monthly-summary-container');
        const projectionCard = document.querySelector('.projection-card');

        expect(summaryContainer).toBeInTheDocument();
        expect(projectionCard).toBeInTheDocument();
        expect(projectionCard?.parentElement).toBe(summaryContainer);
    });
});
