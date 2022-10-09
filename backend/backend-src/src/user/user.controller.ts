import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

	@Post()
	addUser(
		@Body('name') name: string,
		@Body('email') email: string,
		@Body('password') password: string
	) {
		return this.UserService.addUser(name, email, password);
	}

	@Get()
	getUsers() {
		return this.UserService.getUsers();
	}

	@Get(':id')
	getUser(@Param('id') userId: string) {
		return this.UserService.getUser(userId);
	}

	@Patch(':id')
	updateUser(
		@Param('id') userId: string,
		@Body('name') name: string,
		@Body('email') email: string,
		@Body('password') password: string
	) {
		return this.UserService.updateUser(userId, name, email, password);
	}

	@Delete(':id')
	deleteUser(@Param('id') userId: string) {
		return this.UserService.deleteUser(userId);
	}
}