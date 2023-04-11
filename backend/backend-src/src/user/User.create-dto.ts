import { IsBoolean, IsNotEmpty, IsNumber, IsString, IS_ALPHA, MaxLength, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Coa } from "@prisma/client";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsBoolean()
	@IsNotEmpty()
	@ApiProperty()
	darkMode: boolean;

	@IsString()
	@MaxLength(200)
	@ApiProperty()
	bio: string;

	@IsEnum(Coa)
	@ApiProperty()
	coa: Coa;
}
