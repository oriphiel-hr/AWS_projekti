// USLUGAR EXCLUSIVE - Subscription Plans Page
import React, { useState, useEffect } from 'react';
import { getSubscriptionPlans, getMySubscription } from '../api/exclusive';
import api from '../api';
import Toast from '../components/Toast';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState({});
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  useEffect(() => {
    loadData();
    
    // Check if payment was successful and refresh data
    const paymentSuccessful = localStorage.getItem('payment_successful');
    if (paymentSuccessful === 'true') {
      localStorage.removeItem('payment_successful');
      console.log('[PAYMENT-SUCCESS] Loading fresh subscription data...');
      // Force reload to get fresh subscription data
      setTimeout(() => {
        loadData();
      }, 1000);
    }
    
    // Listen for hash changes to refresh data after payment success
    const hashChangeHandler = () => {
      if (window.location.hash === '#subscription') {
        // Refresh subscription data when returning from payment success
        loadData();
      }
    };
    
    window.addEventListener('hashchange', hashChangeHandler);
    
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription()
      ]);
      
      // Convert array to object keyed by plan name
      const plansObj = {};
      plansRes.data.forEach(plan => {
        plansObj[plan.name] = plan;
      });
      
      setPlans(plansObj);
      setCurrentSubscription(subRes.data.subscription);
    } catch (err) {
      console.error('Error loading subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const handleSubscribe = async (planKey) => {
    const plan = plans[planKey];

    try {
      setSubscribing(planKey);
      
      console.log('Subscribing to plan:', planKey);
      console.log('Sending data:', { plan: planKey });
      
      // Create Stripe checkout session
      const response = await api.post('/payments/create-checkout', { plan: planKey });
      
      console.log('Checkout response:', response.data);
      
      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
      
    } catch (err) {
      console.error('Subscription error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Neuspjelo';
      showToast(errorMsg, 'error');
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Odaberite Vaš Plan</h1>
        <p className="text-xl text-gray-600">Ekskluzivni leadovi bez konkurencije</p>
        <p className="text-lg text-green-600 font-semibold mt-2">1 lead = 1 izvođač | Refund ako klijent ne odgovori</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-blue-700 mb-1">Trenutna pretplata:</p>
              <p className="text-3xl font-bold text-blue-900">{currentSubscription.plan}</p>
              <p className="text-sm text-blue-600 mt-1">
                Status: <span className="font-semibold">{currentSubscription.status}</span>
              </p>
            </div>
            {currentSubscription.expiresAt && (
              <div className="text-right">
                <p className="text-sm text-blue-700 mb-1">Ističe:</p>
                <p className="text-xl font-semibold text-blue-900">
                  {new Date(currentSubscription.expiresAt).toLocaleDateString('hr-HR')}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {(() => {
                    const days = Math.ceil((new Date(currentSubscription.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
                    return days > 0 ? `${days} dana preostalo` : 'Isteklo';
                  })()}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-sm text-blue-700 mb-1">Krediti:</p>
              <p className="text-2xl font-bold text-blue-900">{currentSubscription.creditsBalance || 0}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 mb-1">Ukupno potrošeno:</p>
              <p className="text-2xl font-bold text-blue-900">{currentSubscription.lifetimeCreditsUsed || 0}</p>
            </div>
          </div>

          {currentSubscription.plan === 'TRIAL' && currentSubscription.status !== 'EXPIRED' && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-sm text-yellow-800">
                🎁 Besplatni TRIAL - Isprobajte sve mogućnosti Uslugar EXCLUSIVE-a!
              </p>
            </div>
          )}

          {currentSubscription.status === 'EXPIRED' && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ Vaša pretplata je istekla. Nadogradite pretplatu da nastavite koristiti Uslugar EXCLUSIVE.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {Object.entries(plans).map(([key, plan]) => {
          const isCurrentPlan = currentSubscription?.plan === key;
          const isPopular = plan.popular;
          
          return (
            <div 
              key={key} 
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                isPopular ? 'ring-4 ring-green-500 transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-semibold">
                  ⭐ NAJPOPULARNIJI
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-gray-600">/mjesečno</span>
                </div>

                {/* Credits */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 text-center">{plan.credits}</p>
                  <p className="text-sm text-gray-600 text-center mt-1">ekskluzivnih leadova</p>
                </div>

                {/* Savings */}
                {plan.savings && (
                  <div className="mb-6 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      💰 {plan.savings}
                    </span>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(key)}
                  disabled={isCurrentPlan || subscribing === key}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isCurrentPlan 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : subscribing === key
                      ? 'bg-gray-400 text-white cursor-wait'
                      : isPopular
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCurrentPlan 
                    ? '✓ Trenutni plan'
                    : subscribing === key
                    ? 'Procesiranje...'
                    : `Pretplati se - ${plan.price}€/mj`
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Usporedba Planova</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Basic</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Premium ⭐</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ekskluzivni leadovi mjesečno</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">25</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">50</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Refund sistem</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ROI statistika</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AI prioritet u pretrazi</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Premium kvaliteta leadova (80+)</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Podrška</td>
                  <td className="px-6 py-4 text-center text-sm">Email</td>
                  <td className="px-6 py-4 text-center text-sm">Prioritetna</td>
                  <td className="px-6 py-4 text-center text-sm">VIP 24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Često Postavljana Pitanja</h2>
        
        <div className="space-y-4">
          <details className="bg-white rounded-lg p-4 shadow">
            <summary className="font-semibold text-gray-900 cursor-pointer">Što je ekskluzivan lead?</summary>
            <p className="mt-2 text-gray-700 text-sm">
              Ekskluzivan lead znači da samo <strong>vi</strong> dobivate kontakt klijenta - nema drugih izvođača koji konkuriraju.
              Za razliku od ostalih servisa gdje se jedan lead dijeli između 5-10 providera.
            </p>
          </details>

          <details className="bg-white rounded-lg p-4 shadow">
            <summary className="font-semibold text-gray-900 cursor-pointer">Što ako klijent ne odgovori?</summary>
            <p className="mt-2 text-gray-700 text-sm">
              Jednostavno zatražite <strong>refund</strong> i dobivate sve kredite nazad! Nema rizika.
            </p>
          </details>

          <details className="bg-white rounded-lg p-4 shadow">
            <summary className="font-semibold text-gray-900 cursor-pointer">Koliko košta 1 kredit?</summary>
            <p className="mt-2 text-gray-700 text-sm">
              1 kredit ≈ 10€. Lead može koštati 5-20 kredita ovisno o AI quality score-u.
              Pretplatom ušteđujete 36-47% u odnosu na pay-per-lead model.
            </p>
          </details>

          <details className="bg-white rounded-lg p-4 shadow">
            <summary className="font-semibold text-gray-900 cursor-pointer">Što je AI quality score?</summary>
            <p className="mt-2 text-gray-700 text-sm">
              Svaki lead ima score 0-100 na osnovu verifikacije klijenta, budgeta, opisa, urgencije, itd.
              Viši score = kvalitetniji lead = veća šansa za konverziju.
            </p>
          </details>

          <details className="bg-white rounded-lg p-4 shadow">
            <summary className="font-semibold text-gray-900 cursor-pointer">Mogu li otkazati pretplatu?</summary>
            <p className="mt-2 text-gray-700 text-sm">
              Da, možete otkazati bilo kada. Preostali krediti ostaju vam dostupni.
            </p>
          </details>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={() => window.location.hash = '#leads'}
          className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 shadow-lg"
        >
          🛒 Pregledaj Dostupne Leadove
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Imate pitanja? Kontaktirajte nas na support@uslugar.hr
        </p>
      </div>
    </div>
  );
}

