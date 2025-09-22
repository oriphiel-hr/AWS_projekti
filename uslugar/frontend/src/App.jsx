import React, { useEffect, useState } from 'react';
import api from './api';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  function saveToken(t) { localStorage.setItem('token', t); setToken(t); }
  function logout(){ localStorage.removeItem('token'); setToken(null); }
  return { token, saveToken, logout };
}

export default function App(){
  const { token, saveToken, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/api/jobs', { params: { q } }).then(r=>setJobs(r.data));
  }, [q]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uslugar</h1>
        <div>
          {token ? <button className="px-3 py-1 border rounded" onClick={logout}>Logout</button> : null}
        </div>
      </header>

      <section className="mt-6">
        <input className="border p-2 w-full" placeholder="Pretraži poslove..." value={q} onChange={e=>setQ(e.target.value)} />
        <ul className="mt-4 space-y-3">
          {jobs.map(j => (
            <li key={j.id} className="border p-4 rounded">
              <div className="font-semibold">{j.title}</div>
              <div className="text-sm text-gray-600">{j.description}</div>
              <div className="text-sm mt-2">Kategorija: {j.category?.name} • Ponude: {j.offers?.length || 0}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}