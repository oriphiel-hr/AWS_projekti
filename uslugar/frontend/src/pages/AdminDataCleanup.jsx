import React, { useState } from 'react'
import api from '@/api'

export default function AdminDataCleanup(){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [preserveEmails, setPreserveEmails] = useState('')

  async function runCleanup(){
    if(!confirm('Potvrdi čišćenje podataka (ne-matični). Ova akcija je nepovratna.')) return
    setLoading(true); setError(''); setResult(null)
    try{
      const emails = preserveEmails
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      const { data } = await api.post('/admin/cleanup/non-master', { preserveEmails: emails })
      setResult(data)
    }catch(e){
      setError(e?.response?.data?.error || e?.message || String(e))
    }finally{ setLoading(false) }
  }

  function renderCount(label, val){
    const count = typeof val === 'object' && val !== null && 'count' in val ? val.count : (val?.count ?? val)
    return (
      <div className="flex items-center justify-between py-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{count ?? 0}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">🧹 Čišćenje podataka (ne-matični)</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <div className="text-yellow-800">
          <p className="font-semibold">Upozorenje</p>
          <ul className="list-disc ml-5 mt-1 text-sm">
            <li>Bit će obrisani transakcijski podaci: Chat, Ponude, Poslovi, Recenzije, Notifikacije, Pretplate, Provider profili i svi korisnici koji nisu ADMIN.</li>
            <li>Sačuvat će se: ADMIN korisnik, Kategorije, Pretplatnički planovi, Pravni statusi, <strong>Testiranje (Admin → Testiranje: planovi, stavke i runovi)</strong>.</li>
            <li>Akcija je nepovratna.</li>
          </ul>
        </div>
      </div>

      <label className="block">
        <div className="text-sm text-gray-700 mb-1">E-mailovi korisnika koje treba sačuvati (opcionalno, zarezom odvojeni)</div>
        <input
          type="text"
          value={preserveEmails}
          onChange={e=>setPreserveEmails(e.target.value)}
          placeholder="user1@example.com, user2@example.com"
          className="w-full border rounded px-3 py-2"
        />
      </label>

      <button onClick={runCleanup} disabled={loading} className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50">
        {loading ? 'Čistim...' : 'Pokreni čišćenje'}
      </button>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <div className="font-semibold text-green-800 mb-2">Rezultat</div>
          <div className="space-y-1">
            {renderCount('Chat poruke', result.deleted?.chatMessages)}
            {renderCount('Chat sobe', result.deleted?.chatRooms)}
            {renderCount('Recenzije', result.deleted?.reviews)}
            {renderCount('Notifikacije', result.deleted?.notifications)}
            {renderCount('Ponude', result.deleted?.offers)}
            {renderCount('Poslovi', result.deleted?.jobs)}
            {renderCount('Pretplate', result.deleted?.subscriptions)}
            {renderCount('Provider profili', result.deleted?.providerProfiles)}
            {result.deleted?.whiteLabels !== undefined && renderCount('WhiteLabel postavke', result.deleted?.whiteLabels)}
            {renderCount('Korisnici obrisani (bez ADMIN)', result.deleted?.users)}
          </div>
        </div>
      )}
    </div>
  )
}
