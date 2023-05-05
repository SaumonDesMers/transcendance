import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsEnum, ValidateIf, IsNotEmpty } from "class-validator";
import { ChanType } from "@prisma/client";

export class CreateGroupChannelDto {
	@IsInt()
	ownerId: number;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsArray()
	usersId: number[];

	@IsEnum(ChanType)
	type: ChanType;

	@ValidateIf(o => o.type === ChanType['KEY'])
	@IsString()
	@IsNotEmpty()
	key? :string;
}
