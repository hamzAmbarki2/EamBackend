import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Welcome from './pages/Welcome'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import BackendResetRedirect from './pages/BackendResetRedirect'

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/signin" replace />} />
			<Route path="/signin" element={<SignIn />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />
			{/* Handle links coming from backend emails */}
			<Route path="/api/auth/reset-password" element={<BackendResetRedirect />} />
			<Route path="/api/auth/verify" element={<VerifyEmail />} />
			<Route path="/welcome" element={<Welcome />} />
			<Route path="*" element={<Navigate to="/signin" replace />} />
		</Routes>
	)
}

export default App
