
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SavingsGoalCalculator from './SavingsGoalCalculator';
import { useFinance } from '../context/FinanceContext';
import { getAnalysisMonths } from '../utils/projections';

// Mock dependencies
vi.mock('../context/FinanceContext');
vi.mock('../utils/projections');

describe('SavingsGoalCalculator', () => {
    // Basic mock data
    const mockFinanceData = {
        data: {
            currentMonth: '2023-08',
            currency: 'USD',
            expenses: [],
            incomes: [],
        },
        monthlyTrends: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useFinance).mockReturnValue(mockFinanceData as any);
    });

    it('displays insufficient data message when history is less than 3 months', () => {
        // Mock getAnalysisMonths to return only 2 months of data
        vi.mocked(getAnalysisMonths).mockReturnValue([
            { month: '2023-07', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-06', income: 5000, expenses: 3000, savings: 2000 } as any
        ]);

        render(<SavingsGoalCalculator />);

        expect(screen.getByText(/Please refer to a month with at least 3 months/i)).toBeInTheDocument();
        expect(screen.queryByText(/Simple Savings Goal/i)).not.toBeInTheDocument();
    });

    it('renders calculator when sufficient data is available', () => {
        // Mock 3 months of data
        vi.mocked(getAnalysisMonths).mockReturnValue([
            { month: '2023-07', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-06', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-05', income: 5000, expenses: 3000, savings: 2000 } as any
        ]);

        render(<SavingsGoalCalculator />);

        expect(screen.getByText(/Simple Savings Goal/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Target Amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Timeframe/i)).toBeInTheDocument();
    });

    it('calculates "Achievable" goal correctly', () => {
        // Average savings = 2000/mo
        vi.mocked(getAnalysisMonths).mockReturnValue([
            { month: '2023-07', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-06', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-05', income: 5000, expenses: 3000, savings: 2000 } as any
        ]);

        render(<SavingsGoalCalculator />);

        // Goal: 6000 in 3 months = 2000/mo needed based on 2000 avg
        fireEvent.change(screen.getByLabelText(/Target Amount/i), { target: { value: '6000' } });
        fireEvent.change(screen.getByLabelText(/Timeframe/i), { target: { value: '3' } });

        expect(screen.getByText(/Goal Achievable/i)).toBeInTheDocument();
        expect(screen.getByText(/Goal Achievable/i)).toBeInTheDocument();
        // Match $2,000 with optional decimals - appears twice (Required & Current)
        expect(screen.getAllByText(/\$2,000(\.00)?\/mo/).length).toBeGreaterThanOrEqual(1);
    });

    it('calculates "Partially Achievable" correctly', () => {
        // Average savings = 1000/mo
        vi.mocked(getAnalysisMonths).mockReturnValue([
            { month: '2023-07', income: 5000, expenses: 4000, savings: 1000 } as any,
            { month: '2023-06', income: 5000, expenses: 4000, savings: 1000 } as any,
            { month: '2023-05', income: 5000, expenses: 4000, savings: 1000 } as any
        ]);

        render(<SavingsGoalCalculator />);

        // Goal: 6000 in 3 months = 2000/mo needed. Current is 1000/mo.
        fireEvent.change(screen.getByLabelText(/Target Amount/i), { target: { value: '6000' } });
        fireEvent.change(screen.getByLabelText(/Timeframe/i), { target: { value: '3' } });

        expect(screen.getByText(/Partially Achievable/i)).toBeInTheDocument();
        // Should suggest it takes 6 months (6000 / 1000)
        expect(screen.getByText(/would need 6 months/i)).toBeInTheDocument();
    });

    it('calculates "Changes Required" correctly', () => {
        // Average savings = 0/mo (spending all income)
        vi.mocked(getAnalysisMonths).mockReturnValue([
            { month: '2023-07', income: 5000, expenses: 5000, savings: 0 } as any,
            { month: '2023-06', income: 5000, expenses: 5000, savings: 0 } as any,
            { month: '2023-05', income: 5000, expenses: 5000, savings: 0 } as any
        ]);

        render(<SavingsGoalCalculator />);

        // Goal: Any goal is impossible with 0 savings
        fireEvent.change(screen.getByLabelText(/Target Amount/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByLabelText(/Timeframe/i), { target: { value: '3' } });

        expect(screen.getByText(/Changes Required/i)).toBeInTheDocument();
        expect(screen.getByText(/not achievable without changes/i)).toBeInTheDocument();
    });

    it('validates min/max timeframe inputs', () => {
        vi.mocked(getAnalysisMonths).mockReturnValue([
            { month: '2023-07', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-06', income: 5000, expenses: 3000, savings: 2000 } as any,
            { month: '2023-05', income: 5000, expenses: 3000, savings: 2000 } as any
        ]);

        render(<SavingsGoalCalculator />);

        const targetInput = screen.getByLabelText(/Target Amount/i);
        const timeInput = screen.getByLabelText(/Timeframe/i);

        fireEvent.change(targetInput, { target: { value: '5000' } });

        // Too short (< 3)
        fireEvent.change(timeInput, { target: { value: '2' } });
        expect(screen.queryByText(/Goal Achievable/i)).not.toBeInTheDocument();

        // Too long (> 36)
        fireEvent.change(timeInput, { target: { value: '37' } });
        expect(screen.queryByText(/Goal Achievable/i)).not.toBeInTheDocument();

        // Valid (3)
        fireEvent.change(timeInput, { target: { value: '3' } });
        expect(screen.getByText(/Goal Achievable/i)).toBeInTheDocument();
    });
});
