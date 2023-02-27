import { IsNotEmpty, IsNumber, IsString, IS_ALPHA } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	id: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;
}
