/**
 * Helpers for the opaque refresh token: a random string handed to the
 * client, only its SHA-256 hash is ever stored in refresh_tokens.token_hash.
 * Uses the standard Web Crypto API (available in Bun without any
 * extra dependency).
 */

export function generateRefreshToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return toBase64Url(bytes);
}

export async function hashToken(rawToken: string): Promise<string> {
	const data = new TextEncoder().encode(rawToken);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return toHex(new Uint8Array(digest));
}

function toBase64Url(bytes: Uint8Array): string {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function toHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}
