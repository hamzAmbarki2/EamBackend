import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:8080/api',
	timeout: 10000, // 10 secondes
	headers: {
		'Content-Type': 'application/json',
	},
} )

// Intercepteur de requêtes pour ajouter le token JWT
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		console.log('Request:', config)
		return config
	},
	(error) => {
		console.error('Request Error:', error)
		return Promise.reject(error)
	}
)

// Intercepteur de réponses pour gérer les erreurs globales
api.interceptors.response.use(
	(response) => {
		console.log('Response:', response)
		return response
	},
	(error) => {
		console.error('Response Error:', error)
		if (error.response?.status === 401) {
			// Gérer l'expiration du token ou les erreurs d'authentification
			localStorage.removeItem('token')
			// Rediriger vers la page de connexion si nécessaire
			// window.location.href = '/signin'
		}
		return Promise.reject(error)
	}
)

export default api
