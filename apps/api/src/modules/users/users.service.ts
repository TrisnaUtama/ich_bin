import { AppError, ErrorCode } from "../../errors";
import {
	userRepository as defaultUserRepository,
	type UserRepository,
} from "../shared/repository/user.repository";
import type { UserProfile } from "./users.types";

export class UsersService {
	constructor(
		private readonly userRepository: UserRepository = defaultUserRepository,
	) {}

	async getProfile(userId: string): Promise<UserProfile> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new AppError(404, ErrorCode.USER_NOT_FOUND);
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			avatarUrl: user.avatarUrl,
			creditBalance: user.creditBalance,
		};
	}
}

export const usersService = new UsersService();
