import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

function BackendResetRedirect() {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const token = params.get('token')
        if (token) {
            navigate(`/reset-password?token=${encodeURIComponent(token)}`, { replace: true })
        } else {
            navigate('/forgot-password', { replace: true })
        }
    }, [params, navigate])

    return null
}

export default BackendResetRedirect
