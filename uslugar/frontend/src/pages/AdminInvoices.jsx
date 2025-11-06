/**
 * Admin Invoices Page - Pregled svih faktura
 */

import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
    loadStats();
  }, [filters, pagination.offset]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      };
      
      const response = await api.get('/admin/invoices', { params });
      setInvoices(response.data.invoices);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri učitavanju faktura');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const response = await api.get('/admin/invoices', { params: { ...params, limit: 1 } });
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const formatCurrency = (cents) => {
    return `${(cents / 100).toFixed(2)} €`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('hr-HR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    return type === 'SUBSCRIPTION' ? 'Pretplata' : 'Kupovina leada';
  };

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SENT: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      DRAFT: 'Nacrt',
      SENT: 'Poslana',
      PAID: 'Plaćena',
      CANCELLED: 'Otkazana'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const downloadPDF = async (invoiceId, invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faktura-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Greška pri preuzimanju PDF-a');
    }
  };

  const markAsPaid = async (invoiceId) => {
    if (!confirm('Označiti fakturu kao plaćenu?')) return;
    
    try {
      await api.post(`/invoices/${invoiceId}/mark-paid`);
      alert('Faktura je označena kao plaćena');
      await loadInvoices();
      await loadStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri označavanju fakture');
    }
  };

  const sendInvoice = async (invoiceId) => {
    try {
      await api.post(`/invoices/${invoiceId}/send`);
      alert('Faktura je uspješno poslana na email!');
      await loadInvoices();
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri slanju fakture');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Fakture</h1>
        <p className="text-gray-600">Pregled svih faktura na platformi</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Statistike */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Ukupno faktura</div>
            <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Plaćeno</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.byStatus?.PAID?.count || 0}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(stats.byStatus?.PAID?.total || 0)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Poslano</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.byStatus?.SENT?.count || 0}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(stats.byStatus?.SENT?.total || 0)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Nacrt</div>
            <div className="text-2xl font-bold text-gray-600">
              {stats.byStatus?.DRAFT?.count || 0}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(stats.byStatus?.DRAFT?.total || 0)}
            </div>
          </div>
        </div>
      )}

      {/* Filteri */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Svi statusi</option>
              <option value="DRAFT">Nacrt</option>
              <option value="SENT">Poslana</option>
              <option value="PAID">Plaćena</option>
              <option value="CANCELLED">Otkazana</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Svi tipovi</option>
              <option value="SUBSCRIPTION">Pretplata</option>
              <option value="LEAD_PURCHASE">Kupovina leada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              placeholder="User ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Od datuma</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Do datuma</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Tablica */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Učitavanje...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nema faktura za prikazane filtere
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broj</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Korisnik</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iznos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.user?.fullName || invoice.user?.email || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{invoice.user?.companyName || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getTypeLabel(invoice.type)}</div>
                        {invoice.subscription && (
                          <div className="text-xs text-gray-500">Plan: {invoice.subscription.plan}</div>
                        )}
                        {invoice.leadPurchase?.job && (
                          <div className="text-xs text-gray-500">Lead: {invoice.leadPurchase.job.title}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(invoice.issueDate)}</div>
                        <div className="text-xs text-gray-500">Rok: {formatDate(invoice.dueDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadPDF(invoice.id, invoice.invoiceNumber)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Preuzmi PDF"
                          >
                            📥
                          </button>
                          {invoice.status !== 'PAID' && (
                            <button
                              onClick={() => markAsPaid(invoice.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Označi kao plaćenu"
                            >
                              ✓
                            </button>
                          )}
                          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                            <button
                              onClick={() => sendInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Pošalji email"
                            >
                              ✉️
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Detalji"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginacija */}
            {pagination.total > pagination.limit && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Prikazano {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} od {pagination.total}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                    disabled={pagination.offset === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Prethodna
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sljedeća →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal za detalje */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Detalji fakture</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Broj fakture:</h3>
                <p className="text-gray-700">{selectedInvoice.invoiceNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Korisnik:</h3>
                <p className="text-gray-700">{selectedInvoice.user?.fullName || selectedInvoice.user?.email}</p>
                <p className="text-sm text-gray-500">{selectedInvoice.user?.companyName}</p>
                <p className="text-sm text-gray-500">OIB: {selectedInvoice.user?.taxId || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Status:</h3>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Iznos:</h3>
                <p className="text-gray-700 text-xl font-bold">{formatCurrency(selectedInvoice.totalAmount)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Datumi:</h3>
                <p className="text-gray-700">Izdana: {formatDate(selectedInvoice.issueDate)}</p>
                <p className="text-gray-700">Rok plaćanja: {formatDate(selectedInvoice.dueDate)}</p>
              </div>
              {selectedInvoice.emailSentAt && (
                <div>
                  <h3 className="font-semibold text-gray-900">Email:</h3>
                  <p className="text-gray-700">Poslano: {formatDate(selectedInvoice.emailSentAt)}</p>
                  <p className="text-gray-700">Na: {selectedInvoice.emailSentTo}</p>
                </div>
              )}
              {selectedInvoice.fiscalizedAt && (
                <div>
                  <h3 className="font-semibold text-gray-900">Fiskalizacija:</h3>
                  <p className="text-gray-700">Datum: {formatDate(selectedInvoice.fiscalizedAt)}</p>
                  {selectedInvoice.zkiCode && <p className="text-gray-700">ZKI: {selectedInvoice.zkiCode}</p>}
                  {selectedInvoice.jirCode && <p className="text-gray-700">JIR: {selectedInvoice.jirCode}</p>}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => downloadPDF(selectedInvoice.id, selectedInvoice.invoiceNumber)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  📥 Preuzmi PDF
                </button>
                {selectedInvoice.status !== 'PAID' && (
                  <button
                    onClick={() => {
                      markAsPaid(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✓ Označi kao plaćenu
                  </button>
                )}
                {selectedInvoice.status !== 'PAID' && selectedInvoice.status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      sendInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    ✉️ Pošalji email
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

