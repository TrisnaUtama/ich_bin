import { createRemoteJWKSet, jwtVerify } from "jose";
import { settings } from "../configs/settings";

// Google's public keys for verifying ID token signatures — jose caches and
// auto-refreshes this against Google's JWKS endpoint, no manual key rotation
// handling needed.
const googleJwks = createRemoteJWKSet(
	new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export type GoogleIdTokenPayload = {
	sub: string; // Google's stable user id
	email: string;
	emailVerified: boolean;
	name?: string;
	picture?: string;
};

/**
 * Verifies a Google ID token (the credential the frontend gets from Google
 * Sign-In) — checks signature, issuer, audience (our GOOGLE_CLIENT_ID) and
 * expiry. Throws if any of that fails.
 */
export async function verifyGoogleIdToken(
	idToken: string,
): Promise<GoogleIdTokenPayload> {
	const { payload } = await jwtVerify(idToken, googleJwks, {
		issuer: ["https://accounts.google.com", "accounts.google.com"],
		audience: settings.google.clientId,
	});

	if (!payload.sub || typeof payload.email !== "string") {
		throw new Error("Google ID token missing required claims");
	}

	return {
		sub: payload.sub,
		email: payload.email,
		emailVerified: payload.email_verified === true,
		name: typeof payload.name === "string" ? payload.name : undefined,
		picture: typeof payload.picture === "string" ? payload.picture : undefined,
	};
}
