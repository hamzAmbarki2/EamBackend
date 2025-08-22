export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getAuthHeaders(): Record<string, string> {
	try {
		const token = localStorage.getItem("token") || sessionStorage.getItem("token");
		return token ? { Authorization: `Bearer ${token}` } : {};
	} catch {
		return {};
	}
}

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, baseDelayMs = 400): Promise<T> {
	let attempt = 0;
	let lastErr: any = null;
	while (attempt <= retries) {
		try {
			return await fn();
		} catch (err: any) {
			lastErr = err;
			// Only retry on network errors or 5xx
			const msg = String(err?.message || "");
			const isAbort = msg.includes("AbortError");
			const is5xx = /\s5\d\d\b/.test(msg);
			const isNetwork = msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("network");
			if (attempt === retries || isAbort || (!is5xx && !isNetwork)) break;
			const wait = Math.min(baseDelayMs * Math.pow(2, attempt), 4000);
			await delay(wait);
			attempt++;
		}
	}
	throw lastErr;
}

async function request<T>(
	path: string,
	options: { method?: HttpMethod; body?: any; headers?: Record<string, string>; timeoutMs?: number } = {}
): Promise<T> {
	const { method = "GET", body, headers = {}, timeoutMs = 10000 } = options;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(`${BASE_URL}${path}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
				...headers,
			},
			body: body ? JSON.stringify(body) : undefined,
			signal: controller.signal,
		});
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
		}
		const contentType = res.headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			return (await res.json()) as T;
		}
		// @ts-ignore allow void
		return undefined as T;
	} finally {
		clearTimeout(timeout);
	}
}

export const api = {
	auth: {
		login: (email: string, password: string) => retryWithBackoff(() => request<{ token: string }>("/api/auth/login", { method: "POST", body: { email, password } })),
		register: (payload: any) => retryWithBackoff(() => request<any>("/api/auth/register", { method: "POST", body: payload })),
		profile: () => retryWithBackoff(() => request<any>("/api/user/profile")),
	},
	assets: {
		list: () => retryWithBackoff(() => request<any[]>("/api/machine/retrieve-all-machines")),
		get: (id: number) => retryWithBackoff(() => request<any>(`/api/machine/retrieve-machine/${id}`)),
		create: (data: any) => retryWithBackoff(() => request<any>("/api/machine/add-machine", { method: "POST", body: data })),
		update: (data: any) => retryWithBackoff(() => request<any>("/api/machine/update-machine", { method: "PUT", body: data })),
		remove: (id: number) => retryWithBackoff(() => request<void>(`/api/machine/delete-machine/${id}`, { method: "DELETE" })),
	},
	users: {
		list: () => retryWithBackoff(() => request<any[]>("/api/user/retrieve-all-users")),
		get: (id: number) => retryWithBackoff(() => request<any>(`/api/user/retrieve-user/${id}`)),
		create: (data: any) => retryWithBackoff(() => request<any>("/api/user/add-user", { method: "POST", body: data })),
		update: (data: any) => retryWithBackoff(() => request<any>("/api/user/update-user", { method: "PUT", body: data })),
		remove: (id: number) => retryWithBackoff(() => request<void>(`/api/user/delete-user/${id}`, { method: "DELETE" })),
	},
	workOrders: {
		list: () => retryWithBackoff(() => request<any[]>("/api/ordreTravail/retrieve-all-ordreTravails")),
		get: (id: number) => retryWithBackoff(() => request<any>(`/api/ordreTravail/retrieve-ordreTravail/${id}`)),
		create: (data: any) => retryWithBackoff(() => request<any>("/api/ordreTravail/add-ordreTravail", { method: "POST", body: data })),
		update: (data: any) => retryWithBackoff(() => request<any>("/api/ordreTravail/update-ordreTravail", { method: "PUT", body: data })),
		remove: (id: number) => retryWithBackoff(() => request<void>(`/api/ordreTravail/delete-ordreTravail/${id}`, { method: "DELETE" })),
	},
	interventions: {
		list: () => retryWithBackoff(() => request<any[]>("/api/ordreIntervention/retrieve-all-ordreInterventions")),
		get: (id: number) => retryWithBackoff(() => request<any>(`/api/ordreIntervention/retrieve-ordreIntervention/${id}`)),
		create: (data: any) => retryWithBackoff(() => request<any>("/api/ordreIntervention/add-ordreIntervention", { method: "POST", body: data })),
		update: (data: any) => retryWithBackoff(() => request<any>("/api/ordreIntervention/update-ordreIntervention", { method: "PUT", body: data })),
		remove: (id: number) => retryWithBackoff(() => request<void>(`/api/ordreIntervention/delete-ordreIntervention/${id}`, { method: "DELETE" })),
	},
};