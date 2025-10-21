// Credits Balance Widget - USLUGAR EXCLUSIVE
import React, { useState, useEffect } from 'react';
import { getCreditsBalance } from '../api/exclusive';

export default function CreditsWidget() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBalance = async () => {
    try {
      const response = await getCreditsBalance();
      setBalance(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading credits:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!balance) return null;

  const isLow = balance.balance < 5;

  return (
    <div 
      onClick={() => window.location.hash = '#subscription'}
      className={`px-4 py-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
        isLow 
          ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
          : 'bg-gradient-to-r from-green-500 to-green-600'
      } text-white`}
    >
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs opacity-90">Krediti</p>
          <p className="text-lg font-bold">{balance.balance}</p>
        </div>
        {isLow && (
          <span className="text-xs bg-white text-red-600 px-2 py-1 rounded">
            Nisko!
          </span>
        )}
      </div>
    </div>
  );
}

