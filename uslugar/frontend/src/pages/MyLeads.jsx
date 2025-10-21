// USLUGAR EXCLUSIVE - My Leads Page
import React, { useState, useEffect } from 'react';
import { getMyLeads, markLeadContacted, markLeadConverted, requestRefund, getCreditsBalance } from '../api/exclusive';

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [creditsBalance, setCreditsBalance] = useState(0);

  useEffect(() => {
    loadLeads();
    loadCredits();
  }, [filter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === 'ALL' ? null : filter;
      const response = await getMyLeads(statusFilter);
      setLeads(response.data.leads);
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri učitavanju leadova');
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      const response = await getCreditsBalance();
      setCreditsBalance(response.data.balance);
    } catch (err) {
      console.error('Error loading credits:', err);
    }
  };

  const handleMarkContacted = async (purchaseId) => {
    try {
      await markLeadContacted(purchaseId);
      alert('✅ Lead označen kao kontaktiran!');
      loadLeads();
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.error || 'Neuspjelo'));
    }
  };

  const handleMarkConverted = async (purchaseId) => {
    const revenue = prompt('Unesite prihod od ovog posla (EUR):');
    if (!revenue) return;

    try {
      await markLeadConverted(purchaseId, parseInt(revenue));
      alert('🎉 Čestitamo! Lead konvertiran u posao!');
      loadLeads();
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.error || 'Neuspjelo'));
    }
  };

  const handleRefund = async (purchaseId) => {
    const reason = prompt('Razlog za refund:') || 'Klijent nije odgovorio';
    
    const confirmed = window.confirm(
      `Zatražiti refund?\n\nKrediti će biti vraćeni na vaš račun.\nRazlog: ${reason}`
    );

    if (!confirmed) return;

    try {
      await requestRefund(purchaseId, reason);
      alert('✅ Refund uspješan! Krediti vraćeni.');
      loadLeads();
      loadCredits();
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.error || 'Neuspjelo'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'CONVERTED': return 'bg-green-100 text-green-800';
      case 'REFUNDED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moji Ekskluzivni Leadovi</h1>
          <p className="text-gray-600 mt-2">Upravljajte svojim kupljenim leadovima</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Dostupni krediti</p>
          <p className="text-3xl font-bold text-green-600">{creditsBalance}</p>
          <button
            onClick={() => window.location.hash = '#leads'}
            className="mt-2 text-sm text-green-600 hover:underline"
          >
            Kupi još leadova →
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        {['ALL', 'ACTIVE', 'CONTACTED', 'CONVERTED', 'REFUNDED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-semibold transition-colors ${
              filter === status
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status === 'ALL' ? 'Svi' : status}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">Nema leadova</p>
          <button
            onClick={() => window.location.hash = '#leads'}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Pregledaj dostupne leadove
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((purchase) => (
            <div key={purchase.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{purchase.job.title}</h3>
                  <p className="text-gray-700 mb-3">{purchase.job.description}</p>
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>📍 {purchase.job.user.city}</span>
                    <span>💰 {purchase.job.budgetMin}-{purchase.job.budgetMax} EUR</span>
                    <span>📅 {new Date(purchase.createdAt).toLocaleDateString('hr-HR')}</span>
                  </div>
                </div>
                
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(purchase.status)}`}>
                  {purchase.status}
                </span>
              </div>

              {/* Client Contact Info (only for purchased leads) */}
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-semibold text-green-900 mb-2">📞 KONTAKT KLIJENTA (EKSKLUZIVNO):</p>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Ime:</p>
                    <p className="font-semibold">{purchase.job.user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-semibold">{purchase.job.user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telefon:</p>
                    <p className="font-semibold">{purchase.job.user.phone || 'Nije navedeno'}</p>
                  </div>
                </div>
              </div>

              {/* Lead Info */}
              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span>Potrošeno: {purchase.creditsSpent} kredita</span>
                {purchase.contactedAt && (
                  <span>Kontaktirano: {new Date(purchase.contactedAt).toLocaleDateString('hr-HR')}</span>
                )}
                {purchase.convertedAt && (
                  <span>Konvertirano: {new Date(purchase.convertedAt).toLocaleDateString('hr-HR')}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {purchase.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => handleMarkContacted(purchase.id)}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
                    >
                      📞 Označiti kao kontaktiran
                    </button>
                    <button
                      onClick={() => handleRefund(purchase.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      💰 Refund
                    </button>
                  </>
                )}
                
                {purchase.status === 'CONTACTED' && (
                  <>
                    <button
                      onClick={() => handleMarkConverted(purchase.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      ✅ Označiti kao realiziran
                    </button>
                    <button
                      onClick={() => handleRefund(purchase.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      💰 Refund
                    </button>
                  </>
                )}
                
                {purchase.status === 'CONVERTED' && (
                  <div className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-center font-semibold">
                    🎉 Uspješno realiziran!
                  </div>
                )}
                
                {purchase.status === 'REFUNDED' && (
                  <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    Refundirano: {purchase.refundReason}
                  </div>
                )}
              </div>

              {/* Notes */}
              {purchase.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  <strong>Bilješke:</strong> {purchase.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-blue-600">
            {leads.filter(l => l.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-gray-600">Aktivni</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {leads.filter(l => l.status === 'CONTACTED').length}
          </p>
          <p className="text-sm text-gray-600">Kontaktirani</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-green-600">
            {leads.filter(l => l.status === 'CONVERTED').length}
          </p>
          <p className="text-sm text-gray-600">Realizirani</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-red-600">
            {leads.filter(l => l.status === 'REFUNDED').length}
          </p>
          <p className="text-sm text-gray-600">Refundirani</p>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Savjeti za uspjeh</h3>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li>📞 <strong>Kontaktirajte brzo:</strong> Klijenti cijene brzu reakciju - nazovite u roku 1 sata!</li>
          <li>💬 <strong>Budite profesionalni:</strong> Prvi dojam je ključan za konverziju</li>
          <li>📊 <strong>Pratite ROI:</strong> Fokusirajte se na leadove sa visokim quality scorom</li>
          <li>💰 <strong>Refund:</strong> Ako klijent ne odgovara, zatražite refund i dobijte kredite nazad</li>
        </ul>
      </div>
    </div>
  );
}

