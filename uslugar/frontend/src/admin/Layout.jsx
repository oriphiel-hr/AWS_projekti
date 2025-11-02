/* src/admin/Layout.jsx */
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { MODELS } from './router'

const MODEL_LABELS = {
  User: 'Korisnici',
  ProviderProfile: 'Profili pružatelja',
  Category: 'Kategorije',
  Job: 'Poslovi',
  Offer: 'Ponude',
  Review: 'Recenzije',
  Notification: 'Notifikacije',
  ChatRoom: 'Chat sobe',
  ChatMessage: 'Chat poruke',
  Subscription: 'Pretplate',
  SubscriptionPlan: 'Pretplatnički planovi',
  LegalStatus: 'Pravni status'
}

export default function Layout({ user, onLogout }){
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Uslugar Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.fullName}</span>
                <span className="text-gray-500 ml-2">({user?.email})</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Odjava
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 py-6">
        <div className="flex min-h-[70vh] bg-white border rounded-lg shadow overflow-hidden">
          <aside className="w-64 flex-shrink-0 border-r bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3">Modeli</div>
            <nav className="space-y-1">
              {MODELS.map(m => (
                <NavLink
                  key={m}
                  to={`/admin/${m}`}
                  className={({isActive}) =>
                    `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`
                  }
                >
                  {MODEL_LABELS[m] || m}
                </NavLink>
              ))}
              
              {/* Special Pages */}
              <NavLink
                to="/admin/provider-approvals"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                ✅ Provider Approvals
              </NavLink>
              <NavLink
                to="/admin/verification-documents"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                📄 Dokumenti za Verifikaciju
              </NavLink>
              <NavLink
                to="/admin/kyc-metrics"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                🔒 KYC Metrike
              </NavLink>
              <NavLink
                to="/admin/platform-stats"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                📊 Statistike Platforme
              </NavLink>
              <NavLink
                to="/admin/moderation"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                🛡️ Moderacija Sadržaja
              </NavLink>
              <NavLink
                to="/admin/documentation"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                📚 Admin Dokumentacija
              </NavLink>
              <NavLink
                to="/admin/payments"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                💰 Payments
              </NavLink>
              <NavLink
                to="/admin/cleanup"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                🧹 Čišćenje podataka
              </NavLink>
              <NavLink
                to="/admin/testing"
                className={({isActive}) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                🧪 Testiranje
              </NavLink>
            </nav>
          </aside>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
