// src/api.js
import axios from 'axios'

// npr. u productionu: https://uslugar.api.oriph.io
// u devu: http://localhost:4000

const API_BASE = import.meta.env.VITE_API_URL || '/api'; // npr. https://uslugar.api.oriph.io
const api = axios.create({ baseURL: API_BASE });
export default api;