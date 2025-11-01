import React, { useState, useEffect } from 'react';
import api from '../api';

export default function UserProfile({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Morate biti prijavljeni da biste pristupili ovom profilu.');
        setLoading(false);
        return;
      }

      // Dohvati korisničke podatke iz tokena ili API-ja
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          city: userData.city || ''
        });
      } else {
        // Ako nema u localStorage, dohvatiti s API-ja
        const response = await api.get('/users/me');
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          city: response.data.city || ''
        });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      if (err.response?.status === 401) {
        setError('Vaš login je istekao. Molimo prijavite se ponovno.');
      } else {
        setError(`Greška pri učitavanju profila (${err.response?.status || 'unknown'}): ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await api.put('/users/me', formData);
      
      // Ažuriraj localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess('Profil je uspješno ažuriran!');
      setEditMode(false);
      
      // Očisti success poruku nakon 3 sekunde
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Greška pri ažuriranju profila.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⏳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Učitavanje profila...</h3>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Greška</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.hash = '#login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Prijava
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Moj profil</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ✏️ Uredi profil
          </button>
        )}
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Osnovni podaci */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              👤 Osnovni podaci
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ime i prezime
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                    {user?.fullName || 'Nije uneseno'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  {user?.email || 'Nije uneseno'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Email se ne može mijenjati</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+385911234567"
                  />
                ) : (
                  <p className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                    {user?.phone || 'Nije uneseno'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grad
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zagreb"
                  />
                ) : (
                  <p className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                    {user?.city || 'Nije uneseno'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status i role */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              📋 Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uloga
                </label>
                <p className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  {user?.role === 'USER' ? '👤 Korisnik usluge' : 
                   user?.role === 'PROVIDER' ? '🏢 Pružatelj usluge' : 
                   user?.role === 'ADMIN' ? '👑 Administrator' : 
                   user?.role || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status verifikacije
                </label>
                <p className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  {user?.isVerified ? (
                    <span className="text-green-600">✓ Verificiran</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Čeka verifikaciju</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {saving ? 'Spremanje...' : '💾 Spremi promjene'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  fullName: user?.fullName || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  city: user?.city || ''
                });
                setError('');
                setSuccess('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Otkaži
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

