import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

type DecodedToken = {
	sub?: string
	role?: string
	department?: string
	email?: string
}

function Welcome() {
	const token = localStorage.getItem('token')

	const { department, role } = useMemo(() => {
		if (!token) return { department: '', role: '' }
		try {
			const decoded = jwtDecode<DecodedToken>(token)
			return { department: decoded.department || '', role: decoded.role || '' }
		} catch {
			return { department: '', role: '' }
		}
	}, [token])

	if (!token) {
		return <Navigate to="/signin" replace />
	}

	return (
		<div style={{ display: 'grid', placeItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
			<h1>
				hello your department is '{department}' and your role is '{role}'
			</h1>
		</div>
	)
}

export default Welcome