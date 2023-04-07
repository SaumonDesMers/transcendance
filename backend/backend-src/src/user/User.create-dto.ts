import { IsBoolean, IsNotEmpty, IsNumber, IsString, IS_ALPHA } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsBoolean()
	@IsNotEmpty()
	@ApiProperty()
	darkMode: boolean;
}
