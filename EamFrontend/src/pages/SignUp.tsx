import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

function SignUp() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [cin, setCin] = useState('')
	const [avatar, setAvatar] = useState('')
	const [role, setRole] = useState<'CHEFOP' | 'ADMIN' | 'CHEFTECH' | 'TECHNICIEN'>('TECHNICIEN')
	const [department, setDepartment] = useState<'PRODUCTION' | 'MAINTENANCE' | 'QUALITÉ' | 'LOGISTIQUE'>('MAINTENANCE')
	const [error, setError] = useState<string | null>(null)
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)
		setLoading(true)
		try {
			await api.post('/auth/register', {
				email,
				password,
				phone: phone || undefined,
				CIN: cin || undefined,
				avatar: avatar || undefined,
				role,
				department
			})
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
				<label>Phone</label>
				<input
					type="tel"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder="Optional"
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				/>
				<label>CIN</label>
				<input
					type="text"
					value={cin}
					onChange={(e) => setCin(e.target.value)}
					placeholder="Optional"
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				/>
				<label>Avatar URL</label>
				<input
					type="url"
					value={avatar}
					onChange={(e) => setAvatar(e.target.value)}
					placeholder="Optional"
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				/>
				<label>Role</label>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value as any)}
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				>
					<option value="TECHNICIEN">TECHNICIEN</option>
					<option value="CHEFOP">CHEFOP</option>
					<option value="CHEFTECH">CHEFTECH</option>
					<option value="ADMIN">ADMIN</option>
				</select>
				<label>Department</label>
				<select
					value={department}
					onChange={(e) => setDepartment(e.target.value as any)}
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
				>
					<option value="MAINTENANCE">MAINTENANCE</option>
					<option value="PRODUCTION">PRODUCTION</option>
					<option value="QUALITÉ">QUALITÉ</option>
					<option value="LOGISTIQUE">LOGISTIQUE</option>
				</select>
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