import { useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api/client'

type DecodedToken = {
	sub?: string
	role?: string
	email?: string
}

function Welcome() {
	const navigate = useNavigate()
	const token = localStorage.getItem('token')

	const { name, role } = useMemo(() => {
		if (!token) return { name: '', role: '' }
		try {
			const decoded = jwtDecode<DecodedToken>(token)
			const email = decoded.email || decoded.sub || ''
			return { name: email.split('@')[0] || email, role: decoded.role || '' }
		} catch {
			return { name: '', role: '' }
		}
	}, [token])

	if (!token) {
		return <Navigate to="/signin" replace />
	}

	async function handleLogout() {
		try {
			await api.post('/auth/logout')
		} catch {
			// ignore failure; proceed to clear token client-side
		}
		localStorage.removeItem('token')
		navigate('/signin', { replace: true })
	}

	return (
		<div style={{ display: 'grid', placeItems: 'center', height: '100vh', fontFamily: 'sans-serif', gap: 16 }}>
			<h1>
				Hello {name} your role is {role}
			</h1>
			<button onClick={handleLogout} style={{ padding: '8px 16px' }}>Logout</button>
		</div>
	)
}

export default Welcome