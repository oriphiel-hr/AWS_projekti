import React, { useState } from 'react';
import api from '../api';
import PhoneVerification from './PhoneVerification';

export default function IdentityBadgeVerification({ profile, onUpdated }) {
  const [verifying, setVerifying] = useState(false);
  const [verificationType, setVerificationType] = useState('email'); // email, phone, dns
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false); // Za SMS workflow

  const handleVerify = async () => {
    // Za telefon, ne pozivamo direktno - koristimo PhoneVerification komponentu
    if (verificationType === 'phone') {
      setError('Molimo unesite telefonski broj i verificirajte ga SMS kodom');
      return;
    }

    if (!value) {
      setError(`Molimo unesite ${verificationType === 'email' ? 'email adresu' : 'domenu'}`);
      return;
    }

    try {
      setVerifying(true);
      setError('');
      
      await api.post('/kyc/verify-identity', {
        type: verificationType,
        value: value
      });

      setSuccess(`✓ ${verificationType === 'email' ? 'Email' : 'DNS'} je verificiran!`);
      
      // Refresh profile
      if (onUpdated) onUpdated();
      
      // Reset
      setTimeout(() => {
        setValue('');
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Verification error:', err);
      const errorMsg = err.response?.data?.error || 'Neuspjela verifikacija';
      setError(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  // Callback kada se SMS kod uspješno verificira
  const handlePhoneVerified = async () => {
    try {
      // Ažuriraj backend da je telefon verificiran
      await api.post('/kyc/verify-identity', {
        type: 'phone',
        value: value
      });
      
      setPhoneVerified(true);
      setSuccess('✓ Telefon je verificiran!');
      
      // Refresh profile
      if (onUpdated) onUpdated();
      
      // Reset
      setTimeout(() => {
        setValue('');
        setSuccess('');
        setPhoneVerified(false);
      }, 3000);
      
    } catch (err) {
      console.error('Phone verification update error:', err);
      setError('Greška pri ažuriranju statusa verifikacije');
    }
  };

  return (
    <div className="space-y-4">
      {/* Verification Type Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Odaberite tip verifikacije:
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setVerificationType('email')}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              verificationType === 'email'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => setVerificationType('phone')}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              verificationType === 'phone'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            📱 Telefon
          </button>
          <button
            onClick={() => setVerificationType('dns')}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              verificationType === 'dns'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            🌐 DNS
          </button>
        </div>
      </div>

      {/* Input Field & Verification */}
      {!profile.identityEmailVerified && !profile.identityPhoneVerified && !profile.identityDnsVerified && (
        <>
          {/* Za Email i DNS - standardni input */}
          {verificationType !== 'phone' && (
            <div className="space-y-2">
              <input
                type={verificationType === 'email' ? 'email' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  verificationType === 'email' 
                    ? 'info@vasafirma.hr'
                    : 'vasafirma.hr'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <button
                onClick={handleVerify}
                disabled={!value || verifying}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {verifying ? 'Verificiram...' : '✓ Verificiraj'}
              </button>
            </div>
          )}

          {/* Za Telefon - koristimo PhoneVerification komponentu */}
          {verificationType === 'phone' && (
            <div className="space-y-4">
              <div>
                <input
                  type="tel"
                  value={value}
                  onChange={(e) => {
                    // Ukloni sve što nije broj ili +
                    let cleaned = e.target.value.replace(/[^\d+]/g, '');
                    // Osiguraj da počinje s +385
                    if (cleaned && !cleaned.startsWith('+385')) {
                      if (cleaned.startsWith('385')) {
                        cleaned = '+' + cleaned;
                      } else if (cleaned.startsWith('0')) {
                        cleaned = '+385' + cleaned.substring(1);
                      } else {
                        cleaned = '+385' + cleaned;
                      }
                    }
                    // Ograniči na +385 + 8-9 znamenki
                    if (cleaned.startsWith('+385')) {
                      const digits = cleaned.substring(4);
                      if (digits.length <= 9) {
                        setValue(cleaned);
                      }
                    } else if (cleaned === '+') {
                      setValue(cleaned);
                    }
                  }}
                  placeholder="+385912345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +385XXXXXXXXX (npr. +385912345678)
                </p>
              </div>
              
              {value && value.startsWith('+385') && value.length >= 12 && (
                <PhoneVerification
                  phone={value}
                  onVerified={handlePhoneVerified}
                  currentPhone={value}
                />
              )}
              
              {(!value || !value.startsWith('+385') || value.length < 12) && (
                <p className="text-sm text-gray-500 text-center">
                  Unesite telefonski broj u formatu +385XXXXXXXXX da biste započeli SMS verifikaciju
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Messages */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">
          ✓ {success}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-xs text-blue-800">
          <strong>Kako to funkcionira?</strong>
        </p>
        <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
          <li><strong>Email:</strong> Verificirajte email na domeni vaše tvrtke (npr. info@vasafirma.hr)</li>
          <li><strong>Telefon:</strong> Verificirajte službeni telefonski broj s web stranice tvrtke</li>
          <li><strong>DNS:</strong> Verificirajte domenu kroz DNS TXT zapis</li>
        </ul>
      </div>
    </div>
  );
}

