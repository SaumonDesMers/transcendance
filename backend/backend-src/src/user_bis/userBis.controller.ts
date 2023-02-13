import { Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserBis } from "./userBis.model";
import { UserBisService } from "./userBis.service";

@Controller('userBis')
export class UserBisController {
	constructor(private userBisService: UserBisService) {}

	@Get()
	getUsers(): Promise<UserBis[]> {
		return this.userBisService.getUser();
	}

	@Get(':id')
	getOneUser(@Param() params): Promise<UserBis> {
		return this.userBisService.getUserById(params.id);
	}

	// @Patch()
	// updateUser() : Promise<UserBis> {
	// 	return this.userBisService.
	// }
}
