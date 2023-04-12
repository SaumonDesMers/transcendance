import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Coa } from "@prisma/client";

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
	
	@MaxLength(200)
	@IsOptional()
	@ApiProperty()
	bio?: string;

	@IsEnum(Coa)
	@IsOptional()
	@ApiProperty()
	coa?: Coa;
}
