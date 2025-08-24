import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

function isValidEmail(value: string) {
	return /.+@.+\..+/.test(value)
}

function SignIn() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
	const [loading, setLoading] = useState(false)

	function validate() {
		const next: { email?: string; password?: string } = {}
		if (!email) next.email = 'Email is required'
		else if (!isValidEmail(email)) next.email = 'Enter a valid email address'
		if (!password) next.password = 'Password is required'
		setFieldErrors(next)
		return Object.keys(next).length === 0
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		if (!validate()) return
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
			if (!err?.response) message = 'No response from server. Is the API gateway running at http://localhost:8080?'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Sign In</h2>
			<form onSubmit={handleSubmit} noValidate>
				<label>Email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 4 }}
				/>
				{fieldErrors.email && <div style={{ color: 'crimson', marginBottom: 8 }}>{fieldErrors.email}</div>}

				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 4 }}
				/>
				{fieldErrors.password && <div style={{ color: 'crimson', marginBottom: 8 }}>{fieldErrors.password}</div>}

				<button type="submit" disabled={loading} style={{ width: '100%', padding: 10, marginTop: 8 }}>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
				<p>
					No account? <Link to="/signup">Sign Up</Link>
				</p>
				<p>
					<Link to="/forgot-password">Forgot password?</Link>
				</p>
			</div>
			{error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
			<div style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
				<p>Tip: If you see no backend activity, try setting VITE_API_BASE_URL in .env</p>
			</div>
		</div>
	)
}

export default SignIn