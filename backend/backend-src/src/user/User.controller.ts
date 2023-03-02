import { Body,
		Controller,
		Get,
		Param,
		Patch,
		Put,
		Post,
		Query,
		ParseIntPipe,
		Delete,
		NotFoundException} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { isNumberObject, isStringObject } from "util/types";
import { UserService } from "./User.service";
import { UserEntity } from "./User.entity";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreateUserDto } from "./User.create-dto";
import { UpdateUserDto } from "./User.update-dto";

@Controller('users')
@ApiTags('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@ApiOkResponse({type: UserEntity, isArray: true})
	async getUsers(): Promise<User[]> {
		return this.userService.getUsers();
	}

	@Post()
	@ApiOkResponse({type: UserEntity})
	async createUser(@Body() UserCreate: CreateUserDto) : Promise<User> {
		return this.userService.createUser(UserCreate);
	}

	@Get(':id')
	@ApiOkResponse({type: UserEntity})
	async getOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
		let user: User;
		try {
			user = await this.userService.getOneUser(id);
		}
		catch {
			throw new NotFoundException();
		}

		return user;
	}

	@Put(':id')
	@ApiOkResponse({type: UserEntity})
	async replaceUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: CreateUserDto) : Promise<User> {
		return this.userService.updateUser(id, UserUpdate);
	}

	@Patch(':id')
	@ApiOkResponse({type: UserEntity})
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: UpdateUserDto) {
		return this.userService.updateUser(id, UserUpdate);
	}

	@Delete(':id')
	@ApiOkResponse({type: UserEntity})
	async removeUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.removeUser(id);
	}
}
