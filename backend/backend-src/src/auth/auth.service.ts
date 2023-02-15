import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService
	) {}

	async validateUser(accessToken, refreshToken, profile, callback): Promise<any> {
		console.log(accessToken, refreshToken, profile)
		const [err, user] = await this.userService.validateUser(profile);
		console.log(err, user)
		callback(err, user)
		return user;
	}
	
}
