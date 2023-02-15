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

@Controller('userBis')
export class UserBisController {
	constructor(private userBisService: UserBisService) {}

	@Get()
	getUsers(): Promise<User[]> {
		return this.userBisService.getUsers();
	}

	@Get(':id')
	getOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userBisService.getOneUser({id});
	}

	@Patch(':id')
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: Prisma.UserUpdateInput) : Promise<User> {
		return this.userBisService.updateUser(id, UserUpdate);
	}
}
