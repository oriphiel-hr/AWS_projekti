import React, { useEffect, useState } from 'react';
import api from './api';
import { AdminRouter } from './admin';
import CrudTab from './components/CrudTab'; // ⬅️ novo

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  function saveToken(t) { localStorage.setItem('token', t); setToken(t); }
  function logout(){ localStorage.removeItem('token'); setToken(null); }
  return { token, saveToken, logout };
}

export default function App(){
  const { token, saveToken, logout } = useAuth();

  // TAB: 'user' | 'admin' | 'crud'
  const [tab, setTab] = useState(() => {
    const hash = window.location.hash?.slice(1);
    return hash === 'admin' || hash === 'crud' ? hash : 'user';
  });

  // USER tab state
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (tab !== 'user') return; // ne dohvaćaj poslove dok si u Admin/CRUD tabu
    api.get('/api/jobs', { params: { q } }).then(r => setJobs(r.data)).catch(() => setJobs([]));
  }, [q, tab]);

  // sync hash radi “deeplinka”
  useEffect(() => {
    if (tab) window.location.hash = tab;
  }, [tab]);

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
          Korisničko
        </button>
        <button
          className={'px-3 py-2 border rounded ' + (tab==='admin' ? 'bg-gray-900 text-white' : '')}
          onClick={() => setTab('admin')}
        >
          Admin
        </button>
        <button
          id="nav-crud"
          className={'px-3 py-2 border rounded ' + (tab==='crud' ? 'bg-gray-900 text-white' : '')}
          onClick={() => setTab('crud')}
        >
          Podaci (CRUD)
        </button>
      </div>

      {tab === 'user' && (
        <section id="user" className="tab-section">
          <input
            className="border p-2 w-full"
            placeholder="Pretraži poslove..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <ul className="mt-4 space-y-3">
            {jobs.map(j => (
              <li key={j.id} className="border p-4 rounded">
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-gray-600">{j.description}</div>
                <div className="text-sm mt-2">
                  Kategorija: {j.category?.name} • Ponude: {j.offers?.length || 0}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'admin' && (
        <section id="admin" className="tab-section">
          <AdminRouter />
        </section>
      )}

      {/* ⬇️ Treći tab koji diže vanilla CRUD kad je aktivan */}
      <CrudTab active={tab === 'crud'} />
    </div>
  );
}
