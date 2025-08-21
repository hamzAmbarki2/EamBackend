import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/client'

function ResetPassword() {
	const [params] = useSearchParams()
	const token = useMemo(() => params.get('token') || '', [params])
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const tokenMissing = !token

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)
		if (!password || password.length < 6) {
			setError('Password must be at least 6 characters')
			return
		}
		if (password !== confirm) {
			setError('Passwords do not match')
			return
		}
		if (!token) {
			setError('Missing reset token')
			return
		}
		setLoading(true)
		try {
			const res = await api.post(`/auth/reset-password-confirm?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`)
			const message = res?.data?.message || 'Password reset successfully. You can now login.'
			setInfo(message)
		} catch (err: any) {
			const status = err?.response?.status
			const data = err?.response?.data
			let message = data?.error || data?.message || 'Failed to reset password'
			if (status) message += ` (HTTP ${status})`
			if (!err?.response) message = 'No response from server. Is the API gateway running at http://localhost:8080?'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Reset Password</h2>
			{tokenMissing && (
				<p style={{ color: 'crimson' }}>Missing token. Use the link sent to your email or <Link to="/forgot-password">request a new one</Link>.</p>
			)}
			<form onSubmit={handleSubmit} noValidate>
				<label>New password</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
				<label>Confirm password</label>
				<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
				<button type="submit" disabled={loading || tokenMissing} style={{ width: '100%', padding: 10 }}>
					{loading ? 'Resetting...' : 'Reset password'}
				</button>
			</form>
			{error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
			{info && <p style={{ color: 'green', marginTop: 12 }}>{info}</p>}
		</div>
	)
}

export default ResetPassword