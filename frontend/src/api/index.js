import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api

// Calculator APIs
export const calcAPI = {
  pf: (data) => api.post('/api/calc/pf', data),
  tax: (data) => api.post('/api/calc/tax', data),
  emi: (data) => api.post('/api/calc/emi', data),
  sip: (data) => api.post('/api/calc/sip', data),
}

// Bank APIs
export const bankAPI = {
  ifsc: (code) => api.get(`/api/bank/ifsc/${code}`),
}

// Schemes APIs
export const schemesAPI = {
  eligibility: (data) => api.post('/api/schemes/eligibility', data),
}

// Mutual Fund APIs
export const mfAPI = {
  details: (schemeCode) => api.get(`/api/mf/${schemeCode}`),
}

// Market APIs
export const marketAPI = {
  summary: () => api.get('/api/market/summary'),
  crypto: (id) => api.get(`/api/market/crypto/${id}`),
  stock: (symbol) => api.get(`/api/market/stock/${symbol}`),
  forex: (params) => api.get('/api/market/forex', { params }),
}

// Fraud Detection APIs
export const fraudAPI = {
  analyze: (data) => api.post('/api/fraud/analyze', data),
}

// Recommendations APIs
export const recommendationsAPI = {
  get: (data) => api.post('/api/recommendations', data),
}

