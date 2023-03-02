import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProfileDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;
}
