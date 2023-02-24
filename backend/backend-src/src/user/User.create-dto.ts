import { IsNotEmpty, IsString, IS_ALPHA } from "class-validator";

export class CreateUserDto {
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
