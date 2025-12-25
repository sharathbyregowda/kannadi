import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateProjections, getAnalysisMonths } from '../utils/projections';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, DollarSign, PiggyBank, ArrowUp, ArrowDown } from 'lucide-react';
import './Dashboard.css';

const IfThisContinues: React.FC = () => {
    const { monthlyTrends, data } = useFinance();

    const projection = useMemo(() => {
        const analysisMonths = getAnalysisMonths(monthlyTrends, data.currentMonth);
        return calculateProjections(analysisMonths, data.expenses, data.customCategories);
    }, [monthlyTrends, data.expenses, data.customCategories, data.currentMonth]);

    if (!projection || projection.yearlyProjection <= 0) {
        return null; // Not enough data or no savings projected
    }

    const formattedYearly = formatCurrency(Math.abs(projection.yearlyProjection), data.currency, { maximumFractionDigits: 0 });
    const headline = projection.headline.replace('##AMOUNT##', formattedYearly);
    const isPositive = projection.yearlyProjection >= 0;

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

    return (
        <div className="projections-unified">
            <div className="projections-header">
                <h3>
                    <span className="projection-icon">🔮</span>
                    12-Month Forecast
                </h3>
            </div>

            <div className="projections-layout">
                {/* LEFT SIDE: Forecast */}
                <div className="projection-forecast">
                    <div className="forecast-headline">
                        <div className={`forecast-badge ${isPositive ? 'forecast-positive' : 'forecast-negative'}`}>
                            {isPositive ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                            <span>{isPositive ? 'Savings Growth' : 'Spending Deficit'}</span>
                        </div>
                        <h4 className="forecast-amount">{headline}</h4>
                        <p className="forecast-description">
                            Based on your behavior from the last {projection.monthsAnalyzed} completed months,
                            your 12-month {isPositive ? 'total savings' : 'spending exceeding income'} is projected to be <strong>{formattedYearly}</strong>.
                        </p>
                    </div>

                    <div className="forecast-stats">
                        <div className="forecast-stat-card">
                            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <DollarSign size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Avg. Monthly Income</span>
                                <span className="stat-value">{formatCurrency(projection.averageIncome, data.currency, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        <div className="forecast-stat-card">
                            <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Avg. Monthly Expenses</span>
                                <span className="stat-value">{formatCurrency(projection.averageExpenses, data.currency, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        <div className="forecast-stat-card">
                            <div className="stat-icon" style={{
                                backgroundColor: projection.averageSavings >= 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: projection.averageSavings >= 0 ? '#3b82f6' : '#f59e0b'
                            }}>
                                <PiggyBank size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Avg. Monthly Savings</span>
                                <span className="stat-value" style={{
                                    color: projection.averageSavings >= 0 ? 'var(--color-success)' : 'var(--color-error)'
                                }}>
                                    {formatCurrency(projection.averageSavings, data.currency, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: What This Covers */}
                <div className="projection-coverage">
                    <div className="coverage-header">
                        <h4>What This Covers</h4>
                        <p>Your projected savings can cover <strong>one</strong> of these milestones:</p>
                    </div>

                    <div className="coverage-items">
                        <div className="coverage-item">
                            <div className="coverage-info">
                                <span className="coverage-icon">🕒</span>
                                <span className="coverage-label">Living Expenses</span>
                            </div>
                            <div className="coverage-duration">
                                {(() => {
                                    const { value, unit } = formatDuration(projection.timeMetrics.monthsOfLivingExpenses);
                                    return <><strong>{value}</strong> {unit}</>;
                                })()}
                            </div>
                            <div className="coverage-bar">
                                <div
                                    className="coverage-bar-fill"
                                    style={{
                                        width: `${Math.min((projection.timeMetrics.monthsOfLivingExpenses / 12) * 100, 100)}%`,
                                        backgroundColor: '#3b82f6'
                                    }}
                                />
                            </div>
                        </div>

                        {projection.timeMetrics.topCategoriesCovered.map((cat) => {
                            const { value, unit } = formatDuration(cat.monthsCovered);
                            return (
                                <div key={cat.name} className="coverage-item">
                                    <div className="coverage-info">
                                        <span className="coverage-icon">{cat.icon}</span>
                                        <span className="coverage-label">{cat.name}</span>
                                    </div>
                                    <div className="coverage-duration">
                                        <strong>{value}</strong> {unit}
                                    </div>
                                    <div className="coverage-bar">
                                        <div
                                            className="coverage-bar-fill"
                                            style={{
                                                width: `${Math.min((cat.monthsCovered / 24) * 100, 100)}%`,
                                                backgroundColor: '#8b5cf6'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="coverage-item emergency-buffer">
                            <div className="coverage-info">
                                <span className="coverage-icon">🛡️</span>
                                <span className="coverage-label">Emergency Buffer</span>
                            </div>
                            <div className="coverage-duration">
                                <span className={`buffer-status buffer-${projection.timeMetrics.emergencyBufferStatus.toLowerCase()}`}>
                                    {projection.timeMetrics.emergencyBufferStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IfThisContinues;
