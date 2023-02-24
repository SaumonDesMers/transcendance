import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserBisDto
{
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	email?: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	username?: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	password?: string;
}
