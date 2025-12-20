import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateProjections, getAnalysisMonths } from '../utils/projections';
import { formatCurrency } from '../utils/calculations';

const IfThisContinues: React.FC = () => {
    const { monthlyTrends, data } = useFinance();

    const projection = useMemo(() => {
        const analysisMonths = getAnalysisMonths(monthlyTrends);
        return calculateProjections(analysisMonths, data.expenses, data.customCategories);
    }, [monthlyTrends, data.expenses, data.customCategories]);

    if (!projection || projection.yearlyProjection <= 0) {
        return null; // Not enough data or no savings projected
    }

    const formattedYearly = formatCurrency(Math.abs(projection.yearlyProjection), data.currency, { maximumFractionDigits: 0 });
    const headline = projection.headline.replace('##AMOUNT##', formattedYearly);
    const outcomeLabel = projection.yearlyProjection >= 0 ? 'total savings' : 'spending exceeding income';

    const formatDuration = (value: number) => {
        if (value > 18) {
            const years = value / 12;
            return {
                value: years < 10 ? years.toFixed(1) : Math.round(years).toString(),
                unit: years === 1 ? 'year' : 'years'
            };
        }
        return {
            value: Math.round(value).toString(),
            unit: value === 1 ? 'month' : 'months'
        };
    };

    const renderTimeBar = (label: string, value: number, max: number, icon: string) => {
        const percentage = Math.min((value / max) * 100, 100);
        const { value: displayValue, unit } = formatDuration(value);

        return (
            <div className="time-metric-item mb-4">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="flex items-center gap-2">
                        <span>{icon}</span> {label}
                    </span>
                    <span className="font-semibold">{displayValue} {unit}</span>
                </div>
                <div className="time-bar-bg h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="time-bar-fill h-full bg-primary transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

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
                    your 12-month {outcomeLabel} is projected to be {formattedYearly}.
                </p>

                <div className="projection-stats-grid mb-8">
                    <div className="projection-stat-item">
                        <span className="stat-label">Avg. Monthly Income</span>
                        <span className="stat-value">{formatCurrency(projection.averageIncome, data.currency, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="projection-stat-item">
                        <span className="stat-label">Avg. Monthly Expenses</span>
                        <span className="stat-value">{formatCurrency(projection.averageExpenses, data.currency, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="projection-stat-item">
                        <span className="stat-label">Avg. Monthly Savings</span>
                        <span className="stat-value" style={{ color: projection.averageSavings >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {formatCurrency(projection.averageSavings, data.currency, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                <div className="what-this-buys mt-12 pt-8 border-top border-[var(--color-border)]">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                            <span>🛍️</span> What This Buys You
                        </h3>
                        <p className="text-xs text-muted leading-tight">
                            Your projected savings can cover <strong>one</strong> of these milestones at a time:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div>
                            {renderTimeBar("Living Expenses", projection.timeMetrics.monthsOfLivingExpenses, 12, "🕒")}
                            {projection.timeMetrics.topCategoriesCovered[0] && renderTimeBar(
                                projection.timeMetrics.topCategoriesCovered[0].name,
                                projection.timeMetrics.topCategoriesCovered[0].monthsCovered,
                                24,
                                projection.timeMetrics.topCategoriesCovered[0].icon
                            )}
                        </div>
                        <div>
                            {projection.timeMetrics.topCategoriesCovered.slice(1).map((cat) => (
                                <React.Fragment key={cat.name}>
                                    {renderTimeBar(cat.name, cat.monthsCovered, 24, cat.icon)}
                                </React.Fragment>
                            ))}
                            <div className="time-metric-item">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-2">
                                        <span>🛡️</span> Emergency Buffer
                                    </span>
                                    <span className={`font-bold ${projection.timeMetrics.emergencyBufferStatus === 'Strong' ? 'text-success' :
                                        projection.timeMetrics.emergencyBufferStatus === 'Healthy' ? 'text-primary' : 'text-warning'
                                        }`}>
                                        {projection.timeMetrics.emergencyBufferStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IfThisContinues;
