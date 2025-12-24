import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getAnalysisMonths } from '../utils/projections';
import { formatCurrency } from '../utils/calculations';

interface CalculationResult {
    achievable: boolean;
    partial: boolean;
    requiredMonthly: number;
    currentAverageSavings: number;
    monthsToGoal?: number;
    message: string;
}

const SavingsGoalCalculator: React.FC = () => {
    const { data, monthlyTrends } = useFinance();
    const [targetAmount, setTargetAmount] = useState<string>('');
    const [timeframe, setTimeframe] = useState<string>('');
    const [result, setResult] = useState<CalculationResult | null>(null);

    // Get historical context for analysis using existing projection logic
    const historicalStats = useMemo(() => {
        // Use the same logic as projections to find relevant months
        const analysisMonths = getAnalysisMonths(monthlyTrends, data.currentMonth);

        if (analysisMonths.length < 3) {
            return { insufficientData: true };
        }

        const totalIncome = analysisMonths.reduce((sum, m) => sum + m.income, 0);

        // Calculate total expenses (Needs + Wants) from MonthlyData
        // Note: MonthlyData.expenses excludes savings, but verify with calculation logic if needed
        const totalExpenses = analysisMonths.reduce((sum, m) => sum + m.expenses, 0);

        // Find relevant months to filter raw expenses for Allocated Savings
        const monthKeys = new Set(analysisMonths.map(m => m.month));

        // Calculate Total Allocated Savings (money already moved to savings/investments)
        const totalAllocatedSavings = data.expenses
            .filter(e => monthKeys.has(e.month) && e.categoryType === 'savings')
            .reduce((sum, e) => sum + e.amount, 0);

        // Cash Balance = Income - Expenses (Needs+Wants) - Allocated Savings
        // This represents unallocated cash flow available for NEW goals
        const totalCashBalance = totalIncome - totalExpenses - totalAllocatedSavings;
        const averageCashBalance = totalCashBalance / analysisMonths.length;

        return {
            insufficientData: false,
            averageSavings: Math.max(0, averageCashBalance), // Floor at 0 for calculation safety
            monthCount: analysisMonths.length
        };
    }, [monthlyTrends, data.currentMonth, data.expenses]);

    const calculateGoal = () => {
        const target = parseFloat(targetAmount);
        const months = parseInt(timeframe);

        if (isNaN(target) || target <= 0 || isNaN(months) || months < 3 || months > 36) {
            return;
        }

        if (historicalStats.insufficientData || historicalStats.averageSavings === undefined) {
            return;
        }

        const requiredMonthly = target / months;
        const currentAvg = historicalStats.averageSavings;

        let calcResult: CalculationResult;

        if (currentAvg >= requiredMonthly) {
            calcResult = {
                achievable: true,
                partial: false,
                requiredMonthly,
                currentAverageSavings: currentAvg,
                message: "Based on your current income and spending, this goal is achievable! 🎉"
            };
        } else if (currentAvg > 0) {
            const monthsNeeded = target / currentAvg;
            calcResult = {
                achievable: false,
                partial: true,
                requiredMonthly,
                currentAverageSavings: currentAvg,
                monthsToGoal: monthsNeeded,
                message: `At your current saving rate (${formatCurrency(currentAvg, data.currency, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo), you would need ${Math.ceil(monthsNeeded)} months.`
            };
        } else {
            calcResult = {
                achievable: false,
                partial: false,
                requiredMonthly,
                currentAverageSavings: currentAvg,
                message: "With your current spending matching or exceeding income, this goal is not achievable without changes."
            };
        }

        setResult(calcResult);
    };

    // Calculate on input change if valid
    React.useEffect(() => {
        const target = parseFloat(targetAmount);
        const months = parseInt(timeframe);

        if (target > 0 && months >= 3 && months <= 36) {
            calculateGoal();
        } else {
            setResult(null);
        }
    }, [targetAmount, timeframe, historicalStats]);

    if (historicalStats.insufficientData) {
        return (
            <div className="p-6 text-center text-muted">
                <p>Please refer to a month with at least 3 months of prior history to use the goal calculator.</p>
            </div>
        );
    }

    return (
        <div className="savings-goal-calculator p-4 animate-fade-in">
            <h4 className="text-lg font-semibold mb-2">Simple Savings Goal</h4>
            <p className="text-sm text-muted mb-6">
                See if your current spending habits support your target.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="form-group">
                    <label htmlFor="target-amount" className="label">Target Amount ({data.currency})</label>
                    <input
                        id="target-amount"
                        type="number"
                        className="input"
                        placeholder="e.g. 5000"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="timeframe" className="label">Timeframe (Months)</label>
                    <input
                        id="timeframe"
                        type="number"
                        className="input"
                        placeholder="3 - 36 months"
                        value={timeframe}
                        onChange={(e) => {
                            // Enforce integer
                            const val = e.target.value;
                            if (val === '' || /^\d+$/.test(val)) {
                                setTimeframe(val);
                            }
                        }}
                        min="3"
                        max="36"
                    />
                    <span className="text-xs text-muted mt-1 block">Min: 3 months, Max: 36 months</span>
                </div>
            </div>

            {result && (
                <div className={`goal-result p-4 rounded-xl border ${result.achievable ? 'bg-emerald-500/10 border-emerald-500/30' :
                    result.partial ? 'bg-blue-500/10 border-blue-500/30' :
                        'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h5 className={`font-bold text-lg ${result.achievable ? 'text-emerald-400' :
                                result.partial ? 'text-blue-400' :
                                    'text-red-400'
                                }`}>
                                {result.achievable ? 'Goal Achievable' :
                                    result.partial ? 'Partially Achievable' :
                                        'Changes Required'}
                            </h5>
                            <p className="text-sm mt-1 opacity-90">{result.message}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted">Required Savings</div>
                            <div className="font-bold text-lg">{formatCurrency(result.requiredMonthly, data.currency)}/mo</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                        <span className="text-muted">Your Current Average Savings:</span>
                        <span className={`font-mono ${result.currentAverageSavings >= result.requiredMonthly ? 'text-emerald-400' : 'text-warning'
                            }`}>
                            {formatCurrency(result.currentAverageSavings, data.currency)}/mo
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavingsGoalCalculator;
