import React, { useState } from 'react';
import { CURRENCIES } from '../utils/currency';
import './Dashboard.css';

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
        <div className="space-y-4 animate-fade-in">
            <div className="form-group">
                <input
                    type="text"
                    className="input"
                    placeholder="Search currency (e.g. USD, Dollar, $)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredCurrencies.map((currency) => (
                    <button
                        key={currency.code}
                        className={`card currency-card ${currentCurrency === currency.code ? 'border-primary bg-primary-light' : ''}`}
                        onClick={() => onSelect(currency.code)}
                        type="button"
                        style={{
                            textAlign: 'left',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            border: currentCurrency === currency.code ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>
                            {currency.symbol}
                        </span>
                        <div>
                            <div style={{ fontWeight: 600 }}>{currency.code}</div>
                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>{currency.name}</div>
                        </div>
                    </button>
                ))}
            </div>

            {filteredCurrencies.length === 0 && (
                <div className="text-center text-muted p-4">
                    No currencies found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
