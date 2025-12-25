import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import CurrencySelector from '../components/CurrencySelector';
import CategoryManager from '../components/CategoryManager';
import IncomeForm from '../components/IncomeForm';
import ExpenseLedger from '../components/ExpenseLedger';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import './Onboarding.css';
import '../components/Dashboard.css';

const OnboardingPage: React.FC = () => {
    const { data, setCurrency, completeOnboarding } = useFinance();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleFinish = () => {
        completeOnboarding();
        navigate('/');
    };

    const renderStep1 = () => (
        <div className="onboarding-content">
            <div className="onboarding-welcome">
                <h1>Welcome to Simple Finance</h1>
                <p>Let's set up your account in a few simple steps.</p>
            </div>

            <div className="onboarding-card">
                <h2>Review your money. Don't guess.</h2>

                <p>
                    Every month, money leaves your account whether you pay attention or not.
                    Bank statements tell the truth, but they are hard to read.
                </p>

                <p>This app helps you review that truth calmly, once a month, so you know:</p>

                <ul className="onboarding-list">
                    <li>
                        <span className="onboarding-list-bullet">•</span>
                        <span>Where your money actually goes</span>
                    </li>
                    <li>
                        <span className="onboarding-list-bullet">•</span>
                        <span>What matters to you</span>
                    </li>
                    <li>
                        <span className="onboarding-list-bullet">•</span>
                        <span>What you can cut out</span>
                    </li>
                </ul>

                <div className="onboarding-callout">
                    <p>
                        You'll enter income and expenses manually. That is intentional.
                        Reviewing each transaction forces clarity. Clarity changes behaviour.
                    </p>
                </div>
            </div>

            <div className="onboarding-card">
                <h2>Step 1: Choose your Currency</h2>
                <p>Select the currency you use for your main accounts. You can change this later if needed.</p>

                <CurrencySelector
                    currentCurrency={data.currency}
                    onSelect={setCurrency}
                />
            </div>

            <div className="onboarding-actions">
                <button className="btn btn-primary" onClick={handleNext}>
                    Continue <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="onboarding-content">
            <div className="onboarding-step-title">
                <h1>Step 2: Add Your Income</h1>
                <p>Start by recording your income sources for the month</p>
            </div>

            <div className="onboarding-columns">
                <div className="onboarding-card">
                    <h3>Why add income first?</h3>
                    <p>Everything else depends on income. Without it, there's no context for your spending and savings.</p>
                    <p>Use your bank statement or payslip to add accurate amounts.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="onboarding-card">
                        <IncomeForm />
                    </div>

                    {data.incomes.length > 0 && (
                        <div className="onboarding-card" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            <h4 style={{ color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Check size={16} /> Income Added ({data.incomes.length} {data.incomes.length === 1 ? 'source' : 'sources'})
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.incomes.map(inc => (
                                    <li key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.5rem', color: '#d1d5db' }}>
                                        <span>{inc.source}</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#6ee7b7' }}>
                                            {inc.amount.toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="onboarding-actions-between">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem', display: 'inline-block' }} /> Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                    Continue <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="onboarding-content">
            <div className="onboarding-step-title">
                <h1>Step 3: Review Categories</h1>
                <p>Organize your spending into Income, Needs, Wants, and Savings</p>
            </div>

            <div className="onboarding-columns">
                <div className="onboarding-sidebar">
                    <h3>Why this matters</h3>
                    <p style={{ marginBottom: '0.75rem' }}>Categories decide how your spending is interpreted.</p>
                    <p style={{ marginBottom: '0.75rem' }}>Wrong categories lead to wrong conclusions about your financial health.</p>
                    <p style={{ color: '#93c5fd', fontWeight: 500 }}>We've added sensible defaults. You can customize them now or later.</p>
                </div>

                <div className="onboarding-card">
                    <CategoryManager />
                </div>
            </div>

            <div className="onboarding-actions-between">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem', display: 'inline-block' }} /> Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                    Continue <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="onboarding-content">
            <div className="onboarding-step-title">
                <h1>Step 4: Add Your Expenses</h1>
                <p>Review your bank statement and enter your expenses. You don't need to enter everything right now - just add a few to get started.</p>
            </div>

            <div className="onboarding-columns">
                <div className="onboarding-card">
                    <h3>Your Running Total</h3>
                    <div style={{ fontSize: '1.875rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
                        {data.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                        <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280', marginLeft: '0.5rem' }}>{data.currency}</span>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid #374151' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.75rem' }}>What to look for:</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#d1d5db' }}>
                            <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#f87171' }}>•</span>
                                <span>Repeated spending</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#f87171' }}>•</span>
                                <span>Forgotten subscriptions</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                                <span style={{ color: '#f87171' }}>•</span>
                                <span>Habits you stopped questioning</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="onboarding-card">
                    <ExpenseLedger />
                </div>
            </div>

            <div className="onboarding-actions-between">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem', display: 'inline-block' }} /> Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                    Continue <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
                </button>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="onboarding-completion">
            <div className="onboarding-success-icon">
                <Check size={40} strokeWidth={3} style={{ color: 'white' }} />
            </div>
            <h1>You're All Set!</h1>
            <p>Your financial data is ready to review</p>

            <div className="onboarding-card">
                <h2>What happens next?</h2>

                <p>
                    As you add more data each month, your dashboards and reports will automatically update to show patterns and trends.
                </p>

                <div className="onboarding-callout">
                    <p>
                        <strong style={{ color: '#93c5fd' }}>Tip:</strong> Don't overthink the charts.
                        Just read the summaries, notice what stands out, and adjust your spending next month based on what you learn.
                    </p>
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleFinish}
                style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', fontWeight: 'bold' }}
            >
                Go to Dashboard <ArrowRight size={20} style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
            </button>
        </div>
    );

    return (
        <div className="onboarding-container">
            <div className="onboarding-header">
                <div className="onboarding-header-content">
                    <div className="onboarding-header-top">
                        <div className="onboarding-branding">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img src="/simple-finance/logo.webp" alt="Simple Finance" style={{ width: '32px', height: '32px' }} />
                                <div>
                                    <h2>Simple Finance</h2>
                                    <p>Setup Wizard</p>
                                </div>
                            </div>
                        </div>
                        <div className="onboarding-progress-text">
                            <div className="onboarding-progress-label">Progress</div>
                            <div className="onboarding-progress-step">Step {step} of 5</div>
                        </div>
                    </div>

                    <div className="onboarding-progress-bar">
                        <div
                            className="onboarding-progress-fill"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="onboarding-main">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </div>
        </div>
    );
};

export default OnboardingPage;
