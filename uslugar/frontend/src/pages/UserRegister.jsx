import React, { useState } from 'react';
import api from '../api';
import { useLegalStatuses } from '../hooks/useLegalStatuses';

export default function UserRegister({ onSuccess }) {
  const { legalStatuses, loading: loadingStatuses } = useLegalStatuses();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    city: '',
    // Opciono - za firme
    legalStatusId: '',
    taxId: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = { ...formData, role: 'USER' };
      
      // Ako nije firma, makni legal status polja
      if (!isCompany) {
        delete dataToSend.legalStatusId;
        delete dataToSend.taxId;
        delete dataToSend.companyName;
      }

      const response = await api.post('/auth/register', dataToSend);
      const { token, user, message } = response.data;
      
      // Prikaži success message umjesto auto-login
      setSuccess(true);
      
      // Opciono spremi token (ali ne login automatski)
      localStorage.setItem('pendingVerification', formData.email);
      
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.error || 'Greška pri registraciji';
      const errorDetails = err.response?.data?.details;
      
      setError(errorDetails ? `${errorMsg}\n\nDetalji: ${errorDetails}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registracija uspješna!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Poslali smo vam email na adresu:
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-6">
            {formData.email}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-blue-900 mb-2">
              📧 <strong>Provjerite svoj email inbox</strong>
            </p>
            <p className="text-sm text-gray-700">
              Kliknite na link u email-u da aktivirate svoj račun. 
              Link vrijedi 24 sata.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.hash = '#user';
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Povratak na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Registracija korisnika</h2>
        <p className="text-gray-600 mt-2">Kreirajte račun i počnite tražiti usluge</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Osnovni podaci */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Osnovni podaci</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ime i prezime <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ana Horvat"
            />
            <p className="text-xs text-gray-500 mt-1">
              {isCompany ? 'Ime i prezime odgovorne osobe (vlasnik/direktor)' : 'Vaše ime i prezime'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="vas@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lozinka <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Minimalno 6 znakova</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+385 91 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Zagreb"
              />
            </div>
          </div>
        </div>

        {/* Firma checkbox */}
        <div className="border-t pt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isCompany}
              onChange={(e) => setIsCompany(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Registriram se kao firma / obrt
            </span>
          </label>
        </div>

        {/* Podaci o firmi (ako je firma) */}
        {isCompany && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Podaci o firmi</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naziv firme / obrta
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={legalStatuses.find(s => s.id === formData.legalStatusId)?.code === 'FREELANCER' ? 'Opcionalno - možete raditi pod svojim imenom' : 'Građevina d.o.o.'}
              />
              {legalStatuses.find(s => s.id === formData.legalStatusId)?.code === 'FREELANCER' && (
                <p className="text-xs text-blue-600 mt-1">💡 Samostalni djelatnici mogu raditi pod svojim imenom</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OIB
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678901"
              />
              <p className="text-xs text-gray-500 mt-1">11 cifara</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pravni status
              </label>
              <select
                name="legalStatusId"
                value={formData.legalStatusId}
                onChange={handleChange}
                disabled={loadingStatuses}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Odaberi status</option>
                {legalStatuses
                  .filter(status => status.code !== 'INDIVIDUAL')
                  .map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name} - {status.description}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registracija u tijeku...' : 'Registriraj se'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Već imate račun?{' '}
          <button className="text-blue-600 hover:underline font-medium">
            Prijavite se
          </button>
        </p>
      </div>
    </div>
  );
}

