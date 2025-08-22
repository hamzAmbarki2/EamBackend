import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/client'

function VerifyEmail() {
	const [params] = useSearchParams()
	const token = useMemo(() => params.get('token') || '', [params])
	const [message, setMessage] = useState<string>('Verifying...')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function run() {
			if (!token) {
				setError('Missing verification token')
				setMessage('')
				return
			}
			try {
				const res = await api.get(`/auth/verify?token=${encodeURIComponent(token)}`)
				setMessage(res?.data?.message || 'Email verified successfully. You can now sign in.')
			} catch (err: any) {
				const status = err?.response?.status
				const data = err?.response?.data
				let msg = data?.error || data?.message || 'Verification failed'
				if (status) msg += ` (HTTP ${status})`
				if (!err?.response) msg = 'No response from server. Is the API gateway running at http://localhost:8080?'
				setError(msg)
				setMessage('')
			}
		}
		run()
	}, [token])

	return (
		<div style={{ maxWidth: 480, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Email Verification</h2>
			{message && <p style={{ color: 'green' }}>{message}</p>}
			{error && <p style={{ color: 'crimson' }}>{error}</p>}
			<p style={{ marginTop: 12 }}>
				Back to <Link to="/signin">Sign in</Link>
			</p>
		</div>
	)
}

export default VerifyEmail