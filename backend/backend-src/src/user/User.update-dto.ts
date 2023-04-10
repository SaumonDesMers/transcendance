import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto
{
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty()
	username?: string;

	@IsBoolean()
	@IsOptional()
	@ApiProperty()
	darkMode?: boolean;

	@IsString()
	@IsOptional()
	@ApiProperty()
	twoFactorAuthenticationSecret?: string;

	@IsBoolean()
	@IsOptional()
	@ApiProperty()
	isTwoFactorAuthenticationEnabled?: boolean;
}
