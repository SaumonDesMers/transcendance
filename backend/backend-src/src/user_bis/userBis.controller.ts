import { Body,
		Controller,
		Get,
		Param,
		Patch,
		Post,
		Query,
		ParseIntPipe} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { isNumberObject, isStringObject } from "util/types";
import { UserBisService } from "./userBis.service";
import { UserEntity } from "./userBis.entity";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";

@Controller('userBis')
@ApiTags('UserBis')
export class UserBisController {
	constructor(private userBisService: UserBisService) {}

	@Get()
	@ApiOkResponse({type: UserEntity, isArray: true})
	getUsers(): Promise<User[]> {
		return this.userBisService.getUsers();
	}

	@Get(':id')
	@ApiOkResponse({type: UserEntity})
	getOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userBisService.getOneUser({id});
	}

	@Patch(':id')
	@ApiOkResponse({type: UserEntity})
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: Prisma.UserUpdateInput) : Promise<User> {
		return this.userBisService.updateUser(id, UserUpdate);
	}
}
