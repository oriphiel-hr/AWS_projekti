import React, { useEffect, useMemo, useState } from 'react'
import api from '../api'

const STATUS_BADGES = {
  PENDING: 'bg-gray-100 text-gray-700',
  PASS: 'bg-green-100 text-green-800',
  FAIL: 'bg-red-100 text-red-800',
  BLOCKED: 'bg-yellow-100 text-yellow-800',
  NOT_APPLICABLE: 'bg-slate-100 text-slate-800'
}

function Badge({ status }){
  const cls = STATUS_BADGES[status] || STATUS_BADGES.PENDING
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status}</span>
}

function PlanEditor({ onSaved }){
  const [name, setName] = useState('Test plan')
  const [description, setDescription] = useState('Upute i koraci testiranja')
  const [category, setCategory] = useState('Korisnik')
  const [items, setItems] = useState([
    { title: 'Registracija korisnika', description: 'Ispravni podaci', expectedResult: 'Uspješna registracija', dataVariations: { examples: ['ispravan email', 'jaka lozinka'] } },
    { title: 'Validacija OIB-a', description: 'Unos OIB-a', expectedResult: 'Ispravno: prolazi, Neispravno: greška', dataVariations: { examples: ['ispravan OIB', 'neispravan OIB'] } },
  ])

  const addItem = () => setItems(prev => [...prev, { title: '', description: '', expectedResult: '', dataVariations: { examples: [] } }])
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))
  const updateItem = (idx, key, val) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: val } : it))

  const handleSave = async () => {
    const payload = { name, description, category, items: items.map((it, idx) => ({ ...it, order: idx })) }
    const res = await api.post('/testing/plans', payload)
    onSaved?.(res.data)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Naziv plana" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Kategorija (npr. KYC)" value={category} onChange={e => setCategory(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="border rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Stavka #{idx+1}</h4>
              <button onClick={() => removeItem(idx)} className="text-red-600 text-sm">Ukloni</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" placeholder="Naslov" value={it.title} onChange={e => updateItem(idx,'title',e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="Očekivani rezultat" value={it.expectedResult} onChange={e => updateItem(idx,'expectedResult',e.target.value)} />
              <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Opis" value={it.description} onChange={e => updateItem(idx,'description',e.target.value)} />
              <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Primjeri (zarezom odvojeni, npr. ispravan OIB, neispravan OIB)" value={(it.dataVariations?.examples||[]).join(', ')} onChange={e => updateItem(idx,'dataVariations',{ examples: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={addItem} className="px-3 py-2 bg-gray-100 rounded">+ Dodaj stavku</button>
        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Spremi plan</button>
      </div>
    </div>
  )
}

function RunExecutor({ plan, onClose }){
  const [run, setRun] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const start = async () => {
      const r = await api.post('/testing/runs', { planId: plan.id, name: `${plan.name} - ručno testiranje` })
      setRun(r.data)
    }
    start()
  }, [plan.id, plan.name])

  const refresh = async () => {
    if (!run) return
    const r = await api.get(`/testing/runs/${run.id}`)
    setRun(r.data)
  }

  const updateItem = async (itemId, data) => {
    if (!run) return
    await api.patch(`/testing/runs/${run.id}/items/${itemId}`, data)
    await refresh()
  }

  const uploadImages = async (files) => {
    const form = new FormData()
    Array.from(files).forEach(f => form.append('images', f))
    setUploading(true)
    try {
      const res = await api.post('/upload/multiple', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      return res.data.images.map(x => x.url)
    } finally {
      setUploading(false)
    }
  }

  if (!run) return <div>Pokretanje...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Run: {run.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => api.patch(`/testing/runs/${run.id}`, { status: 'COMPLETED' }).then(refresh)} className="px-3 py-2 bg-green-600 text-white rounded">Završi run</button>
          <button onClick={onClose} className="px-3 py-2 bg-gray-100 rounded">Zatvori</button>
        </div>
      </div>

      {(run.plan?.items || []).map(it => {
        const ri = (run.items || []).find(x => x.itemId === it.id)
        const status = ri?.status || 'PENDING'
        return (
          <div key={it.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{it.title}</h4>
                  <Badge status={status} />
                </div>
                {it.description && <p className="text-sm text-gray-600 mt-1">{it.description}</p>}
                {it.expectedResult && <p className="text-sm text-gray-800 mt-1"><span className="font-medium">Očekivano:</span> {it.expectedResult}</p>}
                {!!(it.dataVariations?.examples||[]).length && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Varijacije:</span> {(it.dataVariations.examples||[]).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {['PASS','FAIL','BLOCKED','NOT_APPLICABLE','PENDING'].map(s => (
                  <button key={s} onClick={() => updateItem(it.id, { status: s })} className={`px-2 py-1 rounded text-xs border ${status===s?'bg-indigo-600 text-white':'bg-white'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea className="border rounded px-3 py-2" placeholder="Komentar" value={ri?.comment || ''} onChange={e => updateItem(it.id, { comment: e.target.value })} />
              <div>
                <label className="block text-sm font-medium mb-1">Upload screenshotova</label>
                <input type="file" multiple accept="image/*" onChange={async e => {
                  const urls = await uploadImages(e.target.files)
                  await updateItem(it.id, { addScreenshots: urls })
                  e.target.value = ''
                }} />
                {uploading && <div className="text-xs text-gray-500 mt-1">Učitavanje...</div>}
              </div>
            </div>

            {!!(ri?.screenshots||[]).length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(ri.screenshots||[]).map(url => (
                  <div key={url} className="relative">
                    <img src={url} alt="shot" className="w-28 h-28 object-cover rounded border" />
                    <button onClick={() => updateItem(it.id, { removeScreenshots: [url] })} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border shadow text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AdminTesting(){
  const [tab, setTab] = useState('plans') // 'plans' | 'runs' | 'new'
  const [plans, setPlans] = useState([])
  const [runs, setRuns] = useState([])
  const [activePlan, setActivePlan] = useState(null)

  const load = async () => {
    const [p, r] = await Promise.all([
      api.get('/testing/plans'),
      api.get('/testing/runs')
    ])
    setPlans(p.data)
    setRuns(r.data)
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setTab('plans')} className={`px-3 py-2 rounded ${tab==='plans'?'bg-indigo-600 text-white':'bg-gray-100'}`}>Planovi</button>
          <button onClick={() => setTab('runs')} className={`px-3 py-2 rounded ${tab==='runs'?'bg-indigo-600 text-white':'bg-gray-100'}`}>Runovi</button>
          <button onClick={() => setTab('new')} className={`px-3 py-2 rounded ${tab==='new'?'bg-indigo-600 text-white':'bg-gray-100'}`}>Novi plan</button>
        </div>
        <button onClick={load} className="px-3 py-2 bg-gray-100 rounded">Osvježi</button>
      </div>

      {tab === 'plans' && (
        <div className="space-y-3">
          {plans.map(pl => (
            <div key={pl.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{pl.name}</div>
                  <div className="text-sm text-gray-600">{pl.description}</div>
                  {!!pl.category && <div className="text-xs text-gray-500 mt-1">Kategorija: {pl.category}</div>}
                  <div className="text-xs text-gray-500 mt-1">Stavki: {pl.items?.length || 0}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActivePlan(pl)} className="px-3 py-2 bg-green-600 text-white rounded">Pokreni run</button>
                </div>
              </div>
            </div>
          ))}
          {plans.length === 0 && <div className="text-gray-500">Nema planova. Kreiraj novi.</div>}
        </div>
      )}

      {tab === 'runs' && (
        <div className="space-y-3">
          {runs.map(r => (
            <div key={r.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-gray-600">Plan: {r.plan?.name}</div>
              </div>
              <Badge status={r.status} />
            </div>
          ))}
          {runs.length === 0 && <div className="text-gray-500">Nema runova.</div>}
        </div>
      )}

      {tab === 'new' && (
        <PlanEditor onSaved={() => { setTab('plans'); load(); }} />
      )}

      {activePlan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 max-w-5xl w-full max-h-[90vh] overflow-auto">
            <RunExecutor plan={activePlan} onClose={() => { setActivePlan(null); load(); }} />
          </div>
        </div>
      )}
    </div>
  )
}


