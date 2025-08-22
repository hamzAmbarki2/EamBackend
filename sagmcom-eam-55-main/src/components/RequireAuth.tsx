import { Navigate, Outlet, useLocation } from "react-router-dom";

function getRoleRedirect(role: string) {
	const r = role.toUpperCase();
	if (r === "ADMIN") return "/admin";
	if (r === "CHEFOP") return "/chef-operateur";
	if (r === "CHEFTECH") return "/chef-technicien";
	return "/technicien";
}

export function RequireAuth({ allowed }: { allowed?: string[] }) {
	const location = useLocation();
	const token = typeof window !== "undefined" ? (localStorage.getItem("token") || sessionStorage.getItem("token")) : null;
	const role = typeof window !== "undefined" ? (localStorage.getItem("role") || "") : "";
	if (!token) {
		return <Navigate to="/signin" replace state={{ from: location }} />;
	}
	if (allowed && allowed.length > 0 && !allowed.includes(role)) {
		return <Navigate to={getRoleRedirect(role)} replace />;
	}
	return <Outlet />;
}