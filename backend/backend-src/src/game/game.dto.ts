import { IsNotEmpty, IsString } from "class-validator";

export class updateQueueDto {

	@IsString()
	@IsNotEmpty()
	value: string;

	@IsString()
	type: string;
}
