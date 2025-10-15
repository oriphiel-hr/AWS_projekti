// src/api.js
import axios from 'axios'

// npr. u productionu: https://uslugar.api.oriph.io
// u devu: http://localhost:4000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE,
  // (po želji) timeout, headers itd.
})

export default api
