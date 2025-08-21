import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

function SignUp() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)
		setLoading(true)
		try {
			await api.post('/auth/register', { email, password })
			setInfo('Registration successful. Please check your email to verify your account.')
			setTimeout(() => navigate('/signin', { replace: true }), 1200)
		} catch (err: any) {
			const message = err?.response?.data?.error || 'Registration failed'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Sign Up</h2>
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
					{loading ? 'Signing up...' : 'Sign Up'}
				</button>
			</form>
			{error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
			{info && <p style={{ color: 'green', marginTop: 12 }}>{info}</p>}
			<p style={{ marginTop: 12 }}>
				Already have an account? <Link to="/signin">Sign In</Link>
			</p>
		</div>
	)
}

export default SignUp