// Admin Documentation - Dokumentacija za administratore
import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext.jsx';

const AdminDocumentation = () => {
  const { isDarkMode } = useDarkMode();
  
  const adminFeatures = [
    {
      category: "Upravljanje Korisnicima i Pružateljima",
      items: [
        { name: "Upravljanje korisnicima", implemented: true },
        { name: "Upravljanje pružateljima", implemented: true },
        { name: "Upravljanje kategorijama", implemented: true },
        { name: "Upravljanje pravnim statusima", implemented: true }
      ]
    },
    {
      category: "Upravljanje Sadržajem",
      items: [
        { name: "Upravljanje poslovima", implemented: true },
        { name: "Upravljanje ponudama", implemented: true },
        { name: "Admin upravljanje recenzijama", implemented: true },
        { name: "Upravljanje notifikacijama", implemented: true },
        { name: "Upravljanje chat sobama", implemented: true },
        { name: "Moderacija sadržaja", implemented: true }
      ]
    },
    {
      category: "Upravljanje Pretplatama i Transakcijama",
      items: [
        { name: "Upravljanje pretplatama", implemented: true },
        { name: "Upravljanje transakcijama kredita", implemented: true },
        { name: "Admin odobravanje refund-a", implemented: true },
        { name: "Admin upravljanje queue sustavom", implemented: true },
        { name: "Upravljanje ROI statistikama", implemented: true }
      ]
    },
    {
      category: "Verifikacije i Licence",
      items: [
        { name: "Upravljanje licencama", implemented: true },
        { name: "Verificiranje licenci od strane admina", implemented: true },
        { name: "Upravljanje verifikacijama klijenata", implemented: true },
        { name: "Dokumenti za verifikaciju", implemented: true },
        { name: "Admin reset SMS pokušaja", implemented: true }
      ]
    },
    {
      category: "Statistike i Analitika",
      items: [
        { name: "Statistike platforme", implemented: true },
        { name: "KYC Metrike", implemented: true },
        { name: "Provider Approvals", implemented: true }
      ]
    }
  ];

  const getStatusColor = (implemented, deprecated = false) => {
    if (deprecated) return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
    return implemented
      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600';
  };

  const getStatusText = (implemented, deprecated = false) => {
    if (deprecated) return '⚠️ NE KORISTI SE';
    return implemented ? '✓ Implementirano' : '✗ Nije implementirano';
  };

  const getImplementationStats = () => {
    const totalItems = adminFeatures.reduce(
      (sum, category) => sum + category.items.length, 0
    );
    const implementedItems = adminFeatures.reduce(
      (sum, category) => sum + category.items.filter(item => item.implemented).length, 0
    );
    const percentage = Math.round((implementedItems / totalItems) * 100);
    
    return { totalItems, implementedItems, percentage };
  };

  const stats = getImplementationStats();

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDarkMode ? 'dark' : ''}`}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🔐 Uslugar - Admin Dokumentacija
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Kompletna lista svih admin funkcionalnosti platforme
        </p>
        
        {/* Statistike implementacije */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Status Implementacije</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.implementedItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Implementirane funkcionalnosti</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.totalItems - stats.implementedItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Nije implementirano</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Završeno</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategorije funkcionalnosti */}
      <div className="space-y-8">
        {adminFeatures.map((category, categoryIndex) => (
          <div 
            key={categoryIndex}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(item.implemented, item.deprecated)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${item.deprecated ? 'line-through' : ''}`}>
                        {item.name}
                      </h3>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {getStatusText(item.implemented, item.deprecated)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Napomena */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
          ℹ️ Napomena
        </h3>
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          Ova dokumentacija je dostupna samo administratorima platforme. 
          Funkcionalnosti su organizirane po kategorijama radi lakšeg pronalaska.
        </p>
      </div>
    </div>
  );
};

export default AdminDocumentation;

