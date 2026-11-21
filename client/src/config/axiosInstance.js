import axios from "axios";

const isBrowser = typeof window !== "undefined";
const configuredApiBase =
	import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const normalizeApiBase = (baseUrl) => {
	const trimmed = baseUrl.replace(/\/+$/, "");
	if (!/^https?:\/\//i.test(trimmed)) return trimmed;
	return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const configuredApiBaseNormalized = configuredApiBase
	? normalizeApiBase(configuredApiBase)
	: null;
const defaultApiBase = isBrowser && import.meta.env.DEV
	? "/api"
	: isBrowser
		? `${window.location.origin}/api`
		: "/api";
const BASE_URL = (configuredApiBaseNormalized || defaultApiBase).replace(/\/+$/, "");

if (isBrowser && !configuredApiBase && import.meta.env.PROD) {
	console.warn(
		"VITE_API_BASE_URL is not configured. API requests will use the frontend origin:",
		BASE_URL
	);
}

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

export default axiosInstance;