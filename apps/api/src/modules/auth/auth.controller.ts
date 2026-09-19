import type { Context } from "hono";
import { SuccessCode } from "../../i18n";
import { ApiResponse } from "../../lib/api-response";
import type { AppEnv } from "../../lib/hono-env";
import {
	type AuthService,
	authService as defaultAuthService,
} from "./auth.service";

export class AuthController {
	constructor(private readonly authService: AuthService = defaultAuthService) {}

	private requestMeta(c: Context<AppEnv>) {
		return {
			userAgent: c.req.header("user-agent"),
			ipAddress: c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip"),
		};
	}

	googleLogin = async (c: Context<AppEnv>) => {
		// @ts-expect-error — c.req.valid is added by the OpenAPIHono route validator at runtime
		const { idToken } = c.req.valid("json") as { idToken: string };
		const tokens = await this.authService.loginWithGoogle(
			idToken,
			this.requestMeta(c),
		);
		return ApiResponse.success(c, SuccessCode.LOGIN_SUCCESS, tokens, 200);
	};

	refresh = async (c: Context<AppEnv>) => {
		// @ts-expect-error — c.req.valid is added by the OpenAPIHono route validator at runtime
		const { refreshToken } = c.req.valid("json") as { refreshToken: string };
		const tokens = await this.authService.rotateRefreshToken(
			refreshToken,
			this.requestMeta(c),
		);
		return ApiResponse.success(c, SuccessCode.TOKEN_REFRESHED, tokens, 200);
	};

	logout = async (c: Context<AppEnv>) => {
		// @ts-expect-error — c.req.valid is added by the OpenAPIHono route validator at runtime
		const { refreshToken } = c.req.valid("json") as { refreshToken: string };
		await this.authService.revokeRefreshToken(refreshToken);
		return ApiResponse.noContent(c, 204);
	};
}

export const authController = new AuthController();
