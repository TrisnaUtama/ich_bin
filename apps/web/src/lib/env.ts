/**
 * Centralized, validated access to env vars — nothing outside this file
 * should reference import.meta.env.VITE_* or window.__ENV__ directly, so
 * there's one place to see what the app depends on and one place that
 * fails loudly (instead of a silent `undefined` deep in a fetch call) if
 * a var is missing.
 *
 * Two sources, in priority order:
 *  1. window.__ENV__ — injected at container start in production (see
 *     docker-entrypoint.d/40-inject-env.sh), so ONE built image can be
 *     deployed to staging/prod with different values.
 *  2. import.meta.env.VITE_* — Vite's build-time env, used for local dev
 *     (`bun run dev`) where window.__ENV__ doesn't exist.
 */
function required(value: string | undefined, name: string): string {
	if (!value) {
		throw new Error(
			`Missing required env var "${name}" — check apps/web/.env (see .env.example) for local dev, or the container's env vars in production.`,
		);
	}
	return value;
}

const runtime = typeof window !== "undefined" ? (window.__ENV__ ?? {}) : {};

export const env = {
	apiBaseUrl: required(
		runtime.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL,
		"VITE_API_BASE_URL",
	),
	googleClientId: required(
		runtime.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID,
		"VITE_GOOGLE_CLIENT_ID",
	),
} as const;
