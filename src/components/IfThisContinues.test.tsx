import { render, screen, fireEvent } from '@testing-library/react';
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
        expect(screen.getByText(/If This Continues/i)).toBeInTheDocument();
        expect(screen.getByText(/What This Buys You/i)).toBeInTheDocument();
    });

    it('toggles content between projection stats and "what this buys" benchmarks', () => {
        render(
            <FinanceProvider>
                <IfThisContinues />
            </FinanceProvider>
        );

        // Initially on Projections tab
        expect(screen.getByText(/Savings grow by/i)).toBeInTheDocument();
        expect(screen.getByText(/Avg. Monthly Income/i)).toBeInTheDocument();
        // What this buys content should NOT be visible initially
        expect(screen.queryByText(/cover one of these milestones at a time/i)).not.toBeInTheDocument();

        // Switch to "What This Buys You" tab
        const buysTab = screen.getByRole('button', { name: /What This Buys You/i });
        fireEvent.click(buysTab);

        // Now what this buys content should be visible
        expect(screen.getByText((content) => content.includes('Your projected savings can cover') && content.includes('one') && content.includes('at a time'))).toBeInTheDocument();
        expect(screen.getByText(/Living Expenses/i)).toBeInTheDocument();
        expect(screen.getByText(/3 months/i)).toBeInTheDocument();

        // Projections content should NOT be visible now
        expect(screen.queryByText(/Savings grow by/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Avg. Monthly Income/i)).not.toBeInTheDocument();
    });

    it('converts to years when duration exceeds 18 months in the buys tab', () => {
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

        // Switch to "What This Buys You"
        fireEvent.click(screen.getByRole('button', { name: /What This Buys You/i }));

        // Projected savings = 2000 * 12 = 24000
        // Avg Coffee = 50 / 3 = 16.66
        // Months covered = 24000 / 16.66 = 1440 months = 120 years
        expect(screen.getByText(/Coffee/i)).toBeInTheDocument();
        expect(screen.getByText(/120 years/i)).toBeInTheDocument();
    });
});
