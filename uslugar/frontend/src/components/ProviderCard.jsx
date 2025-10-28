import React from 'react';

const ProviderCard = ({ provider, onViewProfile, onContact }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">
            {provider.user.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {provider.user.fullName}
                {provider.isFeatured && (
                  <span className="ml-2 text-yellow-500 text-sm">⭐ Featured</span>
                )}
              </h3>
              {/* Badge System */}
              <div className="flex flex-wrap gap-1 mt-1">
                {provider.kycVerified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs border border-green-300" title="Business Badge - Potvrđeno u javnim registrima">
                    ✓ Business
                  </span>
                )}
                {(provider.identityEmailVerified || provider.identityPhoneVerified || provider.identityDnsVerified) && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs border border-purple-300" title="Identity Badge - Identitet verificiran">
                    ✓ Identity
                  </span>
                )}
                {provider.safetyInsuranceUrl && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs border border-yellow-300" title="Safety Badge - Polica osiguranja">
                    ✓ Safety
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(provider.ratingAvg)}
              <span className="text-sm text-gray-600 ml-1">
                ({provider.ratingCount})
              </span>
            </div>
          </div>

          {provider.bio && (
            <p className="text-gray-600 mb-3 line-clamp-2">{provider.bio}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {provider.categories?.map(category => (
              <span
                key={category.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>

          {provider.specialties && provider.specialties.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {provider.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              {provider.experience && (
                <span>📅 {provider.experience} godina iskustva</span>
              )}
              {provider.serviceArea && (
                <span>📍 {provider.serviceArea}</span>
              )}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1 ${
                provider.isAvailable ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {provider.isAvailable ? 'Dostupan' : 'Nedostupan'}
            </div>
          </div>

          {provider.website && (
            <div className="mb-4">
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                🌐 {provider.website}
              </a>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => onViewProfile(provider)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pregledaj profil
            </button>
            <button
              onClick={() => onContact(provider)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Kontaktiraj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
