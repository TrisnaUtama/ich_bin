import { jwtVerify, SignJWT } from "jose";
import { settings } from "../configs/settings";

const secretKey = new TextEncoder().encode(settings.jwt.secret);

export type AccessTokenPayload = {
	sub: string; // user id
};

export async function signAccessToken(userId: string): Promise<string> {
	return new SignJWT({})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(userId)
		.setIssuedAt()
		.setExpirationTime(settings.jwt.accessTtl)
		.sign(secretKey);
}

/** Throws if the token is missing, malformed, expired, or has a bad signature. */
export async function verifyAccessToken(
	token: string,
): Promise<AccessTokenPayload> {
	const { payload } = await jwtVerify(token, secretKey);

	if (!payload.sub) {
		throw new Error("Token missing subject claim");
	}

	return { sub: payload.sub };
}
