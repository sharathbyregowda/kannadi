import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import CurrencySelector from '../components/CurrencySelector';
import CategoryManager from '../components/CategoryManager';
import IncomeForm from '../components/IncomeForm';
import ExpenseLedger from '../components/ExpenseLedger';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import '../components/Dashboard.css';

const OnboardingPage: React.FC = () => {
    const { data, setCurrency, completeOnboarding } = useFinance();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // We already have data in context, but for onboarding we want to guide the user
    // The components (CategoryManager, IncomeForm, etc.) use the context directly which is fine.

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
        <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl font-bold">Review your money. Don’t guess.</h1>
                <div className="prose mx-auto text-left" style={{ maxWidth: '600px' }}>
                    <p>Every month, money leaves your account whether you pay attention or not.</p>
                    <p>Bank statements already tell the truth. This app helps you review that truth calmly, once a month, so you know:</p>
                    <ul className="list-disc pl-5">
                        <li>where your money actually goes</li>
                        <li>what matters</li>
                        <li>what doesn’t</li>
                    </ul>
                    <p>You’ll enter income and expenses manually. That is intentional.</p>
                    <p>Reviewing each transaction forces clarity. Clarity changes behaviour.</p>
                    <p className="font-semibold">This takes 10–20 minutes a month. Skipping it costs far more.</p>
                </div>
            </div>

            <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Choose your Currency</h2>
                <p className="mb-4 text-muted">
                    Choose the currency you use for everyday spending.
                    You can change this later, but all existing data will stay in the original currency.
                </p>
                <CurrencySelector
                    currentCurrency={data.currency}
                    onSelect={setCurrency}
                />
            </div>

            <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleNext}>
                    Next: Review Categories <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Step 2: Review Categories</h2>
                <p className="text-muted">Income, Needs, Wants, Savings</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="card p-4 bg-primary-light border-primary">
                        <h3 className="font-bold mb-2">Why this matters</h3>
                        <p className="text-sm">Categories decide how your spending is interpreted. Wrong categories lead to wrong conclusions.</p>
                        <hr className="my-3 border-primary-dark opacity-20" />
                        <p className="text-sm">We’ve added sensible defaults. You can customise them now or later.</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="card p-6 mb-6">
                        <h3 className="font-bold mb-4">Review the default categories for:</h3>
                        <p className="mb-4">Change names, add new ones, or keep them as-is.</p>
                        {/* We reuse CategoryManager but might need to tweak its styling or accept props to fit better */}
                        <div className="category-manager-wrapper">
                            <CategoryManager />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-muted text-sm hidden md:inline">Skip for now. You can edit categories anytime from Settings.</span>
                    <button className="btn btn-primary" onClick={handleNext}>
                        Next: Add Income <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Step 3: Add Income</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="card p-4">
                        <h3 className="font-bold mb-2">Why this matters</h3>
                        <p className="text-sm">Everything else depends on income. No income means no context.</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="card p-6 mb-4">
                        <p className="mb-6">
                            Start by adding your income for the month. Use your bank statement or payslip.
                            <br />
                            <span className="text-muted text-sm">One entry per income source is enough.</span>
                        </p>
                        <IncomeForm />
                    </div>

                    {/* Show added income items here could be nice, but IncomeForm doesn't show list.
                        We can maybe access data.incomes to show a preview? */}
                    {data.incomes.length > 0 && (
                        <div className="card p-4 bg-green-50 border-green-200">
                            <h4 className="font-bold text-green-800 mb-2">Added Income ({data.incomes.length})</h4>
                            <ul className="space-y-1">
                                {data.incomes.map(inc => (
                                    <li key={inc.id} className="flex justify-between text-sm">
                                        <span>{inc.source}</span>
                                        <span className="font-mono">{inc.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                    Next: Add Expenses <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Step 4: Add Expenses</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="card p-4 sticky top-4">
                        <h3 className="font-bold mb-2">Why this matters</h3>
                        <p className="text-sm mb-4">Total Expenses: <span className="font-mono font-bold">{data.expenses.reduce((sum, e) => sum + e.amount, 0)}</span></p>
                        <p className="text-sm mb-2">Reading your bank statement line by line forces you to notice:</p>
                        <ul className="list-disc pl-4 text-sm mb-4">
                            <li>repeated spending</li>
                            <li>forgotten subscriptions</li>
                            <li>habits you stopped questioning</li>
                        </ul>
                        <p className="text-sm font-semibold">That awareness is the point.</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="card p-6 mb-6">
                        <p className="mb-6">
                            Now add your expenses. Use your bank statement and enter transactions as they appear.
                            <br />
                            <span className="text-muted text-sm">Be honest. Precision matters more than speed.</span>
                        </p>
                        <ExpenseLedger />
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                    Next: See Your Data <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6 animate-fade-in text-center max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    <Check size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-2">Step 5: See Your Data Come Alive</h2>
                <p className="text-muted">Numbers only matter when patterns appear.</p>
            </div>

            <div className="card p-8 mb-8">
                <p className="text-lg mb-4">
                    As you add data, dashboards and summaries update automatically.
                </p>
                <p className="mb-4">
                    You don’t need to analyse charts deeply.
                    <br />
                    <strong>Read the summaries. React. Adjust next month.</strong>
                </p>
            </div>

            <button className="btn btn-primary btn-lg w-full" onClick={handleFinish}>
                View Dashboard <ArrowRight size={20} className="ml-2" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-5xl">
                {/* Progress Bar */}
                <div className="mb-8 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>

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
