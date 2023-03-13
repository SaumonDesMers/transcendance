import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../user/User.service";
import { JwtService } from "@nestjs/jwt"
import { CreateUserDto } from "src/user/User.create-dto";
import { NotFoundError } from "rxjs";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async generateJWT(user: any): Promise<string> {
		const payload = { username: user.username, sub: user.id };
		return this.jwtService.sign(payload);
	}

	async verifyJWT(jwt: string): Promise<any> {
		return this.jwtService.verify(jwt);
	}

	async findOrCreateUser(userDto: CreateUserDto): Promise<any> {
		let user: any = null;
		try {
			user = await this.userService.getOneUser(userDto.id);
		} catch {
			user = this.userService.createUser(userDto);
		}
		return user;
	}

	async getUser(userId: number): Promise<any> {
		let user: any = null;
		try {
			user = await this.userService.getOneUser(userId);
		} catch {
			user = null;
			// throw new NotFoundException();
		}
		return user;
	}
	
}
