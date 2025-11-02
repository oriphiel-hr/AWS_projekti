/* src/admin/router.jsx */
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import ModelPage from './ModelPage'
import Login from './Login'
import AdminPayments from '../pages/AdminPayments'
import AdminProviderApprovals from '../pages/AdminProviderApprovals'
import AdminKYCMetrics from '../pages/AdminKYCMetrics'
import AdminDataCleanup from '../pages/AdminDataCleanup'
import AdminTesting from '../pages/AdminTesting'
import AdminVerificationDocuments from '../pages/AdminVerificationDocuments'
import api from '../api'

// Model nazivi u PascalCase kako backend očekuje
export const MODELS = [
  'User',
  'ProviderProfile',
  'Category',
  'Job',
  'Offer',
  'Review',
  'Notification',
  'ChatRoom',
  'ChatMessage',
  'Subscription',
  'SubscriptionPlan',
  'LegalStatus'
]

export default function AdminRouter(){
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Provjeri da li postoji token u localStorage
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Postavi token u axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Postavi token u axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={logout} />}>
          <Route index element={<Navigate to={`/admin/${MODELS[0]}`} replace />} />
          {MODELS.map(m => (
            <Route key={m} path={`/admin/${m}`} element={<ModelPage model={m} />} />
          ))}
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/provider-approvals" element={<AdminProviderApprovals />} />
          <Route path="/admin/kyc-metrics" element={<AdminKYCMetrics />} />
          <Route path="/admin/verification-documents" element={<AdminVerificationDocuments />} />
          <Route path="/admin/cleanup" element={<AdminDataCleanup />} />
          <Route path="/admin/testing" element={<AdminTesting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
