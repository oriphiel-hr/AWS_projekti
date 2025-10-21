// USLUGAR EXCLUSIVE - ROI Dashboard
import React, { useState, useEffect } from 'react';
import { getROIDashboard, getMonthlyStats } from '../api/exclusive';

export default function ROIDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
    loadMonthlyStats();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getROIDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri učitavanju dashboard-a');
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const now = new Date();
      const response = await getMonthlyStats(now.getFullYear(), now.getMonth() + 1);
      setMonthlyStats(response.data);
    } catch (err) {
      console.error('Error loading monthly stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Učitavanje ROI statistike...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const roi = dashboard.roi;
  const subscription = dashboard.subscription;
  const insights = dashboard.insights || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ROI Dashboard</h1>
        <p className="text-gray-600 mt-2">Statistika profitabilnosti vaših ekskluzivnih leadova</p>
      </div>

      {/* Insights (AI preporuke) */}
      {insights.length > 0 && (
        <div className="mb-8 space-y-3">
          {insights.map((insight, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                insight.type === 'alert' ? 'bg-red-50 border-red-500 text-red-800' :
                'bg-blue-50 border-blue-500 text-blue-800'
              }`}
            >
              <p className="text-sm font-medium">{insight.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Purchased */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">Ukupno Kupljeno</p>
          <p className="text-3xl font-bold text-gray-900">{roi.totalLeadsPurchased}</p>
          <p className="text-xs text-gray-500 mt-1">leadova</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">Stopa Konverzije</p>
          <p className="text-3xl font-bold text-green-600">{roi.conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">{roi.totalLeadsConverted} od {roi.totalLeadsPurchased}</p>
        </div>

        {/* ROI */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">ROI (Povrat)</p>
          <p className={`text-3xl font-bold ${roi.roi >= 100 ? 'text-green-600' : roi.roi >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            {roi.roi >= 0 ? '+' : ''}{roi.roi.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">{roi.totalRevenue.toLocaleString()} EUR prihod</p>
        </div>

        {/* Avg Lead Value */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">Prosječna Vrijednost</p>
          <p className="text-3xl font-bold text-purple-600">{roi.avgLeadValue.toFixed(0)} €</p>
          <p className="text-xs text-gray-500 mt-1">po konvertiranom leadu</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Leadova</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Aktivni</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                {dashboard.statusBreakdown?.ACTIVE || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Kontaktirani</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                {dashboard.statusBreakdown?.CONTACTED || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Konvertirani</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                {dashboard.statusBreakdown?.CONVERTED || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Refundirani</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                {dashboard.statusBreakdown?.REFUNDED || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Vaša Pretplata</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-bold">{subscription.plan}</span>
            </div>
            <div className="flex justify-between">
              <span>Preostali krediti:</span>
              <span className="font-bold text-2xl">{subscription.creditsBalance}</span>
            </div>
            <div className="flex justify-between">
              <span>Ukupno potrošeno:</span>
              <span>{subscription.lifetimeCreditsUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Ukupno konvertirano:</span>
              <span>{subscription.lifetimeLeadsConverted}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.hash = '#subscription'}
            className="mt-4 w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50"
          >
            Nadogradi Plan
          </button>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nedavni Leadovi</h3>
        {dashboard.recentLeads && dashboard.recentLeads.length > 0 ? (
          <div className="space-y-3">
            {dashboard.recentLeads.map((purchase) => (
              <div key={purchase.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{purchase.job.title}</p>
                  <p className="text-sm text-gray-600">{purchase.job.category.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(purchase.createdAt).toLocaleDateString('hr-HR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    purchase.status === 'CONVERTED' ? 'bg-green-100 text-green-800' :
                    purchase.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                    purchase.status === 'REFUNDED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {purchase.status}
                  </span>
                  {purchase.job.budgetMax && (
                    <p className="text-sm text-gray-600 mt-1">do {purchase.job.budgetMax}€</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Još nema kupljenih leadova</p>
        )}
      </div>

      {/* Monthly Stats */}
      {monthlyStats && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mjesečna Statistika - {monthlyStats.month}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{monthlyStats.totalPurchased}</p>
              <p className="text-sm text-gray-600">Kupljeno</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{monthlyStats.totalContacted}</p>
              <p className="text-sm text-gray-600">Kontaktirano</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{monthlyStats.totalConverted}</p>
              <p className="text-sm text-gray-600">Konvertirano</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{monthlyStats.conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Stopa</p>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Kako čitati ROI?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-1">Conversion Rate (Stopa konverzije)</p>
            <p>Postotak kupljenih leadova koji su realizirani u posao.</p>
            <p className="text-green-600 mt-1">✅ Dobar: 40%+</p>
          </div>
          <div>
            <p className="font-semibold mb-1">ROI (Return on Investment)</p>
            <p>Povrat ulaganja - koliko ste zaradili u odnosu na potrošene kredite.</p>
            <p className="text-green-600 mt-1">✅ Dobar: 150%+</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Avg Lead Value</p>
            <p>Prosječna zarada po konvertiranom leadu.</p>
            <p className="text-green-600 mt-1">✅ Cilj: 500€+</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Credits Balance</p>
            <p>Broj preostalih kredita za kupovinu novih leadova.</p>
              <p className="text-yellow-600 mt-1">⚠️ Nadopunite ako je &lt;5</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => window.location.hash = '#leads'}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
        >
          🛒 Pregledaj Leadove
        </button>
        <button
          onClick={() => window.location.hash = '#my-leads'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          📋 Moji Leadovi
        </button>
        <button
          onClick={loadDashboard}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
        >
          🔄 Osvježi
        </button>
      </div>
    </div>
  );
}

