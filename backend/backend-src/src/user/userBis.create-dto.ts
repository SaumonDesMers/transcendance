import { IsNotEmpty, IsString, IS_ALPHA } from "class-validator";

export class CreateUserBisDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
