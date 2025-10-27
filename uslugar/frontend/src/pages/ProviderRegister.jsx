import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLegalStatuses } from '../hooks/useLegalStatuses';
import { validateOIB, validateEmail } from '../utils/validators';

export default function ProviderRegister({ onSuccess }) {
  const { legalStatuses, loading: loadingStatuses } = useLegalStatuses();
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
    companyName: '',
    // Kategorije
    categoryIds: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [oibError, setOibError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Učitaj kategorije
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Greška pri učitavanju kategorija');
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validacija emaila u realnom vremenu
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Email adresa nije valjana');
      } else {
        setEmailError('');
      }
    }

    // Validacija OIB-a u realnom vremenu
    if (name === 'taxId') {
      if (value && !validateOIB(value)) {
        setOibError('OIB nije validan. Provjerite kontrolnu znamenku.');
      } else {
        setOibError('');
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validacija emaila prije slanja
      if (!validateEmail(formData.email)) {
        setError('Email adresa nije valjana');
        setEmailError('Email adresa nije valjana');
        setLoading(false);
        return;
      }

      // VALIDACIJA: Kategorije su OBAVEZNE za pružatelje
      if (formData.categoryIds.length === 0) {
        setError('Morate odabrati minimalno 1 kategoriju usluga kojima se bavite.');
        setLoading(false);
        return;
      }

      // VALIDACIJA: Pravni status je OBAVEZAN za pružatelje
      if (!formData.legalStatusId) {
        setError('Pravni status je obavezan. Odaberite pravni oblik vašeg poslovanja.');
        setLoading(false);
        return;
      }
      
      if (!formData.taxId) {
        setError('OIB je obavezan za pružatelje usluga.');
        setLoading(false);
        return;
      }
      
      // Validacija OIB-a prije slanja
      if (formData.taxId && !validateOIB(formData.taxId)) {
        setError('OIB nije validan. Molimo provjerite uneseni broj.');
        setOibError('OIB nije validan. Provjerite kontrolnu znamenku.');
        setLoading(false);
        return;
      }
      
      // Provjeri da li je naziv firme obavezan (osim za freelancere)
      const selectedStatus = legalStatuses.find(s => s.id === formData.legalStatusId);
      if (selectedStatus?.code !== 'FREELANCER' && !formData.companyName) {
        setError('Naziv firme/obrta je obavezan. Samo samostalni djelatnici mogu raditi pod svojim imenom.');
        setLoading(false);
        return;
      }
      
      // Prvo registriraj user-a kao PROVIDER
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'PROVIDER',
        phone: formData.phone,
        city: formData.city,
        legalStatusId: formData.legalStatusId,
        taxId: formData.taxId,
        companyName: formData.companyName || undefined
      };

      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Ažuriraj provider profil
      const profileData = {};
      if (formData.bio) profileData.bio = formData.bio;
      if (formData.specialties) profileData.specialties = formData.specialties.split(',').map(s => s.trim());
      if (formData.experience) profileData.experience = parseInt(formData.experience);
      if (formData.website) profileData.website = formData.website;
      if (formData.legalStatusId) profileData.legalStatusId = formData.legalStatusId;
      if (formData.taxId) profileData.taxId = formData.taxId;
      if (formData.companyName) profileData.companyName = formData.companyName;
      
      // Dodaj kategorije
      profileData.categoryIds = formData.categoryIds;
      
      // Update profila
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.put('/providers/me', profileData);
      
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
              Ime i prezime odgovorne osobe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ana Horvat"
            />
            <p className="text-xs text-gray-500 mt-1">Ime i prezime vlasnika/direktora (ne naziv tvrtke)</p>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="vas@email.com"
              />
              {emailError && (
                <p className="text-xs text-red-600 mt-1">✗ {emailError}</p>
              )}
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

        {/* Kategorije usluga */}
        <div className="space-y-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            Kategorije usluga (obavezno)
          </h3>
          <p className="text-sm text-gray-700">
            <strong>Odaberite kategorije</strong> usluga kojima se bavite. Klijenti će vas moći pronaći prema ovim kategorijama.
          </p>
          
          {loadingCategories ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 mt-2">Učitavanje kategorija...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories
                  .filter(category => !category.parentId) // Samo glavne kategorije
                  .map(category => {
                    const subcategories = categories.filter(cat => cat.parentId === category.id);
                    return (
                      <div key={category.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.categoryIds.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{category.icon || '🛠️'}</span>
                              <span className="font-medium text-gray-900">{category.name}</span>
                            </div>
                            {category.description && (
                              <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                            )}
                            {subcategories.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Podkategorije:</p>
                                <div className="space-y-1">
                                  {subcategories.slice(0, 3).map(subcategory => (
                                    <label key={subcategory.id} className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formData.categoryIds.includes(subcategory.id)}
                                        onChange={() => handleCategoryChange(subcategory.id)}
                                        className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <span className="text-xs text-gray-700">{subcategory.name}</span>
                                    </label>
                                  ))}
                                  {subcategories.length > 3 && (
                                    <p className="text-xs text-gray-500">+{subcategories.length - 3} više</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
              </div>
              
              {formData.categoryIds.length === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">
                    ⚠️ <strong>Morate odabrati minimalno 1 kategoriju</strong> usluga kojima se bavite.
                  </p>
                </div>
              )}
              
              {formData.categoryIds.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    ✅ Odabrano <strong>{formData.categoryIds.length}</strong> kategorija
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pravni status */}
        <div className="space-y-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pravni status (obavezno)
          </h3>
          <p className="text-sm text-gray-700">
            <strong>Prema zakonu</strong>, svi pružatelji usluga moraju biti registrirani kao obrt, firma ili samostalni djelatnik.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pravni status <span className="text-red-500">*</span>
            </label>
            <select
              name="legalStatusId"
              value={formData.legalStatusId}
              onChange={handleChange}
              required
              disabled={loadingStatuses}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Odaberite pravni oblik</option>
              {legalStatuses
                .filter(status => status.code !== 'INDIVIDUAL')
                .map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name} - {status.description}
                  </option>
                ))}
            </select>
            {loadingStatuses && (
              <p className="text-xs text-gray-500 mt-1">Učitavanje pravnih statusa...</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OIB <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                required
                disabled={!formData.legalStatusId}
                maxLength={11}
                pattern="[0-9]{11}"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  oibError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.legalStatusId ? "12345678901" : "Prvo odaberite pravni status"}
              />
              {oibError ? (
                <p className="text-xs text-red-600 mt-1">✗ {oibError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">11 brojeva</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naziv obrta/firme {legalStatuses.find(s => s.id === formData.legalStatusId)?.code !== 'FREELANCER' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required={formData.legalStatusId && legalStatuses.find(s => s.id === formData.legalStatusId)?.code !== 'FREELANCER'}
                disabled={!formData.legalStatusId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={!formData.legalStatusId ? 'Prvo odaberite pravni status' : (legalStatuses.find(s => s.id === formData.legalStatusId)?.code === 'FREELANCER' ? 'Opcionalno - možete raditi pod svojim imenom' : 'Vodoinstalater Horvat obrt')}
              />
              {formData.legalStatusId && legalStatuses.find(s => s.id === formData.legalStatusId)?.code === 'FREELANCER' && (
                <p className="text-xs text-gray-500 mt-1">Samostalni djelatnici mogu raditi pod svojim imenom i prezimenom</p>
              )}
            </div>
          </div>
        </div>

        {/* KYC-lite Verifikacija za Freelancere - Volonterski */}
        {(() => {
          const selectedStatus = legalStatuses.find(s => s.id === formData.legalStatusId);
          const isFreelancer = selectedStatus?.code === 'FREELANCER' || selectedStatus?.code === 'SOLE_TRADER';
          
          if (!isFreelancer) return null;
          
          return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                🔒 KYC-lite Verifikacija (Opcionalno)
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Učitajte Rješenje Porezne uprave radi lakše provjerljivosti. 
                Možete to učiniti i nakon registracije.
              </p>
              <div className="text-xs text-gray-600 mb-2">
                💡 <strong>Savjet:</strong> Ovo ćete moći dodati nakon registracije u sekciji Pružatelj usluga.
              </div>
            </div>
          );
        })()}

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
          <a href="#login" className="text-green-600 hover:underline font-medium">
            Prijavite se
          </a>
        </p>
      </div>
    </div>
  );
}

