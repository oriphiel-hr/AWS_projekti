import React, { useEffect, useState } from 'react';
import api from '@/api'
import { AdminRouter } from './admin';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import ProviderCard from './components/ProviderCard';
import ReviewList from './components/ReviewList';
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';
import ProviderRegister from './pages/ProviderRegister';
import ProviderProfile from './pages/ProviderProfile';
import ProviderProfileModal from './components/ProviderProfile';
import UpgradeToProvider from './pages/UpgradeToProvider';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Pricing from './pages/Pricing';
import TimeLanding from './pages/TimeLanding';
import Documentation from './pages/Documentation';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
// USLUGAR EXCLUSIVE components
import LeadMarketplace from './pages/LeadMarketplace';
import ROIDashboard from './pages/ROIDashboard';
import MyLeads from './pages/MyLeads';
import SubscriptionPlans from './pages/SubscriptionPlans';
import CreditsWidget from './components/CreditsWidget';
// Navigation components
import DropdownMenu from './components/DropdownMenu';
import MobileMenu from './components/MobileMenu';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  function saveToken(t) { localStorage.setItem('token', t); setToken(t); }
  function logout(){ localStorage.removeItem('token'); setToken(null); }
  return { token, saveToken, logout };
}

export default function App(){
  const { token, saveToken, logout } = useAuth();

  // TAB: 'user' | 'admin' | 'login' | 'register-user' | 'register-provider' | 'upgrade-to-provider' | 'verify' | 'forgot-password' | 'reset-password' | 'leads' | 'my-leads' | 'roi' | 'subscription' | 'pricing' | 'providers' | 'documentation' | 'faq'
  const [tab, setTab] = useState(() => {
    const hash = window.location.hash?.slice(1).split('?')[0];
    const validTabs = ['admin', 'login', 'register-user', 'register-provider', 'provider-profile', 'upgrade-to-provider', 'verify', 'forgot-password', 'reset-password', 'leads', 'my-leads', 'roi', 'subscription', 'subscription-success', 'pricing', 'providers', 'documentation', 'faq', 'about', 'contact', 'time-landing'];
    return validTabs.includes(hash) ? hash : 'time-landing';
  });

  // USER tab state
  const [jobs, setJobs] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filters, setFilters] = useState({
    categoryId: '',
    city: '',
    budgetMin: '',
    budgetMax: ''
  });
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (tab !== 'providers') return;
    
    // Dohvati providere s API-ja
    console.log('🔄 Učitavam providere s API-ja...');
    api.get('/providers')
      .then(r => {
        console.log('✅ Provideri uspješno učitani iz baze:', r.data);
        setProviders(r.data);
      })
      .catch(err => {
        console.log('❌ Greška pri učitavanju providera:', err);
        setProviders([]);
      });
  }, [tab]);

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

  const handleViewProviderProfile = (provider) => {
    setSelectedProvider(provider);
  };

  const handleCloseProviderProfile = () => {
    setSelectedProvider(null);
  };

  const handleMakeOffer = (job) => {
    if (!token) {
      alert('Morate se prijaviti da biste poslali ponudu');
      return;
    }
    // TODO: Implementirati modal za slanje ponude
    console.log('Make offer for job:', job);
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
      const validTabs = ['admin', 'login', 'register-user', 'register-provider', 'upgrade-to-provider', 'verify', 'forgot-password', 'reset-password', 'user', 'leads', 'my-leads', 'roi', 'subscription', 'pricing', 'providers', 'categories', 'documentation'];
      
      // Check for provider direct link: #provider/{providerId}
      const providerMatch = hash.match(/^provider\/(.+)$/);
      if (providerMatch) {
        const providerId = providerMatch[1];
        // Fetch and display provider
        api.get(`/providers/${providerId}`)
          .then(response => {
            // API vraća { user, reviews } gdje user ima providerProfile
            const providerData = {
              ...response.data.user.providerProfile,
              user: response.data.user,
              reviews: response.data.reviews
            };
            setSelectedProvider(providerData);
            setTab('providers'); // Switch to providers tab
          })
          .catch(err => {
            console.error('Error loading provider:', err);
            setTab('providers');
          });
        return;
      }
      
      if (validTabs.includes(hash)) {
        setTab(hash);
      } else if (!hash) {
        setTab('user');
      }
    };
    
    // Check initial hash on load
    handleHashChange();
    
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

      {/* NAVIGATION */}
      <div className="mt-6 mb-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Main Navigation */}
          <button
            className={'px-3 py-2 border rounded ' + (tab==='user' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100')}
            onClick={() => setTab('user')}
          >
            🏠 Početna
          </button>
          <button
            className={'px-3 py-2 border rounded ' + (tab==='pricing' ? 'bg-orange-600 text-white' : 'border-orange-600 text-orange-600 hover:bg-orange-50')}
            onClick={() => setTab('pricing')}
          >
            💰 Cjenik
          </button>
          <button
            className={'px-3 py-2 border rounded ' + (tab==='faq' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600 hover:bg-purple-50')}
            onClick={() => setTab('faq')}
          >
            ❓ FAQ
          </button>
          <button
            className={'px-3 py-2 border rounded ' + (tab==='documentation' ? 'bg-indigo-600 text-white' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50')}
            onClick={() => setTab('documentation')}
          >
            📚 Dokumentacija
          </button>
          <button
            className={'px-3 py-2 border rounded ' + (tab==='about' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600 hover:bg-green-50')}
            onClick={() => setTab('about')}
          >
            🏢 O nama
          </button>
          <button
            className={'px-3 py-2 border rounded ' + (tab==='contact' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-50')}
            onClick={() => setTab('contact')}
          >
            📞 Kontakt
          </button>

          {/* Dropdown Menus */}
          {!token && (
            <>
              <DropdownMenu title="👤 Korisnik" icon="👤">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('login'); }}
                >
                  🔑 Prijava
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('register-user'); }}
                >
                  👤 Registracija korisnika
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('register-provider'); }}
                >
                  🏢 Registracija providera
                </button>
              </DropdownMenu>

              <DropdownMenu title="🛠️ Usluge" icon="🛠️">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('categories'); }}
                >
                  🛠️ Kategorije ({categories.length})
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('providers'); }}
                >
                  👥 Pružatelji ({providers.length})
                </button>
              </DropdownMenu>
            </>
          )}

          {token && (
            <>
              <DropdownMenu title="🛒 Leadovi" icon="🛒">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('leads'); }}
                >
                  🛒 Leadovi
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('my-leads'); }}
                >
                  📋 Moji Leadovi
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('roi'); }}
                >
                  📊 ROI
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { setTab('subscription'); }}
                >
                  💳 Pretplata
                </button>
              </DropdownMenu>

              <button
                className={'px-3 py-2 border rounded ' + (tab==='provider-profile' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-50')}
                onClick={() => setTab('provider-profile')}
              >
                👤 Moj profil
              </button>
              <button
                className={'px-3 py-2 border rounded ' + (tab==='upgrade-to-provider' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600 hover:bg-purple-50')}
                onClick={() => setTab('upgrade-to-provider')}
              >
                🏢 Postani pružatelj
              </button>
            </>
          )}

          {/* Admin Panel */}
          <button
            className={'px-3 py-2 border rounded ml-auto ' + (tab==='admin' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100')}
            onClick={() => setTab('admin')}
          >
            ⚙️ Admin Panel
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className={'px-3 py-2 border rounded ' + (tab==='user' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100')}
              onClick={() => setTab('user')}
            >
              🏠
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='pricing' ? 'bg-orange-600 text-white' : 'border-orange-600 text-orange-600')}
              onClick={() => setTab('pricing')}
            >
              💰
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='faq' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600')}
              onClick={() => setTab('faq')}
            >
              ❓
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='documentation' ? 'bg-indigo-600 text-white' : 'border-indigo-600 text-indigo-600')}
              onClick={() => setTab('documentation')}
            >
              📚
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='about' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600')}
              onClick={() => setTab('about')}
            >
              🏢
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='contact' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600')}
              onClick={() => setTab('contact')}
            >
              📞
            </button>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="px-3 py-2 border rounded hover:bg-gray-100"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <div className="space-y-4">
          {/* Main Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Glavno</h3>
            <div className="space-y-1">
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='user' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('user'); setIsMobileMenuOpen(false); }}
              >
                🏠 Početna
              </button>
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='pricing' ? 'bg-orange-600 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('pricing'); setIsMobileMenuOpen(false); }}
              >
                💰 Cjenik
              </button>
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='faq' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('faq'); setIsMobileMenuOpen(false); }}
              >
                ❓ FAQ
              </button>
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='documentation' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('documentation'); setIsMobileMenuOpen(false); }}
              >
                📚 Dokumentacija
              </button>
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='about' ? 'bg-green-600 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('about'); setIsMobileMenuOpen(false); }}
              >
                🏢 O nama
              </button>
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='contact' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('contact'); setIsMobileMenuOpen(false); }}
              >
                📞 Kontakt
              </button>
            </div>
          </div>

          {/* User Section */}
          {!token && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Korisnici</h3>
              <div className="space-y-1">
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('login'); setIsMobileMenuOpen(false); }}
                >
                  🔑 Prijava
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('register-user'); setIsMobileMenuOpen(false); }}
                >
                  👤 Registracija korisnika
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('register-provider'); setIsMobileMenuOpen(false); }}
                >
                  🏢 Registracija providera
                </button>
              </div>
            </div>
          )}

          {/* Services Section */}
          {!token && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Usluge</h3>
              <div className="space-y-1">
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('categories'); setIsMobileMenuOpen(false); }}
                >
                  🛠️ Kategorije ({categories.length})
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('providers'); setIsMobileMenuOpen(false); }}
                >
                  👥 Pružatelji ({providers.length})
                </button>
              </div>
            </div>
          )}

          {/* Provider Section */}
          {token && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Leadovi</h3>
              <div className="space-y-1">
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('leads'); setIsMobileMenuOpen(false); }}
                >
                  🛒 Leadovi
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('my-leads'); setIsMobileMenuOpen(false); }}
                >
                  📋 Moji Leadovi
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('roi'); setIsMobileMenuOpen(false); }}
                >
                  📊 ROI
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('subscription'); setIsMobileMenuOpen(false); }}
                >
                  💳 Pretplata
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('provider-profile'); setIsMobileMenuOpen(false); }}
                >
                  👤 Moj profil
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => { setTab('upgrade-to-provider'); setIsMobileMenuOpen(false); }}
                >
                  🏢 Postani pružatelj
                </button>
              </div>
            </div>
          )}

          {/* Admin Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Admin</h3>
            <div className="space-y-1">
              <button
                className={'w-full text-left px-3 py-2 rounded ' + (tab==='admin' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100')}
                onClick={() => { setTab('admin'); setIsMobileMenuOpen(false); }}
              >
                ⚙️ Admin Panel
              </button>
            </div>
          </div>
        </div>
      </MobileMenu>

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

      {tab === 'time-landing' && (
        <section id="time-landing" className="tab-section">
          <TimeLanding />
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

      {tab === 'provider-profile' && (
        <section id="provider-profile" className="tab-section">
          <ProviderProfile onSuccess={() => {
            // Refresh data if needed
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

      {tab === 'subscription-success' && (
        <section id="subscription-success" className="tab-section">
          <PaymentSuccess setTab={setTab} />
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
            
            {/* Glavne kategorije (bez parentId) */}
            <div className="space-y-8">
              {categories
                .filter(category => !category.parentId)
                .map(parentCategory => {
                  const subcategories = categories.filter(cat => cat.parentId === parentCategory.id);
                  
                  return (
                    <div key={parentCategory.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      {/* Glavna kategorija */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl">
                          {parentCategory.icon || '🛠️'}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {parentCategory.name}
                          </h2>
                          <p className="text-gray-600 mb-2">
                            {parentCategory.description}
                          </p>
                          {parentCategory.requiresLicense && (
                            <div className="flex gap-2">
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                🔐 Licencirano
                              </span>
                              {parentCategory.licenseType && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {parentCategory.licenseType}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, categoryId: parentCategory.id }))}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Filtrirati poslove
                        </button>
                      </div>
                      
                      {/* Podkategorije */}
                      {subcategories.length > 0 && (
                        <div className="border-t pt-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            📂 Podkategorije ({subcategories.length})
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {subcategories.map(subcategory => (
                              <div 
                                key={subcategory.id} 
                                className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setFilters(prev => ({ ...prev, categoryId: subcategory.id }))}
                              >
                                <div className="text-center">
                                  <div className="text-xl mb-1">
                                    {subcategory.icon || '🔧'}
                                  </div>
                                  <h4 className="font-semibold text-xs text-gray-800 mb-1">
                                    {subcategory.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 overflow-hidden" style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                  }}>
                                    {subcategory.description}
                                  </p>
                                  {subcategory.requiresLicense && (
                                    <div className="mt-1">
                                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5 rounded-full">
                                        🔐
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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

      {tab === 'providers' && (
        <section id="providers" className="tab-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                👥 Pružatelji Usluga
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Dinamički učitano iz baze: <span className="font-semibold text-blue-600">{providers.length}</span> pružatelja
              </p>
              <p className="text-sm text-gray-500">
                Kliknite na pružatelja da vidite profil i recenzije
              </p>
            </div>
            
            {/* Sortiraj providere po broju bedževa */}
            {(() => {
              const sortedProviders = [...providers].sort((a, b) => {
                // Izračunaj broj badge-ova
                const getBadgeCount = (provider) => {
                  let count = 0;
                  
                  // Business badge (iz badgeData ili kycVerified)
                  if (provider.kycVerified || (provider.badgeData && provider.badgeData.BUSINESS?.verified)) count++;
                  
                  // Identity badge
                  if (provider.identityEmailVerified || provider.identityPhoneVerified || provider.identityDnsVerified) count++;
                  
                  // Safety badge
                  if (provider.safetyInsuranceUrl) count++;
                  
                  return count;
                };
                
                const countA = getBadgeCount(a);
                const countB = getBadgeCount(b);
                
                // Sortiraj po broju badge-ova (desc), zatim po rating (desc)
                if (countB !== countA) {
                  return countB - countA;
                }
                return (b.ratingAvg || 0) - (a.ratingAvg || 0);
              });
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProviders.map(provider => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onViewProfile={handleViewProviderProfile}
                      onContact={handleContactProvider}
                    />
                  ))}
                </div>
              );
            })()}
            
            {providers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nema pružatelja usluga</h3>
                <p className="text-gray-500">Trenutno nema registriranih pružatelja usluga.</p>
              </div>
            )}
          </div>
        </section>
      )}

              {tab === 'pricing' && (
          <section id="pricing" className="tab-section">
            <Pricing setTab={setTab} />
        </section>
      )}

      {tab === 'documentation' && (
        <section id="documentation" className="tab-section">
          <Documentation />
        </section>
      )}

      {tab === 'faq' && (
        <section id="faq" className="tab-section">
          <FAQ />
        </section>
      )}

      {tab === 'about' && (
        <section id="about" className="tab-section">
          <About />
        </section>
      )}

      {tab === 'contact' && (
        <section id="contact" className="tab-section">
          <Contact />
        </section>
      )}

      {/* Provider Profile Modal */}
      {selectedProvider && (
        <ProviderProfileModal
          providerId={selectedProvider.userId || selectedProvider.user?.id}
          onClose={handleCloseProviderProfile}
        />
      )}
    </div>
  );
}
