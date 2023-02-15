import { Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserBisService } from "./userBis.service";

@Controller('userBis')
export class UserBisController {
	constructor(private userBisService: UserBisService) {}

	@Get()
	getUsers(): Promise<User[]> {
		return this.userBisService.getUsers();
	}

	@Get(':id')
	getOneUser(@Param() params): Promise<User> {
		return this.userBisService.getUserById(params.id);
	}

	// @Patch()
	// updateUser() : Promise<UserBis> {
	// 	return this.userBisService.
	// }
}
