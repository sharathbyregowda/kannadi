import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { generateMonthlySummary } from '../utils/summary';
import { calculateMonthlyTrends, formatMonth } from '../utils/calculations';
import { AlertTriangle, DollarSign, PiggyBank, Info } from 'lucide-react';
import './Dashboard.css';

// Insight type classification based on content
type InsightType = 'positive' | 'warning' | 'info';
type InsightCategory = 'spending' | 'savings' | 'alert' | 'info';

const classifyInsight = (text: string): { type: InsightType; category: InsightCategory; icon: React.ReactNode } => {
    const lower = text.toLowerCase();

    // Positive indicators
    const isPositive =
        lower.includes('below your income') ||
        lower.includes('less than planned') ||
        lower.includes('exceeded plan') ||
        lower.includes('increased from') ||
        lower.includes('surplus');

    // Warning indicators
    const isWarning =
        lower.includes('above your income') ||
        lower.includes('more than planned') ||
        lower.includes('fell from') ||
        lower.includes('less than target') ||
        lower.includes('consecutive') ||
        lower.includes('decreased');

    // Determine category
    let category: InsightCategory = 'info';
    let icon: React.ReactNode = <Info size={20} />;

    if (lower.includes('saving')) {
        category = 'savings';
        icon = <PiggyBank size={20} />;
    } else if (lower.includes('spending') || lower.includes('spent')) {
        category = 'spending';
        icon = <DollarSign size={20} />;
    } else if (isWarning) {
        category = 'alert';
        icon = <AlertTriangle size={20} />;
    }

    // Determine sentiment type
    if (isWarning) {
        return { type: 'warning', category, icon };
    } else if (isPositive) {
        return { type: 'positive', category, icon };
    } else {
        return { type: 'info', category, icon };
    }
};

const MonthlySummary: React.FC = () => {
    const { data, budgetSummary } = useFinance();

    // Only show for specific months, not 'ALL'
    if (!data.currentMonth || data.currentMonth.endsWith('-ALL')) {
        return null;
    }

    const insights = useMemo(() => {
        // We need monthly history for trends
        const monthlyHistory = calculateMonthlyTrends(data.incomes, data.expenses);

        const summaryBullets = generateMonthlySummary({
            currentMonth: data.currentMonth,
            budgetSummary,
            expenses: data.expenses,
            categories: data.customCategories,
            monthlyHistory,
            currencyCode: data.currency
        });

        // Transform bullets into structured insight cards
        return summaryBullets.map(text => {
            const classification = classifyInsight(text);
            return {
                text,
                ...classification
            };
        });
    }, [data.currentMonth, budgetSummary, data.expenses, data.incomes, data.currency]);

    if (insights.length === 0) {
        return null;
    }

    return (
        <div className="monthly-summary-redesigned">
            <div className="monthly-summary-header">
                <h3>
                    <span className="summary-icon">📝</span>
                    Monthly Insights – {formatMonth(data.currentMonth)}
                </h3>
            </div>

            <div className="insights-grid">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`insight-card insight-${insight.type}`}
                    >
                        <div className="insight-icon-wrapper">
                            {insight.icon}
                        </div>
                        <div className="insight-content">
                            <div className="insight-badge">
                                {insight.category === 'spending' && '📊 Spending'}
                                {insight.category === 'savings' && '💰 Savings'}
                                {insight.category === 'alert' && '⚠️ Alert'}
                            </div>
                            <p className="insight-text">{insight.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlySummary;
