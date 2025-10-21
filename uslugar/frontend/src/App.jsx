import React, { useEffect, useState } from 'react';
import api from '@/api'
import { AdminRouter } from './admin';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import ProviderCard from './components/ProviderCard';
import UserRegister from './pages/UserRegister';
import ProviderRegister from './pages/ProviderRegister';
import UpgradeToProvider from './pages/UpgradeToProvider';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  function saveToken(t) { localStorage.setItem('token', t); setToken(t); }
  function logout(){ localStorage.removeItem('token'); setToken(null); }
  return { token, saveToken, logout };
}

export default function App(){
  const { token, saveToken, logout } = useAuth();

  // TAB: 'user' | 'admin' | 'register-user' | 'register-provider' | 'upgrade-to-provider' | 'verify' | 'forgot-password' | 'reset-password'
  const [tab, setTab] = useState(() => {
    const hash = window.location.hash?.slice(1).split('?')[0];
    return ['admin', 'register-user', 'register-provider', 'upgrade-to-provider', 'verify', 'forgot-password', 'reset-password'].includes(hash) ? hash : 'user';
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
    // Dohvati kategorije
    api.get('/categories').then(r => setCategories(r.data)).catch(() => setCategories([]));
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
      const validTabs = ['admin', 'register-user', 'register-provider', 'upgrade-to-provider', 'verify', 'forgot-password', 'reset-password', 'user'];
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
        <h1 className="text-2xl font-bold">Uslugar</h1>
        <div className="flex items-center gap-2">
          {token ? <button className="px-3 py-1 border rounded" onClick={logout}>Logout</button> : null}
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
              className={'px-3 py-2 border rounded ' + (tab==='register-user' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600')}
              onClick={() => setTab('register-user')}
            >
              Registracija korisnika
            </button>
            <button
              className={'px-3 py-2 border rounded ' + (tab==='register-provider' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600')}
              onClick={() => setTab('register-provider')}
            >
              Registracija providera
            </button>
          </>
        )}
        {token && (
          <button
            className={'px-3 py-2 border rounded ' + (tab==='upgrade-to-provider' ? 'bg-purple-600 text-white' : 'border-purple-600 text-purple-600')}
            onClick={() => setTab('upgrade-to-provider')}
          >
            Postani pružatelj
          </button>
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
    </div>
  );
}
