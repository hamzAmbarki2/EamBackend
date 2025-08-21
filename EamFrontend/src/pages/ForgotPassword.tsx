import { useState } from 'react'
import api from '../api/client'

function isValidEmail(value: string) {
	return /.+@.+\..+/.test(value)
}

function ForgotPassword() {
	const [email, setEmail] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)
		if (!isValidEmail(email)) {
			setError('Enter a valid email address')
			return
		}
		setLoading(true)
		try {
			// Backend expects email as request param
			const res = await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`)
			const message = res?.data?.message || 'If the email exists, a reset link has been sent.'
			setInfo(message)
		} catch (err: any) {
			const status = err?.response?.status
			const data = err?.response?.data
			let message = data?.error || data?.message || 'Failed to request password reset'
			if (status) message += ` (HTTP ${status})`
			if (!err?.response) message = 'No response from server. Is the API gateway running at http://localhost:8080?'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Forgot Password</h2>
			<form onSubmit={handleSubmit} noValidate>
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
				<button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
					{loading ? 'Sending...' : 'Send reset link'}
				</button>
			</form>
			{error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
			{info && <p style={{ color: 'green', marginTop: 12 }}>{info}</p>}
		</div>
	)
}

export default ForgotPassword