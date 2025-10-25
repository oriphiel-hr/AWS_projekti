// src/api.js
import axios from 'axios'

// Production: https://uslugar.api.oriph.io/api
// Development: http://localhost:4000/api
// Relative (same domain): /api

const API_BASE = import.meta.env.VITE_API_URL || 'https://uslugar.api.oriph.io';

// Remove trailing slash and ensure /api is present
let baseURL = API_BASE.replace(/\/$/, '');
if (!baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const api = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;