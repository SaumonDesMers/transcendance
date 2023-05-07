import { IsNotEmpty, IsString } from "class-validator";

export class twoFactorAuthenticationDto {
	
	@IsString()
	@IsNotEmpty()
	code: string;
}