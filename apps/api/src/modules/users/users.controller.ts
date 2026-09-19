import type { Context } from "hono";
import { SuccessCode } from "../../i18n";
import { ApiResponse } from "../../lib/api-response";
import type { AppEnv } from "../../lib/hono-env";
import {
	usersService as defaultUsersService,
	type UsersService,
} from "./users.service";

export class UsersController {
	constructor(
		private readonly usersService: UsersService = defaultUsersService,
	) {}

	getMe = async (c: Context<AppEnv>) => {
		const userId = c.get("userId");
		const profile = await this.usersService.getProfile(userId);
		return ApiResponse.success(c, SuccessCode.PROFILE_FETCHED, profile, 200);
	};
}

export const usersController = new UsersController();
