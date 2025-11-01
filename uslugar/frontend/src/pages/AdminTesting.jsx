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
    // AUTH
    { title: 'Registracija korisnika usluge (osoba)', description: 'Registracija bez pravnog statusa', expectedResult: 'Uspješna registracija bez polja za tvrtku', dataVariations: { examples: ['ispravan email', 'neispravan email', 'slaba lozinka', 'duplikat email'] } },
    { title: 'Registracija korisnika usluge (tvrtka/obrt)', description: 'Registracija s pravnim statusom', expectedResult: 'Obavezni: pravni status ≠ INDIVIDUAL, OIB, (osim FREELANCER) naziv tvrtke', dataVariations: { examples: ['FREELANCER bez naziva tvrtke (dozvoljeno)', 'DOO bez naziva (greška)', 'neispravan OIB (greška)', 'ispravan OIB (prolazi)'] } },
    { title: 'Verifikacija emaila', description: 'Otvaranje linka za verifikaciju', expectedResult: 'Korisnik označen kao verified', dataVariations: { examples: ['link vrijedi', 'istekao link'] } },
    { title: 'Prijava i odjava', description: 'Login s ispravnim/neispravnim podacima', expectedResult: 'Ispravno: prijava, Neispravno: poruka o grešci', dataVariations: { examples: ['kriva lozinka', 'nepostojeći email'] } },
    { title: 'Zaboravljena lozinka i reset', description: 'Slanje emaila i promjena lozinke', expectedResult: 'Reset token radi, lozinka promijenjena', dataVariations: { examples: ['token nevažeći', 'token istekao'] } },

    // PROVIDER ONBOARDING
    { title: 'Nadogradnja na providera', description: 'Odabir pravnog statusa i unos OIB-a', expectedResult: 'INDIVIDUAL nije dopušten; OIB obavezan; validacija OIB-a', dataVariations: { examples: ['FREELANCER bez naziva firme (prolazi)', 'DOO bez naziva (greška)', 'neispravan OIB (greška)', 'ispravan OIB (prolazi)'] } },
    { title: 'Profil providera', description: 'Popunjavanje profila i odabir kategorija', expectedResult: 'Maksimalno 5 kategorija; profil spremljen', dataVariations: { examples: ['0 kategorija', '5 kategorija (prolazi)', '6 kategorija (blokirano)'] } },
    { title: 'Portfolio slike', description: 'Upload više slika u profil', expectedResult: 'Sve slike vidljive i spremne', dataVariations: { examples: ['bez slika', 'više slika'] } },

    // KYC
    { title: 'KYC: Upload dokumenta', description: 'Upload PDF/JPG/PNG + pristanak', expectedResult: 'Dokument spremljen; status pending/verified ovisno o provjeri', dataVariations: { examples: ['bez consent (greška)', 'nepodržan format (greška)', 'validan PDF (prolazi)'] } },
    { title: 'KYC: Ekstrakcija OIB-a', description: 'Uparen s profilom', expectedResult: 'OIB iz dokumenta odgovara profilu', dataVariations: { examples: ['OIB mismatch (napomena/admin review)', 'OIB match (verified)'] } },

    // JOBS (KLIJENT)
    { title: 'Objava posla', description: 'Kreiranje job-a s/bez slika', expectedResult: 'Posao kreiran i vidljiv na listi', dataVariations: { examples: ['bez slika', 's više slika', 'budžet unesen', 'bez budžeta'] } },
    { title: 'Filtri poslova i pretraga', description: 'Filtriranje po kategoriji, gradu, budžetu', expectedResult: 'Lista filtrirana', dataVariations: { examples: ['bez rezultata', 'više rezultata'] } },

    // LEADS I OFFERS (PROVIDER)
    { title: 'Pregled dostupnih leadova', description: 'Provider gleda available leadove', expectedResult: 'Lista dostupnih leadova s filterima', dataVariations: { examples: ['grad', 'kategorija', 'min/max budžet'] } },
    { title: 'Kupnja ekskluzivnog leada', description: 'Dedukcija kredita i pristup kontaktima', expectedResult: 'Krediti umanjeni, lead dodan u Moji leadovi', dataVariations: { examples: ['dovoljno kredita (prolazi)', 'nedovoljno kredita (greška)'] } },
    { title: 'Ponuda na posao', description: 'Provider šalje ponudu', expectedResult: 'Ponuda kreirana i notifikacija klijentu', dataVariations: { examples: ['cijena + pregovaranje', 'procijenjeni dani', 'insufficient credits (greška)'] } },
    { title: 'Označi lead kontaktiran/konvertiran', description: 'Statusi ROI-a', expectedResult: 'Statusi ažurirani, ROI statistika osvježena', dataVariations: { examples: ['kontaktiran', 'konvertiran', 'refund'] } },

    // CHAT & NOTIFIKACIJE
    { title: 'Chat: slanje poruke', description: 'Komunikacija između klijenta i providera', expectedResult: 'Poruka vidljiva u sobi', dataVariations: { examples: ['više poruka', 'prazna poruka (blokirano)'] } },
    { title: 'Notifikacije', description: 'Prikaz i označavanje pročitanim', expectedResult: 'Nove notifikacije za ponude/poslove vidljive', dataVariations: { examples: ['ponuda primljena', 'ponuda prihvaćena'] } },

    // SUBSCRIPTION & PAYMENTS
    { title: 'Pretplata: odabir plana', description: 'BASIC/PREMIUM/PRO', expectedResult: 'Plan odabran; krediti dodijeljeni', dataVariations: { examples: ['najpopularniji plan', 'nedostupni plan (skriven)'] } },
    { title: 'Plaćanje', description: 'Simulacija uspješnog/neet uspješnog plaćanja', expectedResult: 'Uspjeh: aktivna pretplata, Neuspjeh: nema promjene', dataVariations: { examples: ['success', 'fail', 'ponovno pokušaj'] } },

    // ADMIN
    { title: 'Admin: odobrenja providera', description: 'Approve/Reject/Inactive', expectedResult: 'Status providera ažuriran i notifikacija poslana', dataVariations: { examples: ['APPROVED', 'REJECTED', 'INACTIVE'] } },
    { title: 'Admin: KYC metrike', description: 'Provjera brojeva i prosječnog vremena', expectedResult: 'Metrike vratile valjane vrijednosti', dataVariations: { examples: ['bez verifikacija', 'više verificiranih'] } },
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

function PresetPlanEditor({ preset, onSaved }){
  const base = {
    AUTH: [
      { title: 'Registracija korisnika usluge (osoba)', description: 'Registracija bez pravnog statusa', expectedResult: 'Uspješna registracija bez polja za tvrtku', dataVariations: { examples: ['ispravan email', 'neispravan email', 'slaba lozinka', 'duplikat email'] } },
      { title: 'Registracija korisnika usluge (tvrtka/obrt)', description: 'Registracija s pravnim statusom', expectedResult: 'Obavezni: pravni status ≠ INDIVIDUAL, OIB, (osim FREELANCER) naziv tvrtke', dataVariations: { examples: ['FREELANCER bez naziva tvrtke (dozvoljeno)', 'DOO bez naziva (greška)', 'neispravan OIB (greška)', 'ispravan OIB (prolazi)'] } },
      { title: 'Verifikacija emaila', description: 'Otvaranje linka za verifikaciju', expectedResult: 'Korisnik označen kao verified', dataVariations: { examples: ['link vrijedi', 'istekao link'] } },
      { title: 'Prijava i odjava', description: 'Login s ispravnim/neispr. podacima', expectedResult: 'Ispravno: prijava, Neispravno: greška', dataVariations: { examples: ['kriva lozinka', 'nepostojeći email'] } },
      { title: 'Zaboravljena lozinka i reset', description: 'Slanje emaila i promjena lozinke', expectedResult: 'Reset token radi, lozinka promijenjena', dataVariations: { examples: ['token nevažeći', 'token istekao'] } },
    ],
    ONBOARDING: [
      { title: 'Nadogradnja na providera', description: 'Odabir pravnog statusa i OIB', expectedResult: 'INDIVIDUAL nije dopušten; OIB obavezan; validacija', dataVariations: { examples: ['FREELANCER bez naziva (prolazi)', 'DOO bez naziva (greška)', 'neispravan OIB', 'ispravan OIB'] } },
      { title: 'Profil providera', description: 'Popunjavanje i kategorije', expectedResult: 'Maks 5 kategorija', dataVariations: { examples: ['0 kategorija', '5 kategorija', '6 kategorija (blok)'] } },
      { title: 'Portfolio slike', description: 'Upload više slika', expectedResult: 'Slike vidljive i spremljene', dataVariations: { examples: ['bez slika', 'više slika'] } },
    ],
    KYC: [
      { title: 'KYC: Upload dokumenta', description: 'PDF/JPG/PNG + consent', expectedResult: 'Status pending/verified', dataVariations: { examples: ['bez consent (greška)', 'nepodržan format', 'validan PDF'] } },
      { title: 'KYC: Ekstrakcija OIB-a', description: 'Uparen s profilom', expectedResult: 'OIB match => verified', dataVariations: { examples: ['mismatch (review)', 'match (verified)'] } },
    ],
    JOBS: [
      { title: 'Objava posla', description: 'Kreiranje sa/bez slika', expectedResult: 'Posao vidljiv na listi', dataVariations: { examples: ['bez slika', 'više slika', 's budžetom', 'bez budžeta'] } },
      { title: 'Filtri i pretraga posla', description: 'Kategorija/grad/budžet', expectedResult: 'Lista filtrirana', dataVariations: { examples: ['bez rezultata', 'više rezultata'] } },
    ],
    LEADS: [
      { title: 'Dostupni leadovi', description: 'Provider pregleda leadove', expectedResult: 'Lista s filterima', dataVariations: { examples: ['grad', 'kategorija', 'min/max budžet'] } },
      { title: 'Kupnja ekskluzivnog leada', description: 'Dedukcija kredita', expectedResult: 'Lead u Mojim leadovima', dataVariations: { examples: ['dovoljno kredita', 'nedovoljno (greška)'] } },
      { title: 'Ponuda na posao', description: 'Slanje ponude', expectedResult: 'Ponuda spremljena, notifikacija klijentu', dataVariations: { examples: ['cijena + pregovaranje', 'procijenjeni dani', 'insufficient credits'] } },
      { title: 'ROI statusi', description: 'Kontaktiran/konvertiran/refund', expectedResult: 'Statusevi i ROI se ažuriraju', dataVariations: { examples: ['kontaktiran', 'konvertiran', 'refund'] } },
    ],
    CHAT: [
      { title: 'Chat: slanje poruke', description: 'Korisnik ↔ Provider', expectedResult: 'Poruka vidljiva', dataVariations: { examples: ['više poruka', 'prazna poruka (blok)'] } },
      { title: 'Notifikacije', description: 'Prikaz i označavanje pročitanim', expectedResult: 'Nove notifikacije vidljive', dataVariations: { examples: ['ponuda primljena', 'ponuda prihvaćena'] } },
    ],
    SUBS: [
      { title: 'Pretplata: odabir plana', description: 'BASIC/PREMIUM/PRO', expectedResult: 'Plan odabran, krediti dodijeljeni', dataVariations: { examples: ['najpopularniji plan', 'skriven plan'] } },
      { title: 'Plaćanje', description: 'Simulacija uspjeh/neuspjeh', expectedResult: 'Uspjeh: aktivna, neuspjeh: bez promjene', dataVariations: { examples: ['success', 'fail', 'retry'] } },
    ],
    ADMIN: [
      { title: 'Admin: odobrenja providera', description: 'Approve/Reject/Inactive', expectedResult: 'Status ažuriran + notifikacija', dataVariations: { examples: ['APPROVED', 'REJECTED', 'INACTIVE'] } },
      { title: 'Admin: KYC metrike', description: 'Provjera brojeva/vremena', expectedResult: 'Metrike vraćaju vrijednosti', dataVariations: { examples: ['bez verifikacija', 'više verificiranih'] } },
    ],
  }

  const mapPresetToDefaults = (key) => {
    if (key === 'ALL') {
      return [
        ...base.AUTH,
        ...base.ONBOARDING,
        ...base.KYC,
        ...base.JOBS,
        ...base.LEADS,
        ...base.CHAT,
        ...base.SUBS,
        ...base.ADMIN,
      ]
    }
    return base[key] || []
  }

  const [items, setItems] = useState(() => mapPresetToDefaults(preset))
  const [name, setName] = useState(() => {
    if (preset==='ALL') return 'Sve domene - E2E'
    const labels = { AUTH:'Auth', ONBOARDING:'Onboarding', KYC:'KYC', JOBS:'Jobs', LEADS:'Leads i Ponude', CHAT:'Chat i Notifikacije', SUBS:'Pretplate i Plaćanja', ADMIN:'Admin' }
    return `Plan: ${labels[preset] || preset}`
  })
  const [description, setDescription] = useState('Automatski generiran plan prema odabranoj domeni')
  const [category, setCategory] = useState(() => preset)

  // Sync items on preset change
  React.useEffect(() => {
    setItems(mapPresetToDefaults(preset).map((it) => ({ ...it })))
    setCategory(preset)
    const labels = { AUTH:'Auth', ONBOARDING:'Onboarding', KYC:'KYC', JOBS:'Jobs', LEADS:'Leads i Ponude', CHAT:'Chat i Notifikacije', SUBS:'Pretplate i Plaćanja', ADMIN:'Admin' }
    setName(preset==='ALL' ? 'Sve domene - E2E' : `Plan: ${labels[preset] || preset}`)
  }, [preset])

  const handleSave = async () => {
    const payload = { name, description, category, items: items.map((it, idx) => ({ ...it, order: idx })) }
    const res = await api.post('/testing/plans', payload)
    onSaved?.(res.data)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Naziv plana" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Kategorija" value={category} onChange={e => setCategory(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="border rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Stavka #{idx+1}</h4>
              <button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="text-red-600 text-sm">Ukloni</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" placeholder="Naslov" value={it.title} onChange={e => setItems(prev => prev.map((x, i) => i===idx ? { ...x, title: e.target.value } : x))} />
              <input className="border rounded px-3 py-2" placeholder="Očekivani rezultat" value={it.expectedResult} onChange={e => setItems(prev => prev.map((x, i) => i===idx ? { ...x, expectedResult: e.target.value } : x))} />
              <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Opis" value={it.description} onChange={e => setItems(prev => prev.map((x, i) => i===idx ? { ...x, description: e.target.value } : x))} />
              <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Primjeri (zarezom odvojeni)" value={(it.dataVariations?.examples||[]).join(', ')} onChange={e => setItems(prev => prev.map((x, i) => i===idx ? { ...x, dataVariations: { examples: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } } : x))} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setItems(prev => [...prev, { title: '', description: '', expectedResult: '', dataVariations: { examples: [] } }])} className="px-3 py-2 bg-gray-100 rounded">+ Dodaj stavku</button>
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
  const [preset, setPreset] = useState('ALL')

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
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              {key:'ALL',label:'Sve domene'},
              {key:'AUTH',label:'Auth'},
              {key:'ONBOARDING',label:'Onboarding'},
              {key:'KYC',label:'KYC'},
              {key:'JOBS',label:'Jobs'},
              {key:'LEADS',label:'Leads/Offers'},
              {key:'CHAT',label:'Chat/Notifikacije'},
              {key:'SUBS',label:'Pretplate/Plaćanja'},
              {key:'ADMIN',label:'Admin'}
            ].map(p => (
              <button key={p.key} onClick={() => setPreset(p.key)} className={`px-3 py-2 rounded ${preset===p.key?'bg-indigo-600 text-white':'bg-gray-100'}`}>{p.label}</button>
            ))}
          </div>

          <PresetPlanEditor preset={preset} onSaved={() => { setTab('plans'); load(); }} />
        </div>
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


