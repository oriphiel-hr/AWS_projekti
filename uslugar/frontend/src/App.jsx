import React, { useEffect, useState } from 'react';
import api from '@/api'
import { AdminRouter } from './admin';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import ProviderCard from './components/ProviderCard';
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';
import ProviderRegister from './pages/ProviderRegister';
import UpgradeToProvider from './pages/UpgradeToProvider';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Pricing from './pages/Pricing';
// USLUGAR EXCLUSIVE components
import LeadMarketplace from './pages/LeadMarketplace';
import ROIDashboard from './pages/ROIDashboard';
import MyLeads from './pages/MyLeads';
import SubscriptionPlans from './pages/SubscriptionPlans';
import CreditsWidget from './components/CreditsWidget';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  function saveToken(t) { localStorage.setItem('token', t); setToken(t); }
  function logout(){ localStorage.removeItem('token'); setToken(null); }
  return { token, saveToken, logout };
}

export default function App(){
  const { token, saveToken, logout } = useAuth();

  // TAB: 'user' | 'admin' | 'login' | 'register-user' | 'register-provider' | 'upgrade-to-provider' | 'verify' | 'forgot-password' | 'reset-password' | 'leads' | 'my-leads' | 'roi' | 'subscription' | 'pricing'
  const [tab, setTab] = useState(() => {
    const hash = window.location.hash?.slice(1).split('?')[0];
    const validTabs = ['admin', 'login', 'register-user', 'register-provider', 'upgrade-to-provider', 'verify', 'forgot-password', 'reset-password', 'leads', 'my-leads', 'roi', 'subscription', 'pricing'];
    return validTabs.includes(hash) ? hash : 'user';
  });

  // USER tab state
  const [jobs, setJobs] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    categoryId: '',
    city: '',
    budgetMin: '',
    budgetMax: ''
  });

  useEffect(() => {
    if (tab !== 'user') return;
    
    // Dohvati poslove s filterima
    const params = { q, ...filters };
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key];
    });
    
    api.get('/jobs', { params }).then(r => setJobs(r.data)).catch(() => setJobs([]));
  }, [q, tab, filters]);

  useEffect(() => {
    // Dohvati kategorije s API-ja
    console.log('🔄 Učitavam kategorije s API-ja...');
    api.get('/categories')
      .then(r => {
        console.log('✅ Kategorije uspješno učitane iz baze:', r.data);
        setCategories(r.data);
      })
      .catch(err => {
        console.log('❌ Greška pri učitavanju kategorija:', err);
        setCategories([]);
      });
  }, []);

  const handleJobSubmit = async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      setJobs(prev => [response.data, ...prev]);
      setShowJobForm(false);
      alert('Posao uspješno objavljen!');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Greška pri objavljivanju posla');
    }
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const handleMakeOffer = (job) => {
    if (!token) {
      alert('Morate se prijaviti da biste poslali ponudu');
      return;
    }
    // TODO: Implementirati modal za slanje ponude
    console.log('Make offer for job:', job);
  };

  const handleViewProviderProfile = (provider) => {
    // TODO: Implementirati modal za pregled profila
    console.log('View provider profile:', provider);
  };

  const handleContactProvider = (provider) => {
    // TODO: Implementirati chat ili kontakt
    console.log('Contact provider:', provider);
  };

  // sync hash radi "deeplinka"
  useEffect(() => {
    const currentHash = window.location.hash?.slice(1).split('?')[0];
    if (tab && currentHash !== tab) {
      window.location.hash = '#' + tab;
    }
  }, [tab]);

  // Listen for hash changes (back/forward navigation, external links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash?.slice(1).split('?')[0];
      const validTabs = ['admin', 'login', 'register-user', 'register-provider', 'upgrade-to-provider', 'verify', 'forgot-password', 'reset-password', 'user', 'leads', 'my-leads', 'roi', 'subscription', 'pricing'];
      if (validTabs.includes(hash)) {
        setTab(hash);
      } else if (!hash) {
        setTab('user');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Uslugar <span className="text-green-600">EXCLUSIVE</span>
        </h1>
        <div className="flex items-center gap-3">
          {token && <CreditsWidget />}
          {token ? <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={logout}>Logout</button> : null}
        </div>
      </header>

      {/* TABS */}
      <div className="flex gap-2 mt-6 mb-4">
        <button
          className={'px-3 py-2 border rounded ' + (tab==='user' ? 'bg-gray-900 text-white' : '')}
          onClick={() => setTab('user')}
        >
          Poslovi
        </button>
        {!token && (
          <>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='login' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600')}
              onClick={() => setTab('login')}
            >
              Prijava
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='register-user' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600')}
              onClick={() => setTab('register-user')}
            >
              Registracija korisnika
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='register-provider' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600')}
              onClick={() => setTab('register-provider')}
            >
              Registracija providera
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='categories' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600')}
              onClick={() => setTab('categories')}
            >
              🛠️ Kategorije ({categories.length})
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='pricing' ? 'bg-orange-600 text-white' : 'border-orange-600 text-orange-600')}
              onClick={() => setTab('pricing')}
            >
              💰 Cjenik
            </button>
          </>
        )}
        {token && (
          <>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='upgrade-to-provider' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600')}
              onClick={() => setTab('upgrade-to-provider')}
            >
              Postani pružatelj
            </button>
            {/* USLUGAR EXCLUSIVE tabs - samo za PROVIDER role */}
            <button
              className={'px-3 py-2 border rounded ' + (tab==='leads' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600')}
              onClick={() => setTab('leads')}
            >
              🛒 Leadovi
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='my-leads' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600')}
              onClick={() => setTab('my-leads')}
            >
              📋 Moji Leadovi
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='roi' ? 'bg-yellow-600 text-white' : 'border-yellow-600 text-yellow-600')}
              onClick={() => setTab('roi')}
            >
              📊 ROI
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='subscription' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600')}
              onClick={() => setTab('subscription')}
            >
              💳 Pretplata
            </button>
          </>
        )}
        <button
          className={'px-3 py-2 border rounded ml-auto ' + (tab==='admin' ? 'bg-gray-900 text-white' : '')}
          onClick={() => setTab('admin')}
        >
          Admin Panel
        </button>
      </div>

      {tab === 'user' && (
        <section id="user" className="tab-section">
          {/* Hero CTA Section - na vrhu */}
          {!token && (
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">
                  🚀 Ekskluzivni Leadovi bez Konkurencije
                </h2>
                <p className="text-lg mb-4 opacity-90">
                  1 lead = 1 izvođač | Refund ako klijent ne odgovori
                </p>
                
                {/* Prednosti za korisnike i pružatelje */}
                <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <h3 className="text-base font-semibold mb-2">👥 Za Korisnike</h3>
                    <p className="text-sm opacity-90">
                      Brže pronalaženje kvalitetnih pružatelja usluga. Samo jedan kontakt, bez spam poruka.
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <h3 className="text-base font-semibold mb-2">🎯 Za Pružatelje</h3>
                    <p className="text-sm opacity-90">
                      Samo vi dobivate kontakt klijenta. Nema drugih izvođača koji konkuriraju za isti posao. Ako klijent ne odgovori u roku od 48 sati, automatski dobivate refund kredita.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setTab('pricing')}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                  >
                    💰 Pogledaj Cjenik
                  </button>
                  <button
                    onClick={() => setTab('register-provider')}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                  >
                    🎯 Registriraj se kao Pružatelj
                  </button>
                </div>
                
                <div className="mt-4 text-xs opacity-75">
                  <p>✓ Ekskluzivni leadovi ✓ Refund sistem ✓ ROI statistika ✓ AI prioritet</p>
                </div>
              </div>
            </div>
          )}


          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Poslovi</h2>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Objavi posao
              </button>
            </div>

            {/* Search i filteri */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  className="border p-2 rounded-lg"
                  placeholder="Pretraži poslove..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
                <select
                  className="border p-2 rounded-lg"
                  value={filters.categoryId}
                  onChange={e => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                >
                  <option value="">Sve kategorije</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  className="border p-2 rounded-lg"
                  placeholder="Grad"
                  value={filters.city}
                  onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />
                <div className="flex gap-2">
                  <input
                    className="border p-2 rounded-lg flex-1"
                    placeholder="Min budžet"
                    type="number"
                    value={filters.budgetMin}
                    onChange={e => setFilters(prev => ({ ...prev, budgetMin: e.target.value }))}
                  />
                  <input
                    className="border p-2 rounded-lg flex-1"
                    placeholder="Max budžet"
                    type="number"
                    value={filters.budgetMax}
                    onChange={e => setFilters(prev => ({ ...prev, budgetMax: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Job form modal */}
            {showJobForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Objavi novi posao</h3>
                    <button
                      onClick={() => setShowJobForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <JobForm
                    onSubmit={handleJobSubmit}
                    categories={categories}
                  />
                </div>
              </div>
            )}

            {/* Jobs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewJobDetails}
                  onMakeOffer={handleMakeOffer}
                />
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nema pronađenih poslova</p>
                <p className="text-gray-400">Pokušajte promijeniti filtere ili objavite novi posao</p>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'admin' && (
        <section id="admin" className="tab-section">
          <AdminRouter />
        </section>
      )}

      {tab === 'login' && (
        <section id="login" className="tab-section">
          <Login onSuccess={(token, user) => {
            saveToken(token);
            setTab('user');
          }} />
        </section>
      )}

      {tab === 'register-user' && (
        <section id="register-user" className="tab-section">
          <UserRegister onSuccess={(token, user) => {
            saveToken(token);
            setTab('user');
          }} />
        </section>
      )}

      {tab === 'register-provider' && (
        <section id="register-provider" className="tab-section">
          <ProviderRegister onSuccess={(token, user) => {
            saveToken(token);
            setTab('user');
          }} />
        </section>
      )}

      {tab === 'verify' && (
        <section id="verify" className="tab-section">
          <VerifyEmail />
        </section>
      )}

      {tab === 'forgot-password' && (
        <section id="forgot-password" className="tab-section">
          <ForgotPassword />
        </section>
      )}

      {tab === 'reset-password' && (
        <section id="reset-password" className="tab-section">
          <ResetPassword />
        </section>
      )}

      {tab === 'upgrade-to-provider' && (
        <section id="upgrade-to-provider" className="tab-section">
          <UpgradeToProvider />
        </section>
      )}

      {/* USLUGAR EXCLUSIVE pages */}
      {tab === 'leads' && (
        <section id="leads" className="tab-section">
          <LeadMarketplace />
        </section>
      )}

      {tab === 'my-leads' && (
        <section id="my-leads" className="tab-section">
          <MyLeads />
        </section>
      )}

      {tab === 'roi' && (
        <section id="roi" className="tab-section">
          <ROIDashboard />
        </section>
      )}

      {tab === 'subscription' && (
        <section id="subscription" className="tab-section">
          <SubscriptionPlans />
        </section>
      )}

      {tab === 'categories' && (
        <section id="categories" className="tab-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                🛠️ Dostupne Kategorije Usluga
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Dinamički učitano iz baze: <span className="font-semibold text-green-600">{categories.length}</span> kategorija
              </p>
              <p className="text-sm text-gray-500">
                Kliknite na kategoriju da vidite detalje ili filtrirate poslove
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setFilters(prev => ({ ...prev, categoryId: category.id }))}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {category.icon || '🛠️'}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {category.description}
                    </p>
                    {category.requiresLicense && (
                      <div className="mt-2">
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          🔐 Licencirano
                        </span>
                        {category.licenseType && (
                          <div className="mt-1">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {category.licenseType}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Učitavanje kategorija...</h3>
                <p className="text-gray-500">Molimo pričekajte dok se kategorije učitavaju iz baze podataka.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'pricing' && (
        <section id="pricing" className="tab-section">
          <Pricing />
        </section>
      )}
    </div>
  );
}
