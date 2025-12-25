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
        <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Review your money.<br />Don’t guess.
                </h1>
                <div className="prose mx-auto text-lg text-gray-300 leading-relaxed" style={{ maxWidth: '600px' }}>
                    <p className="mb-4">Every month, money leaves your account whether you pay attention or not. Bank statements tell the truth, but they are hard to read.</p>
                    <p className="mb-6">This app helps you review that truth calmly, once a month, so you know:</p>

                    <div className="flex flex-col gap-3 mb-8 items-center text-left">
                        <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700 w-full md:w-auto md:min-w-[300px]">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">1</div>
                            <span>Where your money actually goes</span>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700 w-full md:w-auto md:min-w-[300px]">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">2</div>
                            <span>What matters to you</span>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700 w-full md:w-auto md:min-w-[300px]">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">3</div>
                            <span>What you can cut out</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 border-l-2 border-blue-500 pl-4 italic">
                        "You’ll enter income and expenses manually. That is intentional. Reviewing each transaction forces clarity. Clarity changes behaviour."
                    </p>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
                <h2 className="text-xl font-bold mb-2 text-white">Choose your Currency</h2>
                <p className="mb-6 text-gray-400 text-sm">
                    Select the currency for your main accounts.
                </p>
                <CurrencySelector
                    currentCurrency={data.currency}
                    onSelect={setCurrency}
                />
            </div>

            <div className="flex justify-center pt-4">
                <button className="btn btn-primary btn-lg px-8 py-4 text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all" onClick={handleNext}>
                    Get Started <ArrowRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Review Categories</h2>
                <p className="text-gray-400">Income, Needs, Wants, Savings</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-5">
                        <h3 className="font-bold mb-2 text-blue-300">Why this matters</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">Categories decide how your spending is interpreted. Wrong categories lead to wrong conclusions.</p>
                        <hr className="my-4 border-blue-800/30" />
                        <p className="text-xs text-blue-200">We’ve added sensible defaults. You can customise them now or later.</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-white">Default Categories</h3>
                                <p className="text-sm text-gray-400">Click to edit or add new ones</p>
                            </div>
                        </div>
                        <div className="category-manager-wrapper">
                            <CategoryManager />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-800">
                <button className="btn btn-secondary" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm hidden md:inline">You can edit these anytime later.</span>
                    <button className="btn btn-primary" onClick={handleNext}>
                        Next: Add Income <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Add Income</h2>
                <p className="text-gray-400">Where does your money come from?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sticky top-4">
                        <h3 className="font-bold mb-2 text-gray-200">Why this matters</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">Everything else depends on income. No income means no context for your spending.</p>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <p className="mb-6 text-gray-300">
                            Start by adding your income for the month. Use your bank statement or payslip.
                            <br />
                            <span className="text-gray-500 text-sm">One entry per income source is usually enough.</span>
                        </p>
                        <IncomeForm />
                    </div>

                    {data.incomes.length > 0 && (
                        <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-5">
                            <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                                <Check size={16} /> Added Income ({data.incomes.length})
                            </h4>
                            <ul className="space-y-2">
                                {data.incomes.map(inc => (
                                    <li key={inc.id} className="flex justify-between text-sm bg-green-900/20 p-2 rounded text-gray-300">
                                        <span>{inc.source}</span>
                                        <span className="font-mono font-bold text-green-300">{inc.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-800">
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
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Add Expenses</h2>
                <p className="text-gray-400">The core habit.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sticky top-4">
                        <h3 className="font-bold mb-4 text-gray-200">Current Total</h3>
                        <div className="text-3xl font-mono font-bold text-white mb-6">
                            {data.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                            <span className="text-sm font-normal text-gray-500 ml-2">{data.currency}</span>
                        </div>

                        <h4 className="font-bold mb-2 text-sm text-gray-400 uppercase tracking-wider">What to look for</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Repeated spending</li>
                            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Forgotten subscriptions</li>
                            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Habits you stopped questioning</li>
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <p className="mb-6 text-gray-300">
                            Use your bank statement. Enter transactions one by one.
                            <br />
                            <span className="text-gray-500 text-sm">Precision matters more than speed. Be honest with yourself.</span>
                        </p>
                        <ExpenseLedger />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-800">
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
        <div className="space-y-8 animate-fade-in text-center max-w-2xl mx-auto pt-10">
            <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-500/30">
                    <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-extrabold mb-4 text-white">All Set!</h2>
                <p className="text-xl text-gray-300">Your financial data is starting to tell a story.</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-xl">
                <p className="text-lg mb-6 text-gray-300">
                    As you add more data, your dashboards and reports will update automatically to reveal patterns.
                </p>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-sm text-gray-400">
                    <strong>Tip:</strong> You don’t need to analyse charts deeply yet. Just read the summaries, react to what you feel, and adjust next month.
                </div>
            </div>

            <button className="btn btn-primary btn-lg w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all" onClick={handleFinish}>
                Go to Dashboard <ArrowRight size={20} className="ml-2" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center py-10 px-4 md:px-8">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Onboarding</div>
                    <div className="text-sm text-gray-500">Step {step} of 5</div>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 relative h-1 bg-gray-800 rounded-full overflow-hidden w-full">
                    <div
                        className="absolute h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
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
