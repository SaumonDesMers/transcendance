import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	generateJWT(user: any): string {
		const payload = { username: user.username, sub: user.id };
		return this.jwtService.sign(payload)
	}

	findOrCreateUser(ft_profile: any): any {
		let user: any = null;
		// try {
		// 	user = this.userService.getOneUser(ft_profile.id);
		// } catch {
		// 	user = this.userService.createUser({
		// 		username: ft_profile.username,
		// 		id: ft_profile.id
		// 	});
		// }
		// return user;
		return {
			username: ft_profile.username,
			id: ft_profile.id
		};
	}

	getUser(userId: number): any {
		// return this.userService.getOneUser(userId);
	}
	
}
