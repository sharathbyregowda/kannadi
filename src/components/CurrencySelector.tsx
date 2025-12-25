import React, { useState } from 'react';
import { CURRENCIES } from '../utils/currency';
import '../pages/Onboarding.css';

interface CurrencySelectorProps {
    currentCurrency: string;
    onSelect: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currentCurrency, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCurrencies = CURRENCIES.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <label className="currency-search-label">
                Search for your currency
            </label>
            <input
                type="text"
                className="currency-search-input"
                placeholder="e.g. USD, Dollar, $"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredCurrencies.length > 0 && (
                <>
                    <span className="currency-list-label">Select your currency:</span>
                    <div className="currency-grid">
                        {filteredCurrencies.map((currency) => {
                            const isSelected = currentCurrency === currency.code;
                            return (
                                <button
                                    key={currency.code}
                                    onClick={() => onSelect(currency.code)}
                                    type="button"
                                    className={`currency-button ${isSelected ? 'selected' : ''}`}
                                >
                                    <span className="currency-symbol">
                                        {currency.symbol}
                                    </span>
                                    <div className="currency-info">
                                        <div className="currency-code">{currency.code}</div>
                                        <div className="currency-name">{currency.name}</div>
                                    </div>
                                    {isSelected && (
                                        <div className="currency-check">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {filteredCurrencies.length === 0 && (
                <div className="currency-empty">
                    No currencies found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
