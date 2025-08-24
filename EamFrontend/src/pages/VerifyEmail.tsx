import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/client'

function VerifyEmail() {
    const [params] = useSearchParams()
    const [verificationStatus, setVerificationStatus] = useState(
        'Vérification en cours...'
    )
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const token = params.get('token')
        if (!token) {
            setVerificationStatus('Token de vérification manquant.')
            setIsError(true)
            return
        }

        const verifyAccount = async () => {
            try {
                await api.get(`/auth/verify?token=${encodeURIComponent(token)}`)
                setVerificationStatus(
                    'Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.'
                )
                setIsError(false)
            } catch (err: any) {
                const message = err?.response?.data?.error || 'Échec de la vérification du compte.'
                setVerificationStatus(message)
                setIsError(true)
            }
        }

        verifyAccount()
    }, [params])

    return (
        <div style={{ maxWidth: 400, margin: '64px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h2>Vérification de l'e-mail</h2>
            <p style={{ color: isError ? 'crimson' : 'green', fontWeight: 'bold' }}>
                {verificationStatus}
            </p>
            {!isError && (
                <p>
                    <Link to="/signin">Cliquez ici pour vous connecter</Link>
                </p>
            )}
            {isError && (
                <p>
                    <Link to="/signup">Retour à l'inscription</Link>
                </p>
            )}
        </div>
    )
}

export default VerifyEmail
