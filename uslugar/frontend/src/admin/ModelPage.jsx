/* src/admin/ModelPage.jsx */
import React, { useEffect, useMemo, useState } from 'react'
import api from '@/api'

// JSON primjeri za svaki model
const MODEL_EXAMPLES = {
  User: {
    email: "korisnik@example.com",
    passwordHash: "$2a$10$...(generiraj bcrypt hash)",
    fullName: "Ime Prezime",
    role: "USER",
    phone: "+385 91 234 5678",
    city: "Zagreb",
    latitude: 45.8150,
    longitude: 15.9819,
    isVerified: false
  },
  ProviderProfile: {
    userId: "cm...(User ID)",
    bio: "Profesionalni opis",
    specialties: ["Specijalizacija 1", "Specijalizacija 2"],
    experience: 5,
    website: "https://example.com",
    isAvailable: true
  },
  Category: {
    name: "Naziv kategorije",
    description: "Opis kategorije",
    parentId: null,
    isActive: true
  },
  Job: {
    title: "Naziv posla",
    description: "Detaljan opis posla",
    budgetMin: 200,
    budgetMax: 500,
    city: "Zagreb",
    latitude: 45.8150,
    longitude: 15.9819,
    status: "OPEN",
    urgency: "NORMAL",
    jobSize: "MEDIUM",
    deadline: "2025-12-31T23:59:59.000Z",
    images: [],
    userId: "cm...(User ID)",
    categoryId: "cm...(Category ID)"
  },
  Offer: {
    amount: 350,
    message: "Poruka uz ponudu",
    status: "PENDING",
    isNegotiable: true,
    estimatedDays: 3,
    jobId: "cm...(Job ID)",
    userId: "cm...(Provider User ID)"
  },
  Review: {
    rating: 5,
    comment: "Odličan servis!",
    fromUserId: "cm...(User ID)",
    toUserId: "cm...(Provider User ID)"
  },
  Notification: {
    title: "Naslov notifikacije",
    message: "Sadržaj notifikacije",
    type: "SYSTEM",
    isRead: false,
    userId: "cm...(User ID)",
    jobId: null,
    offerId: null
  },
  ChatRoom: {
    name: "Naziv chat sobe",
    jobId: "cm...(Job ID - opcionalno)"
  },
  ChatMessage: {
    content: "Sadržaj poruke",
    senderId: "cm...(User ID)",
    roomId: "cm...(ChatRoom ID)"
  },
  Subscription: {
    userId: "cm...(User ID)",
    plan: "BASIC",
    status: "ACTIVE",
    credits: 10,
    expiresAt: "2026-01-01T00:00:00.000Z"
  }
}

function Textarea({label, value, onChange, placeholder}){
  return (
    <label className="block">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <textarea
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full border rounded p-2 font-mono text-sm"
      />
    </label>
  )
}

export default function ModelPage({ model }){
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const [where, setWhere] = useState('')
  const [include, setInclude] = useState('')
  const [editItem, setEditItem] = useState(null) // null=zatvoreno, {}=create, obj=edit
  const [rawJson, setRawJson] = useState('{}')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load(){
    setLoading(true); setError('')
    try{
      const params = { skip, take }
      if(where) params.where = where
      if(include) params.include = include
      const { data } = await api.get(`/admin/${model}`, { params })
      setItems(data.items || [])
      setTotal(data.total || 0)
    }catch(e){
      setError(e?.response?.data?.error || e?.message || String(e))
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [model, skip, take])

  const cols = useMemo(() => {
    if(items.length === 0) return []
    const set = new Set()
    items.forEach(it => Object.keys(it).forEach(k => set.add(k)))
    return Array.from(set)
  }, [items])

  function openCreate(){
    const example = MODEL_EXAMPLES[model] || {}
    setEditItem({})
    setRawJson(JSON.stringify(example, null, 2))
  }
  function openEdit(it){
    setEditItem(it)
    setRawJson(JSON.stringify(it, null, 2))
  }
  function loadExample(){
    const example = MODEL_EXAMPLES[model] || {}
    setRawJson(JSON.stringify(example, null, 2))
  }
  async function save(){
    setLoading(true); setError('')
    try{
      const body = JSON.parse(rawJson)
      if(editItem?.id){
        await api.put(`/admin/${model}/${encodeURIComponent(editItem.id)}`, body)
      }else{
        await api.post(`/admin/${model}`, body)
      }
      setEditItem(null); await load()
    }catch(e){
      setError(e?.response?.data?.error || e?.message || String(e))
    }finally{ setLoading(false) }
  }
  async function remove(id){
    if(!confirm('Obrisati zapis?')) return
    setLoading(true); setError('')
    try{
      await api.delete(`/admin/${model}/${encodeURIComponent(id)}`)
      await load()
    }catch(e){
      setError(e?.response?.data?.error || e?.message || String(e))
    }finally{ setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <h2 className="text-xl font-semibold">{model}</h2>
        <div className="ml-auto text-sm text-gray-700">Ukupno: <b>{total}</b></div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <div className="text-sm text-gray-600 mb-1">take</div>
          <input type="number" value={take} onChange={e=>setTake(Number(e.target.value)||25)} min={1} max={100} className="border rounded p-2 w-28"/>
        </label>
        <label className="block">
          <div className="text-sm text-gray-600 mb-1">skip</div>
          <input type="number" value={skip} onChange={e=>setSkip(Number(e.target.value)||0)} min={0} className="border rounded p-2 w-28"/>
        </label>
        <button onClick={load} className="px-3 py-2 bg-gray-900 text-white rounded">Reload</button>
        <button onClick={openCreate} className="px-3 py-2 bg-emerald-600 text-white rounded">+ Create</button>
      </div>

      <details className="border rounded p-3 bg-gray-50">
        <summary className="cursor-pointer font-medium">Napredna pretraga (where/include JSON)</summary>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <Textarea
            label="where (JSON)"
            value={where}
            onChange={setWhere}
            placeholder='{"email":{"contains":"@gmail.com"}}'
          />
          <Textarea
            label="include (JSON)"
            value={include}
            onChange={setInclude}
            placeholder='{"offers":true}'
          />
        </div>
        <div className="mt-2">
          <button onClick={load} className="px-3 py-2 bg-gray-900 text-white rounded">Primijeni</button>
        </div>
      </details>

      {error && <div className="text-red-600 whitespace-pre-wrap">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {cols.map(c => <th key={c} className="text-left p-2 border-b">{c}</th>)}
              <th className="text-left p-2 border-b">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="odd:bg-white even:bg-gray-50">
                {cols.map(c => (
                  <td key={c} className="p-2 align-top border-b">
                    {typeof it[c] === 'object' ? JSON.stringify(it[c]) : String(it[c])}
                  </td>
                ))}
                <td className="p-2 border-b">
                  <button onClick={()=>openEdit(it)} className="px-2 py-1 bg-blue-600 text-white rounded mr-2">Edit</button>
                  <button onClick={()=>remove(it.id)} className="px-2 py-1 bg-rose-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editItem !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{editItem?.id ? 'Uredi' : 'Kreiraj'} {model}</h3>
              <button onClick={()=>setEditItem(null)} className="px-2 py-1">✕</button>
            </div>
            
            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
              <p className="text-sm text-blue-900">
                <strong>💡 Savjet:</strong> {editItem?.id 
                  ? 'Za update možeš poslati samo polja koja mijenjaš. Primjer: {"fullName":"Novo Ime"}'
                  : 'Popuni JSON sa svim potrebnim poljima. Klikni "Učitaj primjer" za template.'
                }
              </p>
              {!editItem?.id && (
                <button 
                  onClick={loadExample}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  📋 Učitaj primjer za {model}
                </button>
              )}
            </div>

            <textarea
              value={rawJson}
              onChange={e=>setRawJson(e.target.value)}
              className="w-full border rounded p-2 font-mono text-sm"
              rows={18}
              placeholder="Unesi JSON..."
            />
            
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Format: JSON | Provjeri sintaksu prije spremanja
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setEditItem(null)} className="px-3 py-2 border rounded hover:bg-gray-50">Odustani</button>
                <button onClick={save} className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700" disabled={loading}>
                  {loading ? 'Spremam...' : 'Spremi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
