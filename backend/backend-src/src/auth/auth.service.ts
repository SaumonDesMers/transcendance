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
	
}
