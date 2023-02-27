import { Body,
		Controller,
		Get,
		Param,
		Patch,
		Put,
		Post,
		Query,
		ParseIntPipe,
		Delete} from "@nestjs/common";
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
	constructor(private userBisService: UserService) {}

	@Get()
	@ApiOkResponse({type: UserEntity, isArray: true})
	getUsers(): Promise<User[]> {
		return this.userBisService.getUsers();
	}

	@Post()
	@ApiOkResponse({type: UserEntity})
	createUser(@Body() UserCreate: CreateUserDto) : Promise<User> {
		return this.userBisService.createUser(UserCreate);
	}

	@Get(':id')
	@ApiOkResponse({type: UserEntity})
	getOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userBisService.getOneUser(id);
	}

	@Put(':id')
	@ApiOkResponse({type: UserEntity})
	async replaceUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: CreateUserDto) : Promise<User> {
		return this.userBisService.updateUser(id, UserUpdate);
	}

	@Patch(':id')
	@ApiOkResponse({type: UserEntity})
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: UpdateUserDto) {
		return this.userBisService.updateUser(id, UserUpdate);
	}

	@Delete(':id')
	@ApiOkResponse({type: UserEntity})
	async removeUser(@Param('id', ParseIntPipe) id: number) {
		return this.userBisService.removeUser(id);
	}
}
