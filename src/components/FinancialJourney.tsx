
import React, { useMemo } from 'react';
import { getFinancialPersona } from '../utils/journey';
import { calculateCategoryBreakdown } from '../utils/calculations';
import type { MonthlyData, Expense, CustomCategory } from '../types';

interface FinancialJourneyProps {
    data: MonthlyData[];
    expenses: Expense[];
    categories: CustomCategory[];
    currentMonth: string;
    cashBalance: number;
}

const FinancialJourney: React.FC<FinancialJourneyProps> = ({ data, expenses, categories, currentMonth, cashBalance }) => {
    // Only show if we have more than 3 months of data (user requirement)
    if (!data || data.length < 3) {
        return null;
    }

    const { persona, stats } = useMemo(() => {
        const breakdown = calculateCategoryBreakdown(expenses, categories, currentMonth);

        // Calculate Totals for Ratio from the provided expenses
        const totalIncome = data.reduce((sum, m) => sum + m.income, 0);

        // Provide safe defaults
        let needsPercent = 0, wantsPercent = 0, savingsPercent = 0;
        let tNeeds = 0, tWants = 0, tSavings = 0;

        if (totalIncome > 0) {
            const getSum = (type: string) => breakdown
                .filter(i => i.categoryType === type)
                .reduce((s, i) => s + i.total, 0);

            tNeeds = getSum('needs');
            tWants = getSum('wants');
            tSavings = getSum('savings');

            needsPercent = (tNeeds / totalIncome) * 100;
            wantsPercent = (tWants / totalIncome) * 100;
            savingsPercent = (tSavings / totalIncome) * 100;
        }

        const calculatedStats = {
            totalIncome,
            totalNeeds: tNeeds,
            totalWants: tWants,
            totalSavings: tSavings,
            needsPercentage: needsPercent,
            wantsPercentage: wantsPercent,
            savingsPercentage: savingsPercent
        };

        return {
            persona: getFinancialPersona(calculatedStats),
            stats: calculatedStats
        };
    }, [data, expenses, categories, currentMonth]);

    const topCategories = useMemo(() => {
        const breakdown = calculateCategoryBreakdown(expenses, categories, currentMonth);
        const getTop3 = (type: string) => {
            return breakdown
                .filter(item => item.categoryType === type)
                .sort((a, b) => b.total - a.total)
                .slice(0, 3);
        };
        return {
            needs: getTop3('needs'),
            wants: getTop3('wants'),
            savings: getTop3('savings'),
        };
    }, [expenses, categories, currentMonth]);

    const ratioString = `${Math.round(stats.needsPercentage)}/${Math.round(stats.wantsPercentage)}/${Math.round(stats.savingsPercentage)}`;

    // Column Card Component based on Wireframe
    const CategoryColumn = ({ title, target, current, items, color, bgClass }: { title: string, target: number, current: number, items: typeof topCategories.needs, color: string, bgClass: string }) => (
        <div className={`flex flex-col h-full rounded-xl overflow-hidden border border-[var(--border-color)] ${bgClass} transition-colors duration-300`}>
            {/* Header */}
            <div className="p-4 border-b border-black/5 dark:border-white/5 text-center">
                <h4 className="font-bold text-lg tracking-wide">{title}</h4>
            </div>

            {/* Stats: Target vs Current */}
            <div className="p-6 flex flex-col items-center gap-4">
                <div className="flex w-full justify-between px-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase tracking-wider opacity-60 font-semibold mb-1">Target</span>
                        <span className="text-xl font-medium opacity-80">{target}%</span>
                    </div>
                    <div className="w-px h-10 bg-[var(--border-color)]"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase tracking-wider opacity-60 font-semibold mb-1">Current</span>
                        <span className="text-3xl font-bold" style={{ color }}>{Math.round(current)}%</span>
                    </div>
                </div>

                {/* Progress Bar visual context */}
                <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-2">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(current, 100)}%`, backgroundColor: color }}
                    />
                </div>
            </div>

            {/* Top Contributors List */}
            <div className="p-5 pt-0 flex-grow">
                <p className="text-xs text-center uppercase tracking-wider opacity-50 font-semibold mb-4">Top Contributors</p>
                <div className="space-y-3">
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.categoryId} className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 truncate opacity-90">
                                    <span className="opacity-70">{item.categoryIcon}</span>
                                    <span>{item.categoryName}</span>
                                </span>
                                <span className="font-mono font-medium opacity-75">{Math.round(item.percentage)}%</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm opacity-40 text-center italic py-4">No data</div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="card financial-journey-card mt-8 p-0 border-none shadow-none bg-transparent">
            {/* Header Section */}
            <div className="mb-8 pl-1">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-1">
                    <span>🏔️</span> Your Financial Journey
                </h3>
                <p className="text-muted text-sm">
                    Based on your activity. Current Balance: <span className="font-mono font-semibold text-[var(--text-primary)]">{ratioString}</span> (Needs/Wants/Savings).
                </p>

                {/* Persona & Recommendation */}
                <div className="mt-4 flex flex-col gap-2">
                    {/* Inline Icon & Title */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{persona.icon}</span>
                        <h4 className="font-bold text-lg" style={{ color: persona.color }}>{persona.title}</h4>
                    </div>

                    <p className="text-sm opacity-90 max-w-2xl leading-relaxed">
                        {persona.description}
                    </p>

                    {/* Conditional Recommendation */}
                    {cashBalance > 100 && (
                        <div className="flex items-start gap-2 mt-1 text-xs opacity-80 max-w-xl">
                            <span className="shrink-0 mt-0.5">💡</span>
                            <span className="italic">{persona.recommendation} Consider investing your surplus cash for long-term growth.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CategoryColumn
                    title="Needs"
                    target={50}
                    current={stats.needsPercentage}
                    items={topCategories.needs}
                    color="#0ea5e9" // Sky blue 
                    bgClass="bg-sky-50/50 dark:bg-sky-900/10"
                />
                <CategoryColumn
                    title="Wants"
                    target={30}
                    current={stats.wantsPercentage}
                    items={topCategories.wants}
                    color="#8b5cf6" // Violet
                    bgClass="bg-violet-50/50 dark:bg-violet-900/10"
                />
                <CategoryColumn
                    title="Savings"
                    target={20}
                    current={stats.savingsPercentage}
                    items={topCategories.savings}
                    color="#10b981" // Emerald
                    bgClass="bg-emerald-50/50 dark:bg-emerald-900/10"
                />
            </div>
        </div>
    );
};

export default FinancialJourney;
