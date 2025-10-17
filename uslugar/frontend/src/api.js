// src/api.js
import axios from 'axios'

// Production: https://uslugar.api.oriph.io
// Development: http://localhost:4000
// Relative (same domain): /api

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Remove trailing slash if present
const baseURL = API_BASE.replace(/\/$/, '');

const api = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;