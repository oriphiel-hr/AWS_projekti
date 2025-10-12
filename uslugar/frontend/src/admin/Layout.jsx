/* src/admin/Layout.jsx */
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { MODELS } from './router'

export default function Layout(){
  return (
    <div className="flex min-h-[70vh] border rounded overflow-hidden">
      <aside className="w-56 border-r bg-gray-50 p-3 space-y-1">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Tablice</div>
        {MODELS.map(m => (
          <NavLink
            key={m}
            to={`/admin/${m}`}
            className={({isActive}) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
            }
          >
            {m}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
