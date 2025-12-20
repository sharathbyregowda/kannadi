import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IfThisContinues from './IfThisContinues';
import { FinanceProvider, useFinance } from '../context/FinanceContext';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
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

// Mocking useFinance
vi.mock('../context/FinanceContext', async () => {
    const actual = await vi.importActual('../context/FinanceContext');
    return {
        ...actual,
        useFinance: vi.fn(),
    };
});

describe('IfThisContinues', () => {
    beforeEach(() => {
        vi.mocked(useFinance).mockReturnValue({
            data: {
                currency: 'USD',
                currentMonth: '2023-01',
                expenses: [],
                customCategories: [],
            },
            monthlyTrends: [
                { month: '2022-10', income: 1000, expenses: 800, savings: 200, needs: 500, wants: 300 },
                { month: '2022-11', income: 1000, expenses: 800, savings: 200, needs: 500, wants: 300 },
                { month: '2022-12', income: 1000, expenses: 800, savings: 200, needs: 500, wants: 300 },
            ],
        } as any);
    });

    it('renders with the correct projection card class for layout consistency', () => {
        render(
            <FinanceProvider>
                <IfThisContinues />
            </FinanceProvider>
        );

        const container = document.querySelector('.projection-card');
        expect(container).toBeInTheDocument();
    });

    it('displays the projection headline and calculated outcomes', () => {
        render(
            <FinanceProvider>
                <IfThisContinues />
            </FinanceProvider>
        );

        // Savings grow by... (200 * 12 = 2400)
        expect(screen.getByText(/Savings grow by/i)).toBeInTheDocument();
        // The amount appears in the headline and the explanation paragraph as "total savings"
        expect(screen.getByText(/your 12-month total savings is projected to be/i)).toBeInTheDocument();
        const amounts = screen.getAllByText(/\$2,400/i);
        expect(amounts.length).toBeGreaterThanOrEqual(1);

        // Verify "What This Buys You" section
        const sectionHeading = screen.getAllByText(/What This Buys You/i);
        expect(sectionHeading[0].tagName).toBe('H3');

        // 2400 / 800 (avg expenses) = 3 months
        expect(screen.getByText(/Living Expenses/i)).toBeInTheDocument();
        expect(screen.getByText(/3 months/i)).toBeInTheDocument();

        // Emergency Buffer
        expect(screen.getByText(/Emergency Buffer/i)).toBeInTheDocument();
        expect(screen.getByText(/Healthy/i)).toBeInTheDocument();
    });

    it('converts to years when duration exceeds 18 months', () => {
        vi.mocked(useFinance).mockReturnValue({
            data: {
                currency: 'USD',
                currentMonth: '2023-01',
                expenses: [{ categoryId: 'c1', amount: 50, month: '2022-10' }],
                customCategories: [{ id: 'c1', name: 'Coffee', icon: '☕' }],
            },
            monthlyTrends: [
                { month: '2022-10', income: 4000, expenses: 2000, savings: 2000, needs: 1000, wants: 1000 },
                { month: '2022-11', income: 4000, expenses: 2000, savings: 2000, needs: 1000, wants: 1000 },
                { month: '2022-12', income: 4000, expenses: 2000, savings: 2000, needs: 1000, wants: 1000 },
            ],
        } as any);

        render(
            <FinanceProvider>
                <IfThisContinues />
            </FinanceProvider>
        );

        // Projected savings = 2000 * 12 = 24000
        // Avg Coffee = 50 / 3 = 16.66
        // Months covered = 24000 / 16.66 = 1440 months = 120 years
        expect(screen.getByText(/Coffee/i)).toBeInTheDocument();
        expect(screen.getByText(/120 years/i)).toBeInTheDocument();
    });
});
