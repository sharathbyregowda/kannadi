
import React, { useMemo, useState } from 'react';
import { getFinancialPersona } from '../utils/journey';
import { calculateCategoryBreakdown } from '../utils/calculations';
import type { MonthlyData, Expense, CustomCategory, BudgetSummary } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FinancialJourneyProps {
    data: MonthlyData[];
    expenses: Expense[];
    categories: CustomCategory[];
    currentMonth: string;
    budgetSummary: BudgetSummary;
    cashBalance: number;
}

const FinancialJourney: React.FC<FinancialJourneyProps> = ({ data, expenses, categories, currentMonth, budgetSummary, cashBalance }) => {
    // Only show if we have more than 3 months of data (user requirement)
    if (!data || data.length < 3) {
        return null;
    }

    // Use pre-calculated stats from BudgetSummary (Source of Truth for the selected period)
    const stats = {
        totalIncome: budgetSummary.totalIncome,
        totalNeeds: budgetSummary.actualNeeds,
        totalWants: budgetSummary.actualWants,
        totalSavings: budgetSummary.actualSavings,
        needsPercentage: budgetSummary.needsPercentage || 0,
        wantsPercentage: budgetSummary.wantsPercentage || 0,
        savingsPercentage: budgetSummary.savingsPercentage || 0
    };

    const persona = useMemo(() => getFinancialPersona(stats), [stats]);

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

    const safeRound = (val: number) => isNaN(val) ? 0 : Math.round(val);
    const ratioString = `${safeRound(stats.needsPercentage)}/${safeRound(stats.wantsPercentage)}/${safeRound(stats.savingsPercentage)}`;

    // Radial Progress Circle Component
    const RadialProgress = ({ percentage, target, color, size = 120 }: { percentage: number, target: number, color: string, size?: number }) => {
        const radius = (size - 20) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
        const isOnTrack = Math.abs(percentage - target) <= 5;
        const isOver = percentage > target + 5;

        return (
            <div className="radial-progress-container" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="radial-progress-svg">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>
                <div className="radial-progress-content">
                    <div className="radial-progress-percentage" style={{ color }}>
                        {safeRound(percentage)}%
                    </div>
                    <div className="radial-progress-label">
                        vs {target}%
                    </div>
                    {isOnTrack && <div className="radial-progress-status">✓</div>}
                    {isOver && <div className="radial-progress-status warning">⚠</div>}
                </div>
            </div>
        );
    };

    // Horizontal Category Card with Expandable Contributors
    const CategoryCard = ({
        title,
        target,
        current,
        items,
        color,
        icon
    }: {
        title: string,
        target: number,
        current: number,
        items: typeof topCategories.needs,
        color: string,
        icon: string
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const isOnTrack = Math.abs(current - target) <= 5;
        const isOver = current > target + 5;
        const isUnder = current < target - 5;

        let statusText = 'On Track';
        let statusColor = '#10b981'; // green

        if (isOver) {
            // Special case for Savings - being over is good!
            statusText = title === 'Savings' ? 'Budget Surplus' : 'Over Budget';
            statusColor = title === 'Savings' ? '#10b981' : '#f59e0b'; // green for savings, amber for others
        } else if (isUnder) {
            statusText = 'Under Budget';
            statusColor = '#3b82f6'; // blue
        }

        return (
            <div className="financial-journey-card">
                <div className="financial-journey-card-header">
                    <div className="financial-journey-card-icon" style={{ backgroundColor: `${color}20` }}>
                        <span style={{ fontSize: '2rem' }}>{icon}</span>
                    </div>
                    <div className="financial-journey-card-title">
                        <h3>{title}</h3>
                        <span className="financial-journey-card-status" style={{ color: statusColor }}>
                            {statusText}
                        </span>
                    </div>
                </div>

                <div className="financial-journey-card-body">
                    <div className="financial-journey-progress-section">
                        <RadialProgress
                            percentage={current}
                            target={target}
                            color={color}
                            size={140}
                        />
                    </div>

                    <div className="financial-journey-details-section">
                        <div className="financial-journey-stats">
                            <div className="financial-journey-stat">
                                <span className="stat-label">Target</span>
                                <span className="stat-value">{target}%</span>
                            </div>
                            <div className="financial-journey-stat">
                                <span className="stat-label">Current</span>
                                <span className="stat-value" style={{ color }}>{safeRound(current)}%</span>
                            </div>
                            <div className="financial-journey-stat">
                                <span className="stat-label">Difference</span>
                                <span className="stat-value" style={{
                                    color: current > target ? '#f59e0b' : '#10b981'
                                }}>
                                    {current > target ? '+' : ''}{safeRound(current - target)}pp
                                </span>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <button
                                className="financial-journey-expand-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <span>Top Contributors</span>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        )}
                    </div>
                </div>

                {isExpanded && items.length > 0 && (
                    <div className="financial-journey-contributors">
                        {items.map(item => (
                            <div key={item.categoryId} className="financial-journey-contributor-item">
                                <span className="contributor-name">
                                    <span className="contributor-icon">{item.categoryIcon}</span>
                                    {item.categoryName}
                                </span>
                                <span className="contributor-percentage" style={{ color }}>
                                    {safeRound(item.percentage)}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="card financial-journey-card mt-8 p-0 border-none shadow-none bg-transparent">
            {/* Header Section */}
            <div className="mb-8 pl-1">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-1">
                    <span>🏔️</span> Your Financial Journey
                </h3>
                <p className="text-muted text-sm">
                    Based on {data.length} months data your budget ratio is <span className="font-mono font-semibold text-[var(--text-primary)]">{ratioString}</span> (needs/wants/savings).
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

            {/* Horizontal Cards - Stacked Vertically */}
            <div className="financial-journey-cards-container">
                <CategoryCard
                    title="Needs"
                    target={50}
                    current={stats.needsPercentage}
                    items={topCategories.needs}
                    color="#3b82f6" // Blue
                    icon="🏠"
                />
                <CategoryCard
                    title="Wants"
                    target={30}
                    current={stats.wantsPercentage}
                    items={topCategories.wants}
                    color="#8b5cf6" // Purple
                    icon="🎯"
                />
                <CategoryCard
                    title="Savings"
                    target={20}
                    current={stats.savingsPercentage}
                    items={topCategories.savings}
                    color="#10b981" // Green
                    icon="💰"
                />
            </div>
        </div>
    );
};

export default FinancialJourney;
