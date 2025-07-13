// API Configuration
// For production, you'll need to deploy your backend to a cloud service
// and update this URL to point to your deployed backend
const getApiBaseUrl = () => {
  // Use environment variable if available, otherwise fallback to localhost
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (envUrl) {
    return envUrl
  }
  
  // Check if we're in production (deployed site)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Use Railway deployment URL (will be updated after deployment)
    return 'https://nextkstar-backend-production.up.railway.app'
  }
  // Local development
  return 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()

export const API_ENDPOINTS = {
  ANALYZE: `${API_BASE_URL}/analyze/`,
  HEALTH: `${API_BASE_URL}/health`,
  CELEBRITIES: `${API_BASE_URL}/celebrities/`,
  CSV_STATS: `${API_BASE_URL}/csv-stats/`,
  RELOAD: `${API_BASE_URL}/reload-celebrities/`
}

export default API_ENDPOINTS 