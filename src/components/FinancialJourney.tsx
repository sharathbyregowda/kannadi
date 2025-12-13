
import React, { useMemo } from 'react';
import { calculateJourneyStats, getFinancialPersona } from '../utils/journey';
import { calculateCategoryBreakdown } from '../utils/calculations';
import type { MonthlyData, Expense, CustomCategory } from '../types';

interface FinancialJourneyProps {
    data: MonthlyData[];
    expenses: Expense[];
    categories: CustomCategory[];
    currentMonth: string;
}

const FinancialJourney: React.FC<FinancialJourneyProps> = ({ data, expenses, categories, currentMonth }) => {
    // Only show if we have more than 3 months of data (user requirement)
    if (!data || data.length < 3) {
        return null;
    }

    const stats = calculateJourneyStats(data);
    const persona = getFinancialPersona(stats);

    // Calculate Top 3 for each type
    const topCategories = useMemo(() => {
        const breakdown = calculateCategoryBreakdown(expenses, categories, currentMonth);

        const getTop3 = (type: string) => {
            return breakdown
                .filter(item => item.categoryType === type)
                .slice(0, 3);
        };

        return {
            needs: getTop3('needs'),
            wants: getTop3('wants'),
            savings: getTop3('savings'),
        };
    }, [expenses, categories, currentMonth]);

    const TopItemsList = ({ items }: { items: typeof topCategories.needs }) => (
        <div className="mt-3 space-y-2">
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item.categoryId} className="flex justify-between text-xs opacity-90">
                        <span className="flex items-center gap-1">
                            <span>{item.categoryIcon}</span>
                            <span>{item.categoryName}</span>
                        </span>
                        <span className="font-mono">{Math.round(item.percentage)}%</span>
                    </div>
                ))
            ) : (
                <div className="text-xs opacity-50 italic">No data</div>
            )}
        </div>
    );

    const StatBar = ({ label, value, color, items }: { label: string; value: number; color: string, items: typeof topCategories.needs }) => (
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <div className="flex justify-between items-end">
                <span className="font-medium">{label}</span>
                <span className="text-lg font-bold" style={{ color }}>{Math.round(value)}%</span>
            </div>
            <div className="h-4 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }}
                />
            </div>
            {/* Top 3 Breakdown */}
            <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                <span className="text-xs uppercase tracking-wider opacity-60 font-semibold">Top Contributors</span>
                <TopItemsList items={items} />
            </div>
        </div>
    );

    return (
        <div className="card financial-journey-card mt-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>🏔️</span> Details of your Financial Journey
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Persona Section */}
                <div className="md:col-span-4 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] h-full flex flex-col justify-center" style={{ borderColor: persona.color }}>
                    <div className="text-5xl mb-4 text-center">{persona.icon}</div>
                    <h4 className="font-bold text-2xl mb-2 text-center" style={{ color: persona.color }}>
                        {persona.title}
                    </h4>
                    <p className="text-sm text-center opacity-90 mb-4">{persona.description}</p>
                    <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex gap-2 text-xs opacity-80">
                        <span className="shrink-0">💡</span>
                        <span className="italic">{persona.recommendation}</span>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="md:col-span-8 flex flex-col justify-center gap-6">
                    <p className="text-sm text-muted mb-2">
                        Based on your activity over the last {data.length} months. These are your cumulative averages compared to the 50/30/20 rule.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatBar label="Needs" value={stats.needsPercentage} color="#F59E0B" items={topCategories.needs} />
                        <StatBar label="Wants" value={stats.wantsPercentage} color="#A855F7" items={topCategories.wants} />
                        <StatBar label="Savings" value={stats.savingsPercentage} color="#10B981" items={topCategories.savings} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialJourney;
