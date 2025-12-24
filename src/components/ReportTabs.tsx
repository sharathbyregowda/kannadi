import React, { useState } from 'react';
import BudgetOverview from './BudgetOverview';
import IncomeVsExpenses from './IncomeVsExpenses';
import SavingsGoalCalculator from './SavingsGoalCalculator';
import './Dashboard.css';

type ReportTab = 'budget' | 'trends' | 'savings-goal';

const ReportTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReportTab>('budget');

    return (
        <div className="card report-tabs-card">
            <div className="chart-tabs">
                <button
                    className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                    onClick={() => setActiveTab('budget')}
                >
                    🎯 Budget Goal
                </button>
                <button
                    className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trends')}
                >
                    📈 Trends
                </button>
                <button
                    className={`tab-btn ${activeTab === 'savings-goal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('savings-goal')}
                >
                    💰 Savings Goal
                </button>
            </div>

            <div className="tab-content animate-fade-in">
                {activeTab === 'budget' ? (
                    <BudgetOverview standalone={false} />
                ) : activeTab === 'trends' ? (
                    <IncomeVsExpenses standalone={false} />
                ) : (
                    <SavingsGoalCalculator />
                )}
            </div>
        </div>
    );
};

export default ReportTabs;
