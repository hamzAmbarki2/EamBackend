import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/client'

function ForgotPassword() {
	const [params] = useSearchParams()
	const errorParam = useMemo(() => params.get('error'), [params])
	const [email, setEmail] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [info, setInfo] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	// Gérer les erreurs passées en paramètre d'URL
	useEffect(() => {
		if (errorParam === 'invalid_token') {
			setError('Le lien de réinitialisation était invalide ou a expiré. Veuillez demander un nouveau lien ci-dessous.')
		} else if (errorParam === 'server_error') {
			setError('Une erreur serveur s\'est produite. Veuillez réessayer.')
		}
	}, [errorParam])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setInfo(null)

		if (!email || !email.includes('@')) {
			setError('Veuillez entrer une adresse email valide')
			return
		}

		setLoading(true)

		try {
			const res = await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`)
			const message = res?.data?.message || 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
			setInfo(message)
			setEmail('') // Vider le champ email
		} catch (err: any) {
			const status = err?.response?.status
			const data = err?.response?.data
			let message = data?.error || data?.message || 'Échec de l\'envoi de l\'email'

			if (status === 404) {
				// Ne pas révéler si l'email existe ou non pour des raisons de sécurité
				message = 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
				setInfo(message)
				setEmail('')
			} else {
				if (status) message += ` (HTTP ${status})`
				if (!err?.response) message = 'Aucune réponse du serveur. La passerelle API fonctionne-t-elle sur http://localhost:8080 ?'
				setError(message )
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif' }}>
			<h2>Mot de passe oublié</h2>
			<p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>

			<form onSubmit={handleSubmit} noValidate>
				<label>Adresse email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					style={{ width: '100%', padding: 8, marginBottom: 12 }}
					placeholder="votre@email.com"
				/>

				<button
					type="submit"
					disabled={loading}
					style={{
						width: '100%',
						padding: 10,
						backgroundColor: loading ? '#ccc' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: 4,
						cursor: loading ? 'not-allowed' : 'pointer'
					}}
				>
					{loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
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

export default ForgotPassword
