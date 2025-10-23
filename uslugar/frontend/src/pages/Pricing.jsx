import React from 'react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Odaberite Vaš Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ekskluzivni leadovi bez konkurencije
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg inline-block">
            <p className="text-lg font-semibold">
              1 lead = 1 izvođač | Refund ako klijent ne odgovori
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">99€</div>
              <p className="text-gray-600">mjesečno</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>10 ekskluzivnih leadova mjesečno</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Refund sistem</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>ROI statistika</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✗</span>
                <span className="text-gray-400">AI prioritet u pretrazi</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✗</span>
                <span className="text-gray-400">Premium kvaliteta leadova</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-3">📧</span>
                <span>Email podrška</span>
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Odaberite Basic
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                ⭐ Najpopularniji
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">199€</div>
              <p className="text-gray-600">mjesečno</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>25 ekskluzivnih leadova mjesečno</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Refund sistem</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>ROI statistika</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>AI prioritet u pretrazi</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✗</span>
                <span className="text-gray-400">Premium kvaliteta leadova</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-3">🚀</span>
                <span>Prioritetna podrška</span>
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Odaberite Premium
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">399€</div>
              <p className="text-gray-600">mjesečno</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>50 ekskluzivnih leadova mjesečno</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Refund sistem</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>ROI statistika</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>AI prioritet u pretrazi</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Premium kvaliteta leadova (80+)</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-3">👑</span>
                <span>VIP 24/7 podrška</span>
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Odaberite Pro
            </button>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Imate pitanja?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Pogledajte našu FAQ sekciju s odgovorima na najčešća pitanja
          </p>
          <a
            href="#faq"
            className="inline-block bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            ❓ Pregledaj FAQ
          </a>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Spremni za ekskluzivne leadove?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Registrirajte se danas i počnite primati kvalitetne leadove
          </p>
          <div className="space-x-4">
            <a
              href="#register-provider"
              className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Registriraj se kao pružatelj
            </a>
            <a
              href="#register-user"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Registriraj se kao korisnik
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
