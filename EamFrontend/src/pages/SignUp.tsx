import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

const ROLES = ['ADMIN', 'CHEFOP', 'CHEFTECH', 'TECHNICIEN'] as const
const DEPARTMENTS = ['PRODUCTION', 'MAINTENANCE', 'QUALITÉ', 'LOGISTIQUE'] as const

type Role = typeof ROLES[number]
type Department = typeof DEPARTMENTS[number]

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
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)
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
			const detailed = err?.response?.data
			const message = detailed?.error || detailed?.message || `Registration failed (HTTP ${err?.response?.status ?? 'n/a'})`
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 420, margin: '48px auto', fontFamily: 'sans-serif' }}>
			<h2>Sign Up</h2>
			<form onSubmit={handleSubmit}>
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />

				<label>Password</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />

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
			{error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
			{info && <p style={{ color: 'green', marginTop: 12 }}>{info}</p>}
			<p style={{ marginTop: 12 }}>
				Already have an account? <Link to="/signin">Sign In</Link>
			</p>
		</div>
	)
}

export default SignUp