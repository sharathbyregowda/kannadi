import type { CustomCategory } from '../types';
import { ExpenseCategory } from '../types';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
    // Needs (50%)
    { id: 'cat-1', name: 'Housing/Rent', type: ExpenseCategory.NEEDS, icon: '🏠', color: '#F59E0B' },
    { id: 'cat-2', name: 'Utilities', type: ExpenseCategory.NEEDS, icon: '💡', color: '#F59E0B' },
    { id: 'cat-3', name: 'Groceries', type: ExpenseCategory.NEEDS, icon: '🛒', color: '#F59E0B' },
    { id: 'cat-4', name: 'Transportation', type: ExpenseCategory.NEEDS, icon: '🚗', color: '#F59E0B' },
    { id: 'cat-5', name: 'Insurance', type: ExpenseCategory.NEEDS, icon: '🛡️', color: '#F59E0B' },
    { id: 'cat-6', name: 'Healthcare', type: ExpenseCategory.NEEDS, icon: '⚕️', color: '#F59E0B' },
    { id: 'cat-7', name: 'Debt Payments', type: ExpenseCategory.NEEDS, icon: '💳', color: '#F59E0B' },
    { id: 'cat-18', name: 'Pets', type: ExpenseCategory.NEEDS, icon: '🐾', color: '#F59E0B' },

    // Wants (30%)
    { id: 'cat-8', name: 'Eating Out / Takeaway', type: ExpenseCategory.WANTS, icon: '🥡', color: '#A855F7' },
    { id: 'cat-9', name: 'Entertainment', type: ExpenseCategory.WANTS, icon: '🎬', color: '#A855F7' },
    { id: 'cat-10', name: 'Shopping', type: ExpenseCategory.WANTS, icon: '🛍️', color: '#A855F7' },
    { id: 'cat-11', name: 'Subscriptions', type: ExpenseCategory.WANTS, icon: '📺', color: '#A855F7' },
    { id: 'cat-12', name: 'Hobbies', type: ExpenseCategory.WANTS, icon: '🎨', color: '#A855F7' },
    { id: 'cat-13', name: 'Holiday', type: ExpenseCategory.WANTS, icon: '✈️', color: '#A855F7' },

    // Savings (20%)
    { id: 'cat-14', name: 'Emergency Fund', type: ExpenseCategory.SAVINGS, icon: '🏦', color: '#10B981' },
    { id: 'cat-15', name: 'Investments', type: ExpenseCategory.SAVINGS, icon: '📈', color: '#10B981' },
    { id: 'cat-16', name: 'Pension', type: ExpenseCategory.SAVINGS, icon: '👴', color: '#10B981' },
    { id: 'cat-17', name: 'Savings Account', type: ExpenseCategory.SAVINGS, icon: '💰', color: '#10B981' },

    // Income
    { id: 'cat-income-1', name: 'Husband Salary', type: ExpenseCategory.INCOME, icon: '👨‍💼', color: '#10B981' },
    { id: 'cat-income-2', name: 'Wife Salary', type: ExpenseCategory.INCOME, icon: '👩‍💼', color: '#10B981' },
    { id: 'cat-income-3', name: 'Dividends', type: ExpenseCategory.INCOME, icon: '📈', color: '#10B981' },
    { id: 'cat-income-4', name: 'Bank Interest', type: ExpenseCategory.INCOME, icon: '🏦', color: '#10B981' },

    // Default Subcategories (UK Context)
    // Utilities
    { id: 'sub-util-1', name: 'Council Tax', type: ExpenseCategory.NEEDS, icon: '🏛️', parentId: 'cat-2', isSubcategory: true },
    { id: 'sub-util-2', name: 'Water Bill', type: ExpenseCategory.NEEDS, icon: '💧', parentId: 'cat-2', isSubcategory: true },
    { id: 'sub-util-3', name: 'Electricity & Gas', type: ExpenseCategory.NEEDS, icon: '⚡', parentId: 'cat-2', isSubcategory: true },
    { id: 'sub-util-4', name: 'Broadband', type: ExpenseCategory.NEEDS, icon: '🌐', parentId: 'cat-2', isSubcategory: true },
    { id: 'sub-util-5', name: 'Mobile Phone', type: ExpenseCategory.NEEDS, icon: '📱', parentId: 'cat-2', isSubcategory: true },
    { id: 'sub-util-6', name: 'TV Licence', type: ExpenseCategory.NEEDS, icon: '📺', parentId: 'cat-2', isSubcategory: true },

    // Groceries
    { id: 'sub-groc-1', name: 'High Street Supermarkets', type: ExpenseCategory.NEEDS, icon: '🛒', parentId: 'cat-3', isSubcategory: true },
    { id: 'sub-groc-2', name: 'Costco', type: ExpenseCategory.NEEDS, icon: '🏬', parentId: 'cat-3', isSubcategory: true },
    { id: 'sub-groc-3', name: 'Market/Bakery', type: ExpenseCategory.NEEDS, icon: '🥖', parentId: 'cat-3', isSubcategory: true },

    // Transportation
    { id: 'sub-trans-1', name: 'Petrol/Diesel', type: ExpenseCategory.NEEDS, icon: '⛽', parentId: 'cat-4', isSubcategory: true },
    { id: 'sub-trans-2', name: 'Public Transport', type: ExpenseCategory.NEEDS, icon: '🚌', parentId: 'cat-4', isSubcategory: true },
    { id: 'sub-trans-3', name: 'Car Insurance', type: ExpenseCategory.NEEDS, icon: '🛡️', parentId: 'cat-4', isSubcategory: true },
    { id: 'sub-trans-4', name: 'Road Tax', type: ExpenseCategory.NEEDS, icon: '🧾', parentId: 'cat-4', isSubcategory: true },
    { id: 'sub-trans-5', name: 'MOT', type: ExpenseCategory.NEEDS, icon: '🔧', parentId: 'cat-4', isSubcategory: true },
    { id: 'sub-trans-6', name: 'Car Service', type: ExpenseCategory.NEEDS, icon: '⚙️', parentId: 'cat-4', isSubcategory: true },

    // Investments
    { id: 'sub-inv-1', name: 'ISA', type: ExpenseCategory.SAVINGS, icon: '💰', parentId: 'cat-15', isSubcategory: true },
    { id: 'sub-inv-2', name: 'Premium Bonds', type: ExpenseCategory.SAVINGS, icon: '🎫', parentId: 'cat-15', isSubcategory: true },
    { id: 'sub-inv-3', name: 'Stocks & Shares', type: ExpenseCategory.SAVINGS, icon: '📊', parentId: 'cat-15', isSubcategory: true },

    // Pets
    { id: 'sub-pets-1', name: 'Food', type: ExpenseCategory.NEEDS, icon: '🦴', parentId: 'cat-18', isSubcategory: true },
    { id: 'sub-pets-2', name: 'Vet/Medical', type: ExpenseCategory.NEEDS, icon: '⚕️', parentId: 'cat-18', isSubcategory: true },
    { id: 'sub-pets-3', name: 'Grooming', type: ExpenseCategory.NEEDS, icon: '✂️', parentId: 'cat-18', isSubcategory: true },
    { id: 'sub-pets-4', name: 'Supplies', type: ExpenseCategory.NEEDS, icon: '💩', parentId: 'cat-18', isSubcategory: true },
    { id: 'sub-pets-5', name: 'Treats', type: ExpenseCategory.NEEDS, icon: '🍪', parentId: 'cat-18', isSubcategory: true },

    // Housing / Rent (New OOTB)
    { id: 'sub-house-1', name: 'Mortgage', type: ExpenseCategory.NEEDS, icon: '🏠', parentId: 'cat-1', isSubcategory: true },
    { id: 'sub-house-2', name: 'Household maintenance', type: ExpenseCategory.NEEDS, icon: '🔧', parentId: 'cat-1', isSubcategory: true },

    // Eating Out / Takeaway (New OOTB)
    { id: 'sub-eat-1', name: 'Eating out', type: ExpenseCategory.WANTS, icon: '🍽️', parentId: 'cat-8', isSubcategory: true },
    { id: 'sub-eat-2', name: 'Drinks/Coffee/Tea', type: ExpenseCategory.WANTS, icon: '☕', parentId: 'cat-8', isSubcategory: true },
    { id: 'sub-eat-3', name: 'Takeaways', type: ExpenseCategory.WANTS, icon: '🥡', parentId: 'cat-8', isSubcategory: true },
    { id: 'sub-eat-4', name: 'Day outs', type: ExpenseCategory.WANTS, icon: '🎢', parentId: 'cat-8', isSubcategory: true },

    // Subscriptions (New OOTB)
    { id: 'sub-sub-1', name: 'Netflix', type: ExpenseCategory.WANTS, icon: '📺', parentId: 'cat-11', isSubcategory: true },
    { id: 'sub-sub-2', name: 'Amazon', type: ExpenseCategory.WANTS, icon: '📦', parentId: 'cat-11', isSubcategory: true },
    { id: 'sub-sub-3', name: 'VPN', type: ExpenseCategory.WANTS, icon: '🔒', parentId: 'cat-11', isSubcategory: true },
    { id: 'sub-sub-4', name: 'Spotify', type: ExpenseCategory.WANTS, icon: '🎧', parentId: 'cat-11', isSubcategory: true },

    // Holiday (New OOTB)
    { id: 'sub-hol-1', name: 'Airfare', type: ExpenseCategory.WANTS, icon: '✈️', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-2', name: 'Hotels', type: ExpenseCategory.WANTS, icon: '🏨', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-3', name: 'Food', type: ExpenseCategory.WANTS, icon: '🍽️', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-4', name: 'Transportation', type: ExpenseCategory.WANTS, icon: '🚕', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-5', name: 'ATM Withdrawals', type: ExpenseCategory.WANTS, icon: '🏧', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-6', name: 'Shopping', type: ExpenseCategory.WANTS, icon: '🛍️', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-7', name: 'Pet Care', type: ExpenseCategory.WANTS, icon: '🐾', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-8', name: 'Sights', type: ExpenseCategory.WANTS, icon: '📸', parentId: 'cat-13', isSubcategory: true },
    { id: 'sub-hol-9', name: 'Airport Parking', type: ExpenseCategory.WANTS, icon: '🅿️', parentId: 'cat-13', isSubcategory: true },
];
