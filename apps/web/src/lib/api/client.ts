import { env } from "#/lib/env";
import { useAuthStore } from "#/stores/auth-store";

/**
 * Mirrors the API's response envelope (apps/api/src/lib/api-response.ts):
 * every success is { success: true, message, data }, every error is
 * { success: false, error: { code, message, details? } }.
 */
type SuccessEnvelope<T> = {
	success: true;
	message: string;
	data: T;
};

type ErrorEnvelope = {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
};

export class ApiError extends Error {
	status: number;
	code: string;
	details?: unknown;

	constructor(status: number, code: string, message: string, details?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

type RequestOptions = Omit<RequestInit, "body"> & {
	body?: unknown;
	/** Attach `Authorization: Bearer <accessToken>`. Default true — pass false for login/refresh calls. */
	auth?: boolean;
	/** Internal — prevents an infinite retry loop when the refresh call itself 401s. */
	skipRefreshRetry?: boolean;
};

/**
 * Set once at app bootstrap (see main.tsx) to break the circular
 * dependency this would otherwise create with features/auth: this module
 * doesn't know HOW to refresh a session, it just knows to call this hook
 * when a request comes back with an expired/invalid access token.
 */
type RefreshHandler = () => Promise<void>;
let refreshHandler: RefreshHandler | null = null;

export function registerRefreshHandler(handler: RefreshHandler) {
	refreshHandler = handler;
}

let refreshInFlight: Promise<void> | null = null;

async function runRequest<T>(path: string, options: RequestOptions): Promise<T> {
	const { body, auth = true, skipRefreshRetry, headers, ...rest } = options;

	const finalHeaders = new Headers(headers);
	finalHeaders.set("Content-Type", "application/json");

	if (auth) {
		const accessToken = useAuthStore.getState().accessToken;
		if (accessToken) finalHeaders.set("Authorization", `Bearer ${accessToken}`);
	}

	const response = await fetch(`${env.apiBaseUrl}${path}`, {
		...rest,
		headers: finalHeaders,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (response.status === 204) {
		return undefined as T;
	}

	const json = (await response.json()) as SuccessEnvelope<T> | ErrorEnvelope;

	if (!json.success) {
		const isExpiredAccessToken =
			response.status === 401 &&
			json.error.code === "AUTH_INVALID_ACCESS_TOKEN";

		if (isExpiredAccessToken && auth && !skipRefreshRetry && refreshHandler) {
			// Coalesce concurrent 401s into a single refresh call.
			refreshInFlight ??= refreshHandler().finally(() => {
				refreshInFlight = null;
			});

			try {
				await refreshInFlight;
				return runRequest<T>(path, { ...options, skipRefreshRetry: true });
			} catch {
				// Refresh itself failed — fall through and surface the original 401.
			}
		}

		throw new ApiError(
			response.status,
			json.error.code,
			json.error.message,
			json.error.details,
		);
	}

	return json.data;
}

export const apiClient = {
	get: <T>(path: string, options?: Omit<RequestOptions, "body">) =>
		runRequest<T>(path, { ...options, method: "GET" }),

	post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		runRequest<T>(path, { ...options, method: "POST", body }),

	patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		runRequest<T>(path, { ...options, method: "PATCH", body }),

	delete: <T>(path: string, options?: Omit<RequestOptions, "body">) =>
		runRequest<T>(path, { ...options, method: "DELETE" }),
};
