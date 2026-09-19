export {};

declare global {
	interface Window {
		/**
		 * Injected at container start by apps/web/docker-entrypoint.d/40-inject-env.sh
		 * (generated from real env vars, written to /env.js, loaded before
		 * main.tsx — see index.html). Absent in local dev, where Vite's
		 * build-time import.meta.env.VITE_* is used instead.
		 */
		__ENV__?: {
			VITE_API_BASE_URL?: string;
			VITE_GOOGLE_CLIENT_ID?: string;
		};
	}
}
