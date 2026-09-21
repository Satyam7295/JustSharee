import axios from "axios";

const isBrowser = typeof window !== "undefined";
const configuredApiBase =
	import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const defaultApiBase = isBrowser && import.meta.env.DEV
	? "/api"
	: isBrowser
		? `${window.location.origin}/api`
		: "/api";
const BASE_URL = (configuredApiBase || defaultApiBase).replace(/\/+$/, "");

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