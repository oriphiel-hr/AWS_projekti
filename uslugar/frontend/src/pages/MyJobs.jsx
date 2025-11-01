import { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../App.jsx';

export default function MyJobs({ onNavigate }) {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [offers, setOffers] = useState({});

  useEffect(() => {
    if (!token) {
      if (onNavigate) onNavigate('login');
      return;
    }

    loadMyJobs();
  }, [token]);

  const loadMyJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs', {
        params: {
          myJobs: true // Backend će filtrirati po userId iz tokena
        }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading my jobs:', error);
      alert('Greška pri učitavanju poslova');
    } finally {
      setLoading(false);
    }
  };

  const loadOffers = async (jobId) => {
    try {
      const response = await api.get(`/offers/job/${jobId}`);
      setOffers(prev => ({ ...prev, [jobId]: response.data }));
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  const acceptOffer = async (offerId, jobId) => {
    if (!confirm('Jeste li sigurni da želite prihvatiti ovu ponudu?')) {
      return;
    }

    try {
      await api.patch(`/offers/${offerId}/accept`);
      alert('Ponuda je prihvaćena!');
      await loadMyJobs();
      await loadOffers(jobId);
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Greška pri prihvaćanju ponude');
    }
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    if (!offers[job.id]) {
      loadOffers(job.id);
    }
  };

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Morate se prijaviti</h1>
          <button
            onClick={() => onNavigate && onNavigate('login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Prijava
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Moji Poslovi</h1>
        <p className="text-gray-600">Pregledajte sve poslove koje ste objavili i primljene ponude</p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Nemate još objavljenih poslova.</p>
          <button
            onClick={() => onNavigate && onNavigate('user')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Objavi novi posao
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>📍 {job.city}</span>
                    {job.category && <span>🏷️ {job.category.name}</span>}
                    <span>💰 {job.budgetMin && job.budgetMax ? `${job.budgetMin}-${job.budgetMax} €` : 'Dogovor'}</span>
                    <span className={`px-2 py-1 rounded ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                      job.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status === 'OPEN' ? 'Otvoren' : job.status === 'ACCEPTED' ? 'Prihvaćen' : 'Završen'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewJobDetails(job)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedJob?.id === job.id ? 'Sakrij detalje' : 'Prikaži detalje'}
                </button>
              </div>

              {selectedJob?.id === job.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-3">Primljene ponude ({offers[job.id]?.length || 0})</h4>
                  {offers[job.id] && offers[job.id].length > 0 ? (
                    <div className="space-y-3">
                      {offers[job.id].map(offer => (
                        <div key={offer.id} className="bg-gray-50 rounded p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{offer.user.fullName}</p>
                              <p className="text-sm text-gray-600">{offer.message}</p>
                              <p className="text-sm font-semibold text-green-600 mt-1">
                                {offer.price ? `${offer.price} €` : 'Cijena po dogovoru'}
                              </p>
                            </div>
                            {job.status === 'OPEN' && (
                              <button
                                onClick={() => acceptOffer(offer.id, job.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Prihvati ponudu
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Još nema primljenih ponuda.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

