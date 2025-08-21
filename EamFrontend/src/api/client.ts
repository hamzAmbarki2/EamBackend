import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers = config.headers ?? {}
		config.headers['Authorization'] = `Bearer ${token}`
	}
	// lightweight request log for debugging connectivity
	console.debug('[api:req]', config.method?.toUpperCase(), config.baseURL + (config.url || ''), config.params || '', config.data || '')
	return config
})

api.interceptors.response.use(
	(response) => {
		console.debug('[api:res]', response.status, response.config.url, response.data)
		return response
	},
	(error) => {
		const status = error?.response?.status
		const url = error?.config?.url
		const data = error?.response?.data
		console.error('[api:err]', status, url, data)
		return Promise.reject(error)
	}
)

export default api