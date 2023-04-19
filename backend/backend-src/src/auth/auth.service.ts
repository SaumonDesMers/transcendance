import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../user/User.service";
import { JwtService } from "@nestjs/jwt"
import { CreateUserDto } from "src/user/User.create-dto";
import { NotFoundError } from "rxjs";
import { authenticator } from 'otplib';
import { UserEntity } from '../user/User.entity'
import { toDataURL } from 'qrcode';
import { User } from "@prisma/client";
import { UserWithoutSecret } from "src/user/User.module";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async generateTmpJwt(user: any): Promise<string> {
		const payload = { id: user.id, tmp: true };
		return this.jwtService.sign(payload);
	}

	async verifyJWT(jwt: string): Promise<any> {
		return this.jwtService.verify(jwt);
	}

	async getUser(userId: number): Promise<any> {
		let user: any = null;
		try {
			user = await this.userService.getOneUser(userId);
		} catch {
			user = null;
		}
		return user;
	}

	async generate2faSecret(user: UserWithoutSecret): Promise<{
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

	async turnOn2fa(userId: number) {
		let user = await this.userService.getOneUser(userId);
		let res = await this.generate2faSecret(user);
		this.userService.updateUser(userId, {
			twoFactorAuthenticationSecret: res.secret,
			isTwoFactorAuthenticationEnabled: true
		});
		return  {
			qrcode: await this.generateQrCodeDataURL(res.otpauthUrl),
			jwt: await this.generateJwtWith2fa(user, true),
		};
	}

	async is2faCodeValid(twoFactorAuthenticationCode: string, userId: number) {
		let user = await this.userService.getOneUserWithSecret(userId);
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret,
		});
	}

	async generateJwtWith2fa(user: UserWithoutSecret, isTwoFactorAuthenticated: boolean) {
		const payload = {
			id: user.id,
			isTwoFactorAuthenticated: isTwoFactorAuthenticated,
		};
	
		return this.jwtService.sign(payload);
	}

	async turnOff2fa(userId: number) {
		this.userService.updateUser(userId, {
			twoFactorAuthenticationSecret: '',
			isTwoFactorAuthenticationEnabled: false
		});
	}
	
}
