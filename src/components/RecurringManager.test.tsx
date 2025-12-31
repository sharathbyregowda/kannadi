import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecurringManager from './RecurringManager';
import { useFinance } from '../context/FinanceContext';
import { ExpenseCategory } from '../types';

// Mock dependencies
vi.mock('../context/FinanceContext');

describe('RecurringManager', () => {
    // Mock functions
    const mockAddRecurringTransaction = vi.fn();
    const mockUpdateRecurringTransaction = vi.fn();
    const mockDeleteRecurringTransaction = vi.fn();
    const mockGetCategoryHierarchy = vi.fn();

    // Sample categories for testing
    const mockCategories = [
        { id: 'cat-1', name: 'Housing', icon: '🏠', type: ExpenseCategory.NEEDS },
        { id: 'cat-2', name: 'Entertainment', icon: '🎬', type: ExpenseCategory.WANTS },
        { id: 'cat-3', name: 'Savings Account', icon: '🏦', type: ExpenseCategory.SAVINGS },
        { id: 'sub-1', name: 'Mortgage', icon: '🏡', type: ExpenseCategory.NEEDS, parentId: 'cat-1', isSubcategory: true },
        { id: 'sub-2', name: 'Streaming', icon: '📺', type: ExpenseCategory.WANTS, parentId: 'cat-2', isSubcategory: true },
        { id: 'income-1', name: 'Salary', icon: '💰', type: ExpenseCategory.INCOME },
    ];

    // Sample recurring transactions
    const mockRecurringTransactions = [
        {
            id: 'rt-1',
            type: 'income' as const,
            amount: 5000,
            source: 'Salary',
            frequency: 'monthly' as const,
            dayOfMonth: 1,
            isActive: true,
            createdAt: '2024-01-01',
        },
        {
            id: 'rt-2',
            type: 'expense' as const,
            amount: 1500,
            description: 'Monthly Rent',
            categoryId: 'cat-1',
            frequency: 'monthly' as const,
            dayOfMonth: 5,
            isActive: true,
            createdAt: '2024-01-01',
        },
        {
            id: 'rt-3',
            type: 'expense' as const,
            amount: 15,
            description: 'Netflix',
            categoryId: 'cat-2',
            subcategoryId: 'sub-2',
            frequency: 'monthly' as const,
            dayOfMonth: 15,
            isActive: true,
            createdAt: '2024-01-01',
        },
    ];

    const createMockFinanceData = (overrides = {}) => ({
        addRecurringTransaction: mockAddRecurringTransaction,
        updateRecurringTransaction: mockUpdateRecurringTransaction,
        deleteRecurringTransaction: mockDeleteRecurringTransaction,
        getCategoryHierarchy: mockGetCategoryHierarchy,
        data: {
            customCategories: mockCategories,
            currency: 'USD',
            incomes: [],
            expenses: [],
            currentMonth: '2024-01',
            recurringTransactions: mockRecurringTransactions,
            version: 4,
            isOnboarded: true,
            ...overrides
        }
    });

    beforeEach(() => {
        vi.clearAllMocks();

        // Default category hierarchy return value
        mockGetCategoryHierarchy.mockReturnValue([
            {
                category: mockCategories[0], // Housing
                subcategories: [mockCategories[3]] // Mortgage
            },
            {
                category: mockCategories[1], // Entertainment
                subcategories: [mockCategories[4]] // Streaming
            },
            {
                category: mockCategories[2], // Savings Account
                subcategories: []
            }
        ]);

        vi.mocked(useFinance).mockReturnValue(createMockFinanceData() as any);
    });

    // ==========================================
    // RENDERING TESTS
    // ==========================================
    describe('Rendering', () => {
        it('should render Recurring Transactions header', () => {
            render(<RecurringManager />);
            expect(screen.getByText('Recurring Transactions')).toBeInTheDocument();
        });

        it('should render Recurring Income section', () => {
            render(<RecurringManager />);
            expect(screen.getByText('💰 Recurring Income')).toBeInTheDocument();
        });

        it('should render Recurring Expenses section', () => {
            render(<RecurringManager />);
            expect(screen.getByText('📅 Recurring Expenses')).toBeInTheDocument();
        });

        it('should render monthly summary when transactions exist', () => {
            render(<RecurringManager />);
            expect(screen.getByText('Monthly Summary')).toBeInTheDocument();
            expect(screen.getByText('Recurring Income')).toBeInTheDocument();
            expect(screen.getByText('Recurring Expenses')).toBeInTheDocument();
            expect(screen.getByText('Net Recurring')).toBeInTheDocument();
        });

        it('should display existing recurring income', () => {
            render(<RecurringManager />);
            expect(screen.getByText('Salary')).toBeInTheDocument();
            // +$5,000 appears in list and summary, so use getAllByText
            const incomeAmounts = screen.getAllByText('+$5,000');
            expect(incomeAmounts.length).toBeGreaterThan(0);
        });

        it('should display existing recurring expenses', () => {
            render(<RecurringManager />);
            expect(screen.getByText('Monthly Rent')).toBeInTheDocument();
            expect(screen.getByText('-$1,500')).toBeInTheDocument();
        });

        it('should display day of month for transactions', () => {
            render(<RecurringManager />);
            // There are multiple transactions with different days
            const dayTexts = screen.getAllByText(/of each month/);
            expect(dayTexts.length).toBeGreaterThanOrEqual(3);
        });

        it('should show empty state when no recurring income', () => {
            vi.mocked(useFinance).mockReturnValue(createMockFinanceData({
                recurringTransactions: mockRecurringTransactions.filter(rt => rt.type !== 'income')
            }) as any);
            render(<RecurringManager />);
            expect(screen.getByText('No recurring income set up yet')).toBeInTheDocument();
        });

        it('should show empty state when no recurring expenses', () => {
            vi.mocked(useFinance).mockReturnValue(createMockFinanceData({
                recurringTransactions: mockRecurringTransactions.filter(rt => rt.type !== 'expense')
            }) as any);
            render(<RecurringManager />);
            expect(screen.getByText('No recurring expenses set up yet')).toBeInTheDocument();
        });
    });

    // ==========================================
    // SUBCATEGORY DROPDOWN TESTS (KEY FIX)
    // ==========================================
    describe('Subcategory Dropdown', () => {
        it('should render category options grouped by type when adding expense', () => {
            const { container } = render(<RecurringManager />);

            // Click Add button for expenses
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]); // Second Add button is for expenses

            // Check for category optgroup labels
            const optgroups = container.querySelectorAll('optgroup');
            const labels = Array.from(optgroups).map(og => og.getAttribute('label'));

            expect(labels).toContain('Needs (50%)');
            expect(labels).toContain('Wants (30%)');
            expect(labels).toContain('Savings (20%)');
        });

        it('should include subcategories under parent categories', () => {
            render(<RecurringManager />);

            // Click Add button for expenses
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // The subcategories should be present
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0]; // First combobox is the category select
            const options = categorySelect.querySelectorAll('option');

            // Should have: default + Housing + Mortgage (sub) + Entertainment + Streaming (sub) + Savings Account
            expect(options.length).toBeGreaterThanOrEqual(6);
        });

        it('should display subcategory with arrow indentation', () => {
            render(<RecurringManager />);

            // Click Add button for expenses
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Check for indented subcategory options (contains arrow character)
            expect(screen.getByText(/↳.*Mortgage/)).toBeInTheDocument();
            expect(screen.getByText(/↳.*Streaming/)).toBeInTheDocument();
        });

        it('should have Select Category placeholder option', () => {
            render(<RecurringManager />);

            // Click Add button for expenses
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            expect(screen.getByText('Select Category...')).toBeInTheDocument();
        });
    });

    // ==========================================
    // ADD RECURRING EXPENSE WITH SUBCATEGORY
    // ==========================================
    describe('Add Recurring Expense with Subcategory', () => {
        it('should add expense with parent category only', () => {
            render(<RecurringManager />);

            // Open expense form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Select parent category (no subcategory)
            const selects = screen.getAllByRole('combobox');
            fireEvent.change(selects[0], { target: { value: 'cat-1' } });

            // Enter amount
            const amountInput = screen.getByPlaceholderText('Amount');
            fireEvent.change(amountInput, { target: { value: '500' } });

            // Submit
            const submitButton = screen.getByText('Add Expense');
            fireEvent.click(submitButton);

            expect(mockAddRecurringTransaction).toHaveBeenCalledWith(expect.objectContaining({
                type: 'expense',
                amount: 500,
                categoryId: 'cat-1',
                subcategoryId: undefined,
            }));
        });

        it('should add expense with subcategory', () => {
            render(<RecurringManager />);

            // Open expense form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Select subcategory (format: parentId:subId)
            const selects = screen.getAllByRole('combobox');
            fireEvent.change(selects[0], { target: { value: 'cat-1:sub-1' } });

            // Enter amount
            const amountInput = screen.getByPlaceholderText('Amount');
            fireEvent.change(amountInput, { target: { value: '1200' } });

            // Enter description
            const descInput = screen.getByPlaceholderText('Description (optional)');
            fireEvent.change(descInput, { target: { value: 'Monthly Mortgage' } });

            // Submit
            const submitButton = screen.getByText('Add Expense');
            fireEvent.click(submitButton);

            expect(mockAddRecurringTransaction).toHaveBeenCalledWith(expect.objectContaining({
                type: 'expense',
                amount: 1200,
                description: 'Monthly Mortgage',
                categoryId: 'cat-1',
                subcategoryId: 'sub-1',
                frequency: 'monthly',
                isActive: true,
            }));
        });

        it('should reset form after adding expense', () => {
            render(<RecurringManager />);

            // Open expense form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Fill and submit
            const selects = screen.getAllByRole('combobox');
            fireEvent.change(selects[0], { target: { value: 'cat-2:sub-2' } });

            const amountInput = screen.getByPlaceholderText('Amount');
            fireEvent.change(amountInput, { target: { value: '15' } });

            const submitButton = screen.getByText('Add Expense');
            fireEvent.click(submitButton);

            // Form should close
            expect(screen.queryByPlaceholderText('Amount')).not.toBeInTheDocument();
        });

        it('should not add expense without category', () => {
            render(<RecurringManager />);

            // Open expense form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Enter amount but no category
            const amountInput = screen.getByPlaceholderText('Amount');
            fireEvent.change(amountInput, { target: { value: '100' } });

            // Submit
            const submitButton = screen.getByText('Add Expense');
            fireEvent.click(submitButton);

            expect(mockAddRecurringTransaction).not.toHaveBeenCalled();
        });

        it('should not add expense without amount', () => {
            render(<RecurringManager />);

            // Open expense form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Select category but no amount
            const selects = screen.getAllByRole('combobox');
            fireEvent.change(selects[0], { target: { value: 'cat-1' } });

            // Submit
            const submitButton = screen.getByText('Add Expense');
            fireEvent.click(submitButton);

            expect(mockAddRecurringTransaction).not.toHaveBeenCalled();
        });
    });

    // ==========================================
    // DISPLAY SUBCATEGORY IN LIST
    // ==========================================
    describe('Display Subcategory in List', () => {
        it('should display category with subcategory arrow notation', () => {
            render(<RecurringManager />);

            // The third recurring transaction has a subcategory (Netflix -> Streaming)
            // Should display as: Entertainment → Streaming or similar
            expect(screen.getByText(/Entertainment.*→.*Streaming/)).toBeInTheDocument();
        });

        it('should display category only when no subcategory', () => {
            render(<RecurringManager />);

            // Monthly Rent has no subcategory, should show just Housing
            // Using getAllByText since Housing appears in multiple places
            const housingElements = screen.getAllByText(/Housing/);
            expect(housingElements.length).toBeGreaterThan(0);
        });
    });

    // ==========================================
    // ADD RECURRING INCOME
    // ==========================================
    describe('Add Recurring Income', () => {
        it('should add recurring income', () => {
            render(<RecurringManager />);

            // Open income form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[0]); // First Add button is for income

            // Select source
            const sourceSelect = screen.getAllByRole('combobox')[0];
            fireEvent.change(sourceSelect, { target: { value: 'Salary' } });

            // Enter amount
            const amountInput = screen.getByPlaceholderText('Amount');
            fireEvent.change(amountInput, { target: { value: '5000' } });

            // Submit
            const submitButton = screen.getByText('Add Income');
            fireEvent.click(submitButton);

            expect(mockAddRecurringTransaction).toHaveBeenCalledWith(expect.objectContaining({
                type: 'income',
                amount: 5000,
                source: 'Salary',
            }));
        });

        it('should close income form on cancel', () => {
            render(<RecurringManager />);

            // Open income form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[0]);

            // Verify form is open
            expect(screen.getByText('Add Income')).toBeInTheDocument();

            // Click cancel
            const cancelButton = screen.getByText('Cancel');
            fireEvent.click(cancelButton);

            // Form should close (Add Income button should be gone)
            expect(screen.queryByPlaceholderText('Amount')).not.toBeInTheDocument();
        });
    });

    // ==========================================
    // TOGGLE ACTIVE STATE
    // ==========================================
    describe('Toggle Active State', () => {
        it('should toggle transaction active state', () => {
            render(<RecurringManager />);

            // Find toggle buttons (ToggleRight icons for active transactions)
            const toggleButtons = screen.getAllByTitle('Pause');
            fireEvent.click(toggleButtons[0]);

            expect(mockUpdateRecurringTransaction).toHaveBeenCalledWith('rt-1', { isActive: false });
        });

        it('should display inactive transaction with reduced opacity', () => {
            vi.mocked(useFinance).mockReturnValue(createMockFinanceData({
                recurringTransactions: [
                    { ...mockRecurringTransactions[0], isActive: false }
                ]
            }) as any);

            const { container } = render(<RecurringManager />);
            const item = container.querySelector('.recurring-item');
            expect(item).toHaveStyle({ opacity: '0.6' });
        });
    });

    // ==========================================
    // DELETE RECURRING TRANSACTION
    // ==========================================
    describe('Delete Recurring Transaction', () => {
        it('should show confirmation when delete clicked', () => {
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
            render(<RecurringManager />);

            const deleteButtons = screen.getAllByTitle('Delete');
            fireEvent.click(deleteButtons[0]);

            expect(confirmSpy).toHaveBeenCalledWith('Delete this recurring transaction? Already-created transactions will not be affected.');
            confirmSpy.mockRestore();
        });

        it('should delete when confirmed', () => {
            vi.spyOn(window, 'confirm').mockReturnValue(true);
            render(<RecurringManager />);

            const deleteButtons = screen.getAllByTitle('Delete');
            fireEvent.click(deleteButtons[0]);

            expect(mockDeleteRecurringTransaction).toHaveBeenCalledWith('rt-1');
        });

        it('should not delete when cancelled', () => {
            vi.spyOn(window, 'confirm').mockReturnValue(false);
            render(<RecurringManager />);

            const deleteButtons = screen.getAllByTitle('Delete');
            fireEvent.click(deleteButtons[0]);

            expect(mockDeleteRecurringTransaction).not.toHaveBeenCalled();
        });
    });

    // ==========================================
    // EDIT RECURRING TRANSACTION
    // ==========================================
    describe('Edit Recurring Transaction', () => {
        it('should enter edit mode when edit clicked', () => {
            render(<RecurringManager />);

            const editButtons = screen.getAllByTitle('Edit');
            fireEvent.click(editButtons[0]);

            // Should see input fields in edit mode
            expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Salary')).toBeInTheDocument();
        });

        it('should save edited values', () => {
            render(<RecurringManager />);

            const editButtons = screen.getAllByTitle('Edit');
            fireEvent.click(editButtons[0]);

            // Change amount
            const amountInput = screen.getByDisplayValue('5000');
            fireEvent.change(amountInput, { target: { value: '5500' } });

            // Save
            const saveButton = screen.getByTitle('Save');
            fireEvent.click(saveButton);

            expect(mockUpdateRecurringTransaction).toHaveBeenCalledWith('rt-1', expect.objectContaining({
                amount: 5500,
            }));
        });

        it('should cancel edit mode', () => {
            render(<RecurringManager />);

            const editButtons = screen.getAllByTitle('Edit');
            fireEvent.click(editButtons[0]);

            // Click cancel
            const cancelButton = screen.getByTitle('Cancel');
            fireEvent.click(cancelButton);

            // Should exit edit mode
            expect(screen.queryByDisplayValue('5000')).not.toBeInTheDocument();
        });
    });

    // ==========================================
    // MONTHLY SUMMARY CALCULATIONS
    // ==========================================
    describe('Monthly Summary', () => {
        it('should calculate recurring income total', () => {
            render(<RecurringManager />);
            // +$5,000 appears in both the list and summary section
            const incomeAmounts = screen.getAllByText('+$5,000');
            expect(incomeAmounts.length).toBeGreaterThanOrEqual(1);
        });

        it('should calculate recurring expenses total', () => {
            render(<RecurringManager />);
            // Total expenses: 1500 + 15 = 1515
            expect(screen.getByText('-$1,515')).toBeInTheDocument();
        });

        it('should calculate net recurring', () => {
            render(<RecurringManager />);
            // Net: 5000 - 1515 = 3485
            expect(screen.getByText('$3,485')).toBeInTheDocument();
        });

        it('should exclude inactive transactions from summary', () => {
            vi.mocked(useFinance).mockReturnValue(createMockFinanceData({
                recurringTransactions: [
                    { ...mockRecurringTransactions[0], isActive: false },
                    ...mockRecurringTransactions.slice(1)
                ]
            }) as any);

            render(<RecurringManager />);

            // Income should be 0 since only income transaction is inactive
            expect(screen.getByText('+$0')).toBeInTheDocument();
        });

        it('should not show summary when no transactions', () => {
            vi.mocked(useFinance).mockReturnValue(createMockFinanceData({
                recurringTransactions: []
            }) as any);

            render(<RecurringManager />);
            expect(screen.queryByText('Monthly Summary')).not.toBeInTheDocument();
        });
    });

    // ==========================================
    // DAY OF MONTH SELECTION
    // ==========================================
    describe('Day of Month Selection', () => {
        it('should allow selecting day of month for expense', () => {
            render(<RecurringManager />);

            // Open expense form
            const addButtons = screen.getAllByText('Add');
            fireEvent.click(addButtons[1]);

            // Find day select (last combobox in the form)
            const selects = screen.getAllByRole('combobox');
            const daySelect = selects[selects.length - 1];

            fireEvent.change(daySelect, { target: { value: '15' } });

            // Fill required fields and submit
            const categorySelect = selects[0];
            fireEvent.change(categorySelect, { target: { value: 'cat-1' } });

            const amountInput = screen.getByPlaceholderText('Amount');
            fireEvent.change(amountInput, { target: { value: '100' } });

            const submitButton = screen.getByText('Add Expense');
            fireEvent.click(submitButton);

            expect(mockAddRecurringTransaction).toHaveBeenCalledWith(expect.objectContaining({
                dayOfMonth: 15,
            }));
        });

        it('should display ordinal day labels (1st, 2nd, 3rd, etc)', () => {
            render(<RecurringManager />);
            // Verify multiple day labels exist  
            const dayLabels = screen.getAllByText(/of each month/);
            expect(dayLabels.length).toBeGreaterThanOrEqual(3);
            // Verify specific ordinal formats exist
            expect(screen.getByText(/1st.*of each month/)).toBeInTheDocument();
        });
    });
});
