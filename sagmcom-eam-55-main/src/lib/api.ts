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
	assets: {
		list: () => request<any[]>("/api/machine/retrieve-all-machines"),
		get: (id: number) => request<any>(`/api/machine/retrieve-machine/${id}`),
		create: (data: any) => request<any>("/api/machine/add-machine", { method: "POST", body: data }),
		update: (data: any) => request<any>("/api/machine/update-machine", { method: "PUT", body: data }),
		remove: (id: number) => request<void>(`/api/machine/delete-machine/${id}`, { method: "DELETE" }),
	},
	users: {
		list: () => request<any[]>("/api/user/retrieve-all-users"),
		get: (id: number) => request<any>(`/api/user/retrieve-user/${id}`),
		create: (data: any) => request<any>("/api/user/add-user", { method: "POST", body: data }),
		update: (data: any) => request<any>("/api/user/update-user", { method: "PUT", body: data }),
		remove: (id: number) => request<void>(`/api/user/delete-user/${id}`, { method: "DELETE" }),
	},
	workOrders: {
		list: () => request<any[]>("/api/ordreTravail/retrieve-all-ordreTravails"),
		get: (id: number) => request<any>(`/api/ordreTravail/retrieve-ordreTravail/${id}`),
		create: (data: any) => request<any>("/api/ordreTravail/add-ordreTravail", { method: "POST", body: data }),
		update: (data: any) => request<any>("/api/ordreTravail/update-ordreTravail", { method: "PUT", body: data }),
		remove: (id: number) => request<void>(`/api/ordreTravail/delete-ordreTravail/${id}`, { method: "DELETE" }),
	},
	interventions: {
		list: () => request<any[]>("/api/ordreIntervention/retrieve-all-ordreInterventions"),
		get: (id: number) => request<any>(`/api/ordreIntervention/retrieve-ordreIntervention/${id}`),
		create: (data: any) => request<any>("/api/ordreIntervention/add-ordreIntervention", { method: "POST", body: data }),
		update: (data: any) => request<any>("/api/ordreIntervention/update-ordreIntervention", { method: "PUT", body: data }),
		remove: (id: number) => request<void>(`/api/ordreIntervention/delete-ordreIntervention/${id}`, { method: "DELETE" }),
	},
};