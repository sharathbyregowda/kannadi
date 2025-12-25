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
                    className="input bg-gray-800 border-gray-700 text-white placeholder-gray-500"
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
                        className={`card currency-card ${currentCurrency === currency.code ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'bg-gray-700/50 hover:bg-gray-700 border-gray-600 text-gray-200'}`}
                        onClick={() => onSelect(currency.code)}
                        type="button"
                        style={{
                            textAlign: 'left',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            border: currentCurrency === currency.code ? '2px solid #3b82f6' : '1px solid #4b5563',
                            transition: 'all 0.2s ease',
                            backgroundColor: currentCurrency === currency.code ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.5)'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>
                            {currency.symbol}
                        </span>
                        <div>
                            <div style={{ fontWeight: 600, color: '#f3f4f6' }}>{currency.code}</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{currency.name}</div>
                        </div>
                    </button>
                ))}
            </div>

            {filteredCurrencies.length === 0 && (
                <div className="text-center text-gray-500 p-4">
                    No currencies found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
