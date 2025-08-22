import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/client'

function ResetPassword() {
	const [params] = useSearchParams()
	const token = useMemo(() => params.get('token') || '', [params])
	const errorParam = useMemo(() => params.get('error'), [params])
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const tokenMissing = !token

	// Gérer les erreurs passées en paramètre d'URL
	useEffect(() => {
		if (errorParam === 'invalid_token') {
			setError('Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.')
		} else if (errorParam === 'server_error') {
			setError('Une erreur serveur s\'est produite. Veuillez réessayer plus tard.')
		}
	}, [errorParam])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)

		if (!password || password.length < 6) {
			setError('Le mot de passe doit contenir au moins 6 caractères')
			return
		}

		if (password !== confirm) {
			setError('Les mots de passe ne correspondent pas')
			return
		}

		if (!token) {
			setError('Token de réinitialisation manquant')
			return
		}

		setLoading(true)

		try {
			const res = await api.post(`/auth/reset-password-confirm?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`)
			const message = res?.data?.message || 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
			setInfo(message)

			// Optionnel : rediriger vers la page de connexion après quelques secondes
			setTimeout(() => {
				window.location.href = '/signin'
			}, 3000)

		} catch (err: any) {
			const status = err?.response?.status
			const data = err?.response?.data
			let message = data?.error || data?.message || 'Échec de la réinitialisation du mot de passe'

			if (status === 400) {
				message = 'Token invalide ou expiré. Veuillez demander un nouveau lien de réinitialisation.'
			} else if (status === 404) {
				message = 'Utilisateur non trouvé.'
			} else if (status >= 500) {
				message = 'Erreur serveur. Veuillez réessayer plus tard.'
			}

			if (status) message += ` (HTTP ${status})`
			if (!err?.response) message = 'Aucune réponse du serveur. La passerelle API fonctionne-t-elle sur http://localhost:8080 ?'

			setError(message )
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Réinitialiser le mot de passe</h2>

			{tokenMissing && (
				<p style={{ color: 'crimson' }}>
					Token manquant. Utilisez le lien envoyé par email ou{' '}
					<Link to="/forgot-password">demandez un nouveau lien</Link>.
				</p>
			)}

			<form onSubmit={handleSubmit} noValidate>
				<label>Nouveau mot de passe</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
					placeholder="Au moins 6 caractères"
				/>

				<label>Confirmer le mot de passe</label>
				<input
					type="password"
					value={confirm}
					onChange={(e) => setConfirm(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
					placeholder="Répétez le mot de passe"
				/>

				<button
					type="submit"
					disabled={loading || tokenMissing}
					style={{
						width: '100%',
						padding: 10,
						backgroundColor: loading || tokenMissing ? '#ccc' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: 4,
						cursor: loading || tokenMissing ? 'not-allowed' : 'pointer'
					}}
				>
					{loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
				</button>
			</form>

			{error && (
				<p style={{ color: 'crimson', marginTop: 12, padding: 8, backgroundColor: '#ffe6e6', borderRadius: 4 }}>
					{error}
				</p>
			)}

			{info && (
				<p style={{ color: 'green', marginTop: 12, padding: 8, backgroundColor: '#e6ffe6', borderRadius: 4 }}>
					{info}
				</p>
			)}

			<p style={{ marginTop: 20, textAlign: 'center' }}>
				<Link to="/signin">Retour à la connexion</Link>
			</p>
		</div>
	)
}

export default ResetPassword
