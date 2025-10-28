import React, { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import api from '../api';
import { QRCodeSVG } from 'qrcode.react';

const ProviderProfile = ({ providerId, onClose }) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchProvider();
    // Provjeri da li je korisnik prijavljen
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId);
      } catch (e) {
        console.log('Token parsing error:', e);
      }
    }
  }, [providerId]);

  const fetchProvider = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/providers/${providerId}`);
      setProvider(response.data);
    } catch (err) {
      setError('Greška pri učitavanju profila');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-lg ${
          star <= rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  // Share profile functionality
  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/#provider/${providerId}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink());
    alert('Link kopiran u međuspremnik!');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getShareableLink());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(getShareableLink());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Greška</h3>
            <p className="text-gray-600 mb-4">{error || 'Profil nije pronađen'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {provider.user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{provider.user.fullName}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(provider.ratingAvg)}
                  <span className="text-sm text-gray-600">
                    {provider.ratingAvg.toFixed(1)} ({provider.ratingCount} recenzija)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>📤</span>
                <span>Dijeli</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bio */}
          {provider.bio && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">O meni</h3>
              <p className="text-gray-700">{provider.bio}</p>
            </div>
          )}

          {/* Categories */}
          {provider.categories && provider.categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategorije</h3>
              <div className="flex flex-wrap gap-2">
                {provider.categories.map(category => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specialties */}
          {provider.specialties && provider.specialties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Specijalizacije</h3>
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {provider.experience && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Iskustvo</h4>
                <p className="text-gray-600">{provider.experience} godina</p>
              </div>
            )}
            {provider.serviceArea && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Područje rada</h4>
                <p className="text-gray-600">{provider.serviceArea}</p>
              </div>
            )}
            {provider.website && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Web stranica</h4>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {provider.website}
                </a>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Status</h4>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  provider.isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-gray-600">
                  {provider.isAvailable ? 'Dostupan' : 'Nedostupan'}
                </span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <ReviewList
            providerId={providerId}
            currentUserId={currentUserId}
            onReviewSubmitted={fetchProvider}
          />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Dijeli profil</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG value={getShareableLink()} size={200} />
              </div>
            </div>

            {/* Shareable Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link profila:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={getShareableLink()}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  📋 Kopiraj
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareOnFacebook}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5]"
              >
                <span>📘</span>
                <span>Facebook</span>
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182]"
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Skeniraj QR kod ili kopiraj link da dijeliš ovaj profil
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;
