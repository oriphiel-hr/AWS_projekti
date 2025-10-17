/* src/admin/router.jsx */
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import ModelPage from './ModelPage'

// Model nazivi u PascalCase kako backend očekuje
export const MODELS = ['User','ProviderProfile','Category','Job','Offer','Review']

export default function AdminRouter(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={`/admin/${MODELS[0]}`} replace />} />
          {MODELS.map(m => (
            <Route key={m} path={`/admin/${m}`} element={<ModelPage model={m} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
