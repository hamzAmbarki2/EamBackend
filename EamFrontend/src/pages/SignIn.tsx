import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

function SignIn() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const res = await api.post('/auth/login', { email, password })
			const token = res.data?.token as string
			if (token) {
				localStorage.setItem('token', token)
				navigate('/welcome', { replace: true })
			} else {
				setError('Unexpected response from server: no token field')
			}
		} catch (err: any) {
			const status = err?.response?.status
			const data = err?.response?.data
			const action = data?.action
			const backendMsg = data?.error || data?.message
			let message = backendMsg || 'Login failed'
			if (status) message += ` (HTTP ${status})`
			if (action === 'verify_email') message += ' - please verify your email first.'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Sign In</h2>
			<form onSubmit={handleSubmit}>
				<label>Email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				/>
				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				/>
				<button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>
			{error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
			<p style={{ marginTop: 12 }}>
				No account? <Link to="/signup">Sign Up</Link>
			</p>
			<div style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
				<p>Debug tip: Check browser console for [api:req] and [api:err] logs.</p>
			</div>
		</div>
	)
}

export default SignIn