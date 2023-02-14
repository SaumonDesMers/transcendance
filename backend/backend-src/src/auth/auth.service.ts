import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class AuthService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}
	
	requestAuth(code: number) {
		const uid: string = this.configService.get<string>('UID')
		const secretKey: string = this.configService.get<string>('SECRET_KEY')

		if (!uid || !secretKey) {
			console.error('Error loading credentials.')
			return {
				auth: false,
				error: 'There is a server side error with credentials.'
			}
		}

		return {
			auth: true
		}
	}
}
