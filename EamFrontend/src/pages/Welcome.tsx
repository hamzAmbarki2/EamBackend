import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

type DecodedToken = {
	sub?: string
	role?: string
	email?: string
}

function Welcome() {
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

	return (
		<div style={{ display: 'grid', placeItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
			<h1>
				Hello {name} your role is {role}
			</h1>
		</div>
	)
}

export default Welcome