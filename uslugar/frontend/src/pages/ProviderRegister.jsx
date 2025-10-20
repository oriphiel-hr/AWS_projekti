import React, { useState } from 'react';
import api from '../api';

export default function ProviderRegister({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    city: '',
    // Provider specifično
    bio: '',
    specialties: '',
    experience: '',
    website: '',
    legalStatusId: '',
    taxId: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      // Prvo registriraj user-a kao PROVIDER
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'PROVIDER',
        phone: formData.phone,
        city: formData.city,
        legalStatusId: formData.legalStatusId || undefined,
        taxId: formData.taxId || undefined,
        companyName: formData.companyName || undefined
      };

      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Ažuriraj provider profil
      if (formData.bio || formData.specialties || formData.experience || formData.website) {
        const profileData = {};
        if (formData.bio) profileData.bio = formData.bio;
        if (formData.specialties) profileData.specialties = formData.specialties.split(',').map(s => s.trim());
        if (formData.experience) profileData.experience = parseInt(formData.experience);
        if (formData.website) profileData.website = formData.website;
        if (formData.legalStatusId) profileData.legalStatusId = formData.legalStatusId;
        if (formData.taxId) profileData.taxId = formData.taxId;
        if (formData.companyName) profileData.companyName = formData.companyName;
        
        // Update profila
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.put('/providers/me', profileData);
      }
      
      // Prikaži success message
      setSuccess(true);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registracija uspješna!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Poslali smo vam email na adresu:
          </p>
          <p className="text-xl font-semibold text-green-600 mb-6">
            {formData.email}
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-green-900 mb-2">
              📧 <strong>Provjerite svoj email inbox</strong>
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Kliknite na aktivacijski link da potvrdite email i započnete nuditi usluge.
            </p>
            <p className="text-xs text-gray-600">
              Link vrijedi 24 sata.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.hash = '#user';
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Povratak na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Registracija pružatelja usluga</h2>
        <p className="text-gray-600 mt-2">Ponudite svoje usluge i započnite zarađivati</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Osnovni podaci */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Osnovni podaci</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puno ime <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ime Prezime"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+385 91 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Zagreb"
              />
            </div>
          </div>
        </div>

        {/* Profesionalni podaci */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Profesionalni podaci</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O meni / Biografija
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Opišite svoje iskustvo i usluge koje nudite..."
            />
            <p className="text-xs text-gray-500 mt-1">Preporučeno: 100-300 znakova</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specijalizacije
            </label>
            <input
              type="text"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Popravak cijevi, Instalacija bojlera, Održavanje"
            />
            <p className="text-xs text-gray-500 mt-1">Odvojeno zarezom</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Godine iskustva
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min={0}
                max={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://vasa-web.hr"
              />
            </div>
          </div>
        </div>

        {/* Pravni status */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Pravni status (opcionalno)</h3>
          <p className="text-sm text-gray-600">Ako ste registrirani kao obrt/firma, unesite podatke</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pravni status
            </label>
            <select
              name="legalStatusId"
              value={formData.legalStatusId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Odaberi (opcionalno)</option>
              <option value="cls1_individual">Fizička osoba</option>
              <option value="cls2_sole_trader">Obrtnik</option>
              <option value="cls3_pausal">Paušalni obrt</option>
              <option value="cls4_doo">d.o.o.</option>
              <option value="cls5_jdoo">j.d.o.o.</option>
              <option value="cls6_freelancer">Samostalni djelatnik</option>
            </select>
          </div>

          {formData.legalStatusId && (
            <div className="grid grid-cols-2 gap-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="12345678901"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv obrta/firme
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Vodoinstalater Horvat obrt"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registracija u tijeku...' : 'Registriraj se kao pružatelj'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Već imate račun?{' '}
          <button className="text-green-600 hover:underline font-medium">
            Prijavite se
          </button>
        </p>
      </div>
    </div>
  );
}

