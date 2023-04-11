import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../user/User.service";
import { JwtService } from "@nestjs/jwt"
import { CreateUserDto } from "src/user/User.create-dto";
import { NotFoundError } from "rxjs";
import { authenticator } from 'otplib';
import { UserEntity } from '../user/User.entity'
import { toDataURL } from 'qrcode';
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async generateJWT(user: any): Promise<string> {
		const payload = { id: user.id };
		return this.jwtService.sign(payload);
	}

	async verifyJWT(jwt: string): Promise<any> {
		return this.jwtService.verify(jwt);
	}

	async getUser(userId: number): Promise<any> {
		let user: any = null;
		try {
			user = await this.userService.getOneUser(userId);
			delete user.twoFactorAuthenticationSecret;
		} catch {
			user = null;
		}
		return user;
	}

	async generateTwoFactorAuthenticationSecret(user: UserEntity): Promise<{
		secret: string;
		otpauthUrl: string;
	}> {
		const secret = authenticator.generateSecret();
	
		const otpauthUrl = authenticator.keyuri(user.username, 'TRANSCENDENCE_APP', secret);
	
		return {
		  secret,
		  otpauthUrl
		}
	}

	async generateQrCodeDataURL(otpAuthUrl: string): Promise<any> {
		return toDataURL(otpAuthUrl);
	}

	async turnOnTwoFactorAuthentication(userId: number) {
		let user = await this.userService.getOneUser(userId);
		let res = await this.generateTwoFactorAuthenticationSecret(user);
		this.userService.updateUser(userId, {
			twoFactorAuthenticationSecret: res.secret,
			isTwoFactorAuthenticationEnabled: true
		});
		return this.generateQrCodeDataURL(res.otpauthUrl);
	}

	async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, userId: number) {
		let user = await this.userService.getOneUser(userId);
		// console.log('twoFactorAuthenticationCode =', twoFactorAuthenticationCode);
		// console.log('twoFactorAuthenticationSecret =', user.twoFactorAuthenticationSecret);
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret,
		});
	}

	async generateJwtWith2fa(user: UserEntity, isTwoFactorAuthenticated: boolean) {
		const payload = {
			id: user.id,
			isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
			isTwoFactorAuthenticated: isTwoFactorAuthenticated,
		};
	
		return this.jwtService.sign(payload);
	}
	
}
