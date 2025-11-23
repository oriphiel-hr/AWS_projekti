import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminApiReference = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedRoutes, setExpandedRoutes] = useState(new Set());

  useEffect(() => {
    loadApiReference();
  }, []);

  const loadApiReference = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/api-reference');
      setApiData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri učitavanju API reference');
    } finally {
      setLoading(false);
    }
  };

  const toggleRoute = (routeKey) => {
    const newExpanded = new Set(expandedRoutes);
    if (newExpanded.has(routeKey)) {
      newExpanded.delete(routeKey);
    } else {
      newExpanded.add(routeKey);
    }
    setExpandedRoutes(newExpanded);
  };

  const getMethodColor = (method) => {
    const colors = {
      'GET': 'bg-blue-100 text-blue-800 border-blue-300',
      'POST': 'bg-green-100 text-green-800 border-green-300',
      'PUT': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'PATCH': 'bg-orange-100 text-orange-800 border-orange-300',
      'DELETE': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[method] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const filteredRoutes = apiData?.routes ? Object.entries(apiData.routes).filter(([group]) => {
    if (selectedGroup && selectedGroup !== group) return false;
    if (!searchTerm) return true;
    const groupRoutes = apiData.routes[group];
    return groupRoutes.some(route => 
      route.fullPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (route.handler && route.handler.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }) : [];

  const filteredAllRoutes = apiData?.allRoutes ? apiData.allRoutes.filter(route => {
    if (!searchTerm) return true;
    return route.fullPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
           route.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (route.handler && route.handler.toLowerCase().includes(searchTerm.toLowerCase()));
  }) : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Učitavanje API reference...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 API Reference</h1>
        <p className="text-gray-600">Kompletan popis svih API endpointa, metoda i parametara</p>
        {apiData && (
          <div className="mt-2 text-sm text-gray-500">
            Ukupno: <strong>{apiData.totalRoutes}</strong> endpointa
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pretraži</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pretraži po path-u, metodi ili handler-u..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtriraj po grupi</label>
            <select
              value={selectedGroup || ''}
              onChange={(e) => setSelectedGroup(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sve grupe</option>
              {apiData?.routes && Object.keys(apiData.routes).map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grouped View */}
      <div className="space-y-6">
        {filteredRoutes.map(([group, routes]) => (
          <div key={group} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                /api/{group}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({routes.length} endpointa)
                </span>
              </h2>
            </div>
            <div className="divide-y">
              {routes.map((route, index) => {
                const routeKey = `${group}-${route.method}-${route.path}-${index}`;
                const isExpanded = expandedRoutes.has(routeKey);
                return (
                  <div key={routeKey} className="hover:bg-gray-50 transition">
                    <div
                      className="px-6 py-4 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleRoute(routeKey)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className={`px-3 py-1 rounded text-xs font-semibold border ${getMethodColor(route.method)}`}>
                          {route.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900 flex-1">
                          {route.fullPath}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        {route.handler && route.handler !== 'anonymous' && (
                          <span className="text-xs text-gray-500 font-mono">
                            handler: {route.handler}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Method:</span>
                            <span className="ml-2 text-gray-900">{route.method}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Path:</span>
                            <code className="ml-2 text-gray-900 font-mono">{route.fullPath}</code>
                          </div>
                          {route.params && route.params.length > 0 && (
                            <div>
                              <span className="font-semibold text-gray-700">Parametri:</span>
                              <div className="ml-2 mt-1 flex flex-wrap gap-2">
                                {route.params.map((param, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono">
                                    :{param}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {route.security && (
                            <div className="mt-3 pt-3 border-t">
                              <span className="font-semibold text-gray-700 block mb-2">🔒 Sigurnost:</span>
                              <div className="space-y-2">
                                {route.security.authRequired ? (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                      Auth Required
                                    </span>
                                    {route.security.roles && route.security.roles.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {route.security.roles.map((role, idx) => (
                                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                            {role}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                    Javni endpoint
                                  </span>
                                )}
                                {route.security.additionalChecks && route.security.additionalChecks.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-xs font-semibold text-gray-600 block mb-1">Dodatni uvjeti:</span>
                                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                                      {route.security.additionalChecks.map((check, idx) => (
                                        <li key={idx}>{check}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {route.security.businessRules && route.security.businessRules.length > 0 && (
                                  <div className="mt-2 pt-2 border-t">
                                    <span className="text-xs font-semibold text-orange-600 block mb-1">📋 Poslovna ograničenja:</span>
                                    <ul className="list-disc list-inside text-xs text-orange-700 space-y-1">
                                      {route.security.businessRules.map((rule, idx) => (
                                        <li key={idx}>{rule}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {route.handler && route.handler !== 'anonymous' && (
                            <div>
                              <span className="font-semibold text-gray-700">Handler:</span>
                              <code className="ml-2 text-gray-900 font-mono">{route.handler}</code>
                            </div>
                          )}
                          {route.middleware && (
                            <div>
                              <span className="font-semibold text-gray-700">Middleware:</span>
                              <code className="ml-2 text-gray-900 font-mono">{route.middleware}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* All Routes View (Flat) */}
      {searchTerm && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Svi rezultati pretrage</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y">
              {filteredAllRoutes.map((route, index) => {
                const routeKey = `all-${route.method}-${route.fullPath}-${index}`;
                const isExpanded = expandedRoutes.has(routeKey);
                return (
                  <div key={routeKey} className="hover:bg-gray-50 transition">
                    <div
                      className="px-6 py-4 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleRoute(routeKey)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className={`px-3 py-1 rounded text-xs font-semibold border ${getMethodColor(route.method)}`}>
                          {route.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900 flex-1">
                          {route.fullPath}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        {route.handler && route.handler !== 'anonymous' && (
                          <span className="text-xs text-gray-500 font-mono">
                            {route.handler}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Method:</span>
                            <span className="ml-2 text-gray-900">{route.method}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Path:</span>
                            <code className="ml-2 text-gray-900 font-mono">{route.fullPath}</code>
                          </div>
                          {route.params && route.params.length > 0 && (
                            <div>
                              <span className="font-semibold text-gray-700">Parametri:</span>
                              <div className="ml-2 mt-1 flex flex-wrap gap-2">
                                {route.params.map((param, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono">
                                    :{param}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {route.security && (
                            <div className="mt-3 pt-3 border-t">
                              <span className="font-semibold text-gray-700 block mb-2">🔒 Sigurnost:</span>
                              <div className="space-y-2">
                                {route.security.authRequired ? (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                      Auth Required
                                    </span>
                                    {route.security.roles && route.security.roles.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {route.security.roles.map((role, idx) => (
                                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                            {role}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                    Javni endpoint
                                  </span>
                                )}
                                {route.security.additionalChecks && route.security.additionalChecks.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-xs font-semibold text-gray-600 block mb-1">Dodatni uvjeti:</span>
                                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                                      {route.security.additionalChecks.map((check, idx) => (
                                        <li key={idx}>{check}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {route.security.businessRules && route.security.businessRules.length > 0 && (
                                  <div className="mt-2 pt-2 border-t">
                                    <span className="text-xs font-semibold text-orange-600 block mb-1">📋 Poslovna ograničenja:</span>
                                    <ul className="list-disc list-inside text-xs text-orange-700 space-y-1">
                                      {route.security.businessRules.map((rule, idx) => (
                                        <li key={idx}>{rule}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {route.handler && route.handler !== 'anonymous' && (
                            <div>
                              <span className="font-semibold text-gray-700">Handler:</span>
                              <code className="ml-2 text-gray-900 font-mono">{route.handler}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {apiData && apiData.allRoutes && apiData.allRoutes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nema pronađenih endpointa
        </div>
      )}
    </div>
  );
};

export default AdminApiReference;


