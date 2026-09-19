import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "#/lib/env";

const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleIdentityScript(): Promise<void> {
	if (window.google?.accounts?.id) return Promise.resolve();

	const existing = document.querySelector<HTMLScriptElement>(
		`script[src="${GSI_SCRIPT_SRC}"]`,
	);
	if (existing) {
		return new Promise((resolve, reject) => {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () =>
				reject(new Error("Gagal memuat Google Identity Services.")),
			);
		});
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = GSI_SCRIPT_SRC;
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = () =>
			reject(new Error("Gagal memuat Google Identity Services."));
		document.head.appendChild(script);
	});
}

/**
 * Loads Google Identity Services and exposes requestIdToken(), which
 * resolves with the Google ID token (JWT) the backend's /auth/google
 * endpoint expects — never a Google access token, those are a different
 * thing and won't verify.
 *
 * Uses the One Tap prompt rather than Google's own rendered button so it
 * can be triggered from our own custom-styled GoogleButton on click.
 */
export function useGoogleIdToken() {
	const [isReady, setIsReady] = useState(false);
	const pendingResolveRef = useRef<((idToken: string) => void) | null>(null);

	useEffect(() => {
		let cancelled = false;

		loadGoogleIdentityScript()
			.then(() => {
				if (cancelled || !window.google) return;

				window.google.accounts.id.initialize({
					client_id: env.googleClientId,
					auto_select: false,
					cancel_on_tap_outside: true,
					// Opt into FedCM now rather than waiting for Google to make
					// it mandatory. This also sidesteps the classic One Tap
					// failure mode where a browser silently blocks the
					// third-party cookie/iframe the legacy prompt relies on
					// (Firefox's Total Cookie Protection is a common culprit) —
					// FedCM is mediated by the browser itself instead.
					use_fedcm_for_prompt: true,
					callback: (response) => {
						pendingResolveRef.current?.(response.credential);
						pendingResolveRef.current = null;
					},
				});

				setIsReady(true);
			})
			.catch((err) => {
				console.error(err);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const requestIdToken = useCallback(() => {
		return new Promise<string>((resolve, reject) => {
			if (!isReady || !window.google) {
				reject(new Error("Google Sign-In belum siap, coba lagi sebentar."));
				return;
			}

			pendingResolveRef.current = resolve;

			window.google.accounts.id.prompt((notification) => {
				if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
					// Surface *why* Google skipped the prompt — e.g.
					// "unregistered_origin" (Authorized JavaScript origins
					// misconfigured, or the change hasn't propagated yet),
					// "suppressed_by_user", "opt_out_or_no_session", or a
					// browser silently blocking the third-party cookie/iframe
					// One Tap depends on (common in Firefox's Total Cookie
					// Protection). Check devtools console for this on report.
					console.warn("[google-id-token] prompt not shown", {
						notDisplayedReason: notification.isNotDisplayed()
							? notification.getNotDisplayedReason()
							: undefined,
						skippedReason: notification.isSkippedMoment()
							? notification.getSkippedReason()
							: undefined,
					});
					pendingResolveRef.current = null;
					reject(
						new Error(
							"Google sign-in dibatalkan atau diblokir browser. Coba lagi.",
						),
					);
				}
			});
		});
	}, [isReady]);

	return { isReady, requestIdToken };
}
