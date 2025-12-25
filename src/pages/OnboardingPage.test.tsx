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
            addIncome: vi.fn(),
            addExpense: vi.fn(),
            getSubcategories: () => [],
        }),
    };
});

// Mock child components
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
        expect(screen.getByText(/Review your money/i)).toBeDefined();
        expect(screen.getByText(/Choose your Currency/i)).toBeDefined();
    });

    it('navigates through the steps', () => {
        render(
            <BrowserRouter>
                <OnboardingPage />
            </BrowserRouter>
        );

        // Step 1 -> 2
        fireEvent.click(screen.getByText(/Get Started/i));
        expect(screen.getByText(/Review Categories/i)).toBeDefined();

        // Step 2 -> 3
        fireEvent.click(screen.getByText(/Next: Add Income/i));
        expect(screen.getByText(/Add Income/i)).toBeDefined();

        // Step 3 -> 4
        fireEvent.click(screen.getByText(/Next: Add Expenses/i));
        expect(screen.getByText(/Add Expenses/i)).toBeDefined();

        // Step 4 -> 5
        fireEvent.click(screen.getByText(/See Your Data/i));
        expect(screen.getByText(/Step 5/i)).toBeDefined();
    });

    it('calls completeOnboarding when finished', () => {
        render(
            <BrowserRouter>
                <OnboardingPage />
            </BrowserRouter>
        );

        // Fast forward to last step
        fireEvent.click(screen.getByText(/Get Started/i)); // 1->2
        fireEvent.click(screen.getByText(/Next: Add Income/i)); // 2->3
        fireEvent.click(screen.getByText(/Next: Add Expenses/i)); // 3->4
        fireEvent.click(screen.getByText(/See Your Data/i)); // 4->5

        fireEvent.click(screen.getByText(/Go to Dashboard/i));
        expect(mockCompleteOnboarding).toHaveBeenCalled();
    });
});
