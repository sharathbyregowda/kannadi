import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import OnboardingPage from './OnboardingPage';

// Mock the context
const mockCompleteOnboarding = vi.fn();
const mockSetCurrency = vi.fn();
const mockData = {
    currency: 'USD',
    expenses: [],
    incomes: [],
    customCategories: [],
    currentMonth: '2023-01',
    isOnboarded: false
};

vi.mock('../context/FinanceContext', async () => {
    const actual = await vi.importActual('../context/FinanceContext');
    return {
        ...actual,
        useFinance: () => ({
            data: mockData,
            setCurrency: mockSetCurrency,
            completeOnboarding: mockCompleteOnboarding,
            addCategory: vi.fn(),
            addSubcategory: vi.fn(),
            updateCategory: vi.fn(),
            deleteCategory: vi.fn(),
            getCategoryHierarchy: () => [],
            // Mock other methods needed by child components if any
            addIncome: vi.fn(),
            addExpense: vi.fn(),
            getSubcategories: () => [],
        }),
    };
});

// Mock child components that are complex or not focus of this test
vi.mock('../components/CategoryManager', () => ({ default: () => <div data-testid="category-manager">Category Manager</div> }));
vi.mock('../components/IncomeForm', () => ({ default: () => <div data-testid="income-form">Income Form</div> }));
vi.mock('../components/ExpenseLedger', () => ({ default: () => <div data-testid="expense-ledger">Expense Ledger</div> }));

describe('OnboardingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the first step (Currency) initially', () => {
        render(
            <BrowserRouter>
                <OnboardingPage />
            </BrowserRouter>
        );
        expect(screen.getByText(/Review your money/i)).toBeInTheDocument();
        expect(screen.getByText(/Choose your Currency/i)).toBeInTheDocument();
    });

    it('navigates through the steps', () => {
        render(
            <BrowserRouter>
                <OnboardingPage />
            </BrowserRouter>
        );

        // Step 1 -> 2
        fireEvent.click(screen.getByText(/Next: Review Categories/i));
        expect(screen.getByText(/Step 2: Review Categories/i)).toBeInTheDocument();

        // Step 2 -> 3
        fireEvent.click(screen.getByText(/Next: Add Income/i));
        expect(screen.getByText(/Step 3: Add Income/i)).toBeInTheDocument();

        // Step 3 -> 4
        fireEvent.click(screen.getByText(/Next: Add Expenses/i));
        expect(screen.getByText(/Step 4: Add Expenses/i)).toBeInTheDocument();

        // Step 4 -> 5
        fireEvent.click(screen.getByText(/Next: See Your Data/i));
        expect(screen.getByText(/Step 5: See Your Data Come Alive/i)).toBeInTheDocument();
    });

    it('calls completeOnboarding when finished', () => {
        render(
            <BrowserRouter>
                <OnboardingPage />
            </BrowserRouter>
        );

        // Fast forward to last step
        fireEvent.click(screen.getByText(/Next/i)); // 1->2
        fireEvent.click(screen.getByText(/Next/i)); // 2->3
        fireEvent.click(screen.getByText(/Next/i)); // 3->4
        fireEvent.click(screen.getByText(/Next/i)); // 4->5

        fireEvent.click(screen.getByText(/View Dashboard/i));
        expect(mockCompleteOnboarding).toHaveBeenCalled();
    });
});
