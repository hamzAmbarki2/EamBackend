import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

const ROLES = ['ADMIN', 'CHEFOP', 'CHEFTECH', 'TECHNICIEN'] as const
const DEPARTMENTS = ['PRODUCTION', 'MAINTENANCE', 'QUALITÉ', 'LOGISTIQUE'] as const

type Role = typeof ROLES[number]
type Department = typeof DEPARTMENTS[number]

function isValidEmail(value: string) {
	return /.+@.+\..+/.test(value)
}

function SignUp() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [cin, setCin] = useState('')
	const [phone, setPhone] = useState('')
	const [role, setRole] = useState<Role>('TECHNICIEN')
	const [department, setDepartment] = useState<Department | ''>('')
	const [avatar, setAvatar] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	function validate() {
		const next: { email?: string; password?: string } = {}
		if (!email) next.email = 'Email is required'
		else if (!isValidEmail(email)) next.email = 'Enter a valid email address'
		if (!password) next.password = 'Password is required'
		else if (password.length < 6) next.password = 'Password must be at least 6 characters'
		setFieldErrors(next)
		return Object.keys(next).length === 0
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)
		if (!validate()) return
		setLoading(true)
		try {
			const payload = {
				email,
				password,
				CIN: cin || undefined,
				phone: phone || undefined,
				role: role || undefined,
				department: department || undefined,
				avatar: avatar || undefined
			}
			await api.post('/auth/register', payload)
			setInfo('Registration successful. Please check your email to verify your account.')
			setTimeout(() => navigate('/signin', { replace: true }), 1400)
		} catch (err: any) {
			const status = err?.response?.status
			const data = err?.response?.data
			const backendMsg = data?.error || data?.message
			let message = backendMsg || 'Registration failed'
			if (status) message += ` (HTTP ${status})`
			if (!err?.response) message = 'No response from server. Is the API gateway running at http://localhost:8080?'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 420, margin: '48px auto', fontFamily: 'sans-serif' }}>
			<h2>Sign Up</h2>
			<form onSubmit={handleSubmit} noValidate>
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 4 }} />
				{fieldErrors.email && <div style={{ color: 'crimson', marginBottom: 8 }}>{fieldErrors.email}</div>}

				<label>Password</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 4 }} />
				{fieldErrors.password && <div style={{ color: 'crimson', marginBottom: 8 }}>{fieldErrors.password}</div>}

				<label>CIN</label>
				<input value={cin} onChange={(e) => setCin(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: 8, marginBottom: 12 }} />

				<label>Phone</label>
				<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: 8, marginBottom: 12 }} />

				<label>Role</label>
				<select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ width: '100%', padding: 8, marginBottom: 12 }}>
					{ROLES.map((r) => (
						<option key={r} value={r}>{r}</option>
					))}
				</select>

				<label>Department</label>
				<select value={department} onChange={(e) => setDepartment(e.target.value as Department)} style={{ width: '100%', padding: 8, marginBottom: 12 }}>
					<option value="">Select department</option>
					{DEPARTMENTS.map((d) => (
						<option key={d} value={d}>{d}</option>
					))}
				</select>

				<label>Avatar URL</label>
				<input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: 8, marginBottom: 12 }} />

				<button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
					{loading ? 'Signing up...' : 'Sign Up'}
				</button>
			</form>
			{error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
			{info && <p style={{ color: 'green', marginTop: 12 }}>{info}</p>}
			<p style={{ marginTop: 12 }}>
				Already have an account? <Link to="/signin">Sign In</Link>
			</p>
			<div style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
				<p>Tip: If you see no backend activity, try setting VITE_API_BASE_URL in .env</p>
			</div>
		</div>
	)
}

export default SignUp