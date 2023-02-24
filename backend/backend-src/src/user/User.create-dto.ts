import { IsNotEmpty, IsNumber, IsString, IS_ALPHA } from "class-validator";

export class CreateUserDto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsString()
	@IsNotEmpty()
	username: string;
}
