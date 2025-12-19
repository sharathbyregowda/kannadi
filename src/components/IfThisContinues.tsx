import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateProjections, getAnalysisMonths } from '../utils/projections';
import { formatCurrency } from '../utils/calculations';

const IfThisContinues: React.FC = () => {
    const { monthlyTrends, data } = useFinance();

    const projection = useMemo(() => {
        const analysisMonths = getAnalysisMonths(monthlyTrends);
        return calculateProjections(analysisMonths);
    }, [monthlyTrends]);

    if (!projection) {
        return null; // Not enough data (requires at least 3 completed months)
    }

    const formattedYearly = formatCurrency(Math.abs(projection.yearlyProjection), data.currency);
    const headline = projection.headline.replace('##AMOUNT##', formattedYearly);

    return (
        <div className="card projection-card animate-fade-in mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🔮</span> If This Continues...
            </h3>

            <div className="projection-content">
                <p className="projection-headline text-lg font-semibold mb-4 text-primary">
                    {headline}
                </p>

                <p className="text-muted text-sm mb-6 leading-relaxed">
                    Based on your behavior from the last {projection.monthsAnalyzed} completed months,
                    your 12-month outcome is projected to be {formattedYearly}.
                </p>

                <div className="projection-stats-grid">
                    <div className="projection-stat-item">
                        <span className="stat-label">Avg. Monthly Income</span>
                        <span className="stat-value">{formatCurrency(projection.averageIncome, data.currency)}</span>
                    </div>
                    <div className="projection-stat-item">
                        <span className="stat-label">Avg. Monthly Expenses</span>
                        <span className="stat-value">{formatCurrency(projection.averageExpenses, data.currency)}</span>
                    </div>
                    <div className="projection-stat-item">
                        <span className="stat-label">Avg. Monthly Savings</span>
                        <span className="stat-value" style={{ color: projection.averageSavings >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {formatCurrency(projection.averageSavings, data.currency)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IfThisContinues;
