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
import AdminPlatformStats from '../pages/AdminPlatformStats'
import AdminModeration from '../pages/AdminModeration'
import AdminDocumentation from '../pages/AdminDocumentation'
import AdminSmsLogs from '../pages/AdminSmsLogs'
import AdminInvoices from '../pages/AdminInvoices'
import AdminUsersOverview from '../pages/AdminUsersOverview'
import AdminDatabaseEditor from '../pages/AdminDatabaseEditor'
import AdminApiReference from '../pages/AdminApiReference'
import UserTypesOverview from '../pages/UserTypesOverview'
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

  // Detektiraj hash linkove koji nisu dio admin panela i preusmjeri na glavnu aplikaciju
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash?.slice(1).split('?')[0];
      if (!hash) return;
      
      // Admin panel rute (hash-ovi koji su dio admin panela)
      const adminHashRoutes = ['admin'];
      // Admin panel path rute (koje se koriste u BrowserRouter)
      const adminPathRoutes = ['payments', 'provider-approvals', 'kyc-metrics', 'verification-documents', 
                               'platform-stats', 'moderation', 'sms-logs', 'invoices', 
                               'users-overview', 'cleanup', 'testing', 'database', 'api-reference', 'user-types'];
      
      // Provjeri da li je hash dio admin panela
      const isAdminHash = adminHashRoutes.includes(hash) || hash.startsWith('admin/');
      const isAdminPath = adminPathRoutes.some(route => hash === route);
      
      // Ako hash postoji i NIJE dio admin panela, preusmjeri na glavnu aplikaciju
      if (!isAdminHash && !isAdminPath) {
        // Resetiraj pathname na root i postavi hash
        const query = window.location.search;
        window.location.href = `/${window.location.hash}${query}`;
      }
    };

    // Interceptiraj klikove na hash linkove
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          const hash = href.slice(1).split('?')[0];
          // Admin panel rute
          const adminHashRoutes = ['admin'];
          const adminPathRoutes = ['payments', 'provider-approvals', 'kyc-metrics', 'verification-documents', 
                                   'platform-stats', 'moderation', 'sms-logs', 'invoices', 
                                   'users-overview', 'cleanup', 'testing', 'database', 'api-reference', 'user-types'];
          
          const isAdminHash = adminHashRoutes.includes(hash) || hash.startsWith('admin/');
          const isAdminPath = adminPathRoutes.some(route => hash === route);
          
          // Ako hash NIJE dio admin panela, resetiraj pathname
          if (!isAdminHash && !isAdminPath) {
            e.preventDefault();
            const query = window.location.search;
            window.location.href = `/${href}${query}`;
          }
        }
      }
    };

    // Provjeri trenutni hash pri učitavanju
    handleHashChange();
    
    // Slušaj hash promjene i klikove
    window.addEventListener('hashchange', handleHashChange);
    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleClick);
    };
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
          <Route path="/admin/platform-stats" element={<AdminPlatformStats />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route path="/admin/documentation" element={<AdminDocumentation />} />
          <Route path="/admin/sms-logs" element={<AdminSmsLogs />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/users-overview" element={<AdminUsersOverview />} />
          <Route path="/admin/cleanup" element={<AdminDataCleanup />} />
          <Route path="/admin/testing" element={<AdminTesting />} />
          <Route path="/admin/database" element={<AdminDatabaseEditor />} />
          <Route path="/admin/api-reference" element={<AdminApiReference />} />
          <Route path="/admin/user-types" element={<UserTypesOverview isAdmin={true} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
