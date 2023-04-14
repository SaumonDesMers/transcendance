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
		NotFoundException,
		Req} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { isNumberObject, isStringObject } from "util/types";
import { UserService } from "./User.service";
import { UserEntity } from "./User.entity";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreateUserDto } from "./User.create-dto";
import { UpdateUserDto } from "./User.update-dto";
import { UserWithoutSecret } from "./User.module";

@Controller('users')
@ApiTags('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@ApiOkResponse({type: UserEntity, isArray: true})
	async getUsers()  {
		return this.userService.getUsers();
	}

	@Post()
	@ApiOkResponse({type: UserEntity})
	async createUser(
		@Body() UserCreate: CreateUserDto,
		@Req() req: any) {
		return this.userService.createUser(UserCreate, parseInt(req.user.id));
	}

	@Get(':id')
	@ApiOkResponse({type: UserEntity})
	async getOneUser(@Param('id', ParseIntPipe) id: number){
		let user: any;
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
	async replaceUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: CreateUserDto) {
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
