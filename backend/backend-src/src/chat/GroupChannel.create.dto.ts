import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateGroupChannelDto {
	@IsInt()
	ownerId: number;

	@IsString()
	name: string;

	@IsArray()
	@IsInt()
	usersId: number[];

	@IsBoolean()
	privateChan: boolean;

	@IsOptional()
	key? :string;
}
