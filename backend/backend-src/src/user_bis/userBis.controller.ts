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
import { UserBisService } from "./userBis.service";
import { UserEntity } from "./userBis.entity";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreateUserBisDto } from "./userBis.create-dto";
import { UpdateUserBisDto } from "./userBis.update-dto";

@Controller('userBis')
@ApiTags('UserBis')
export class UserBisController {
	constructor(private userBisService: UserBisService) {}

	@Get()
	@ApiOkResponse({type: UserEntity, isArray: true})
	getUsers(): Promise<User[]> {
		return this.userBisService.getUsers();
	}

	@Post()
	@ApiOkResponse({type: UserEntity})
	createUser(@Body() UserCreate: CreateUserBisDto) : Promise<User> {
		return this.userBisService.createUser(UserCreate);
	}

	@Get(':id')
	@ApiOkResponse({type: UserEntity})
	getOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userBisService.getOneUser({id});
	}

	@Put(':id')
	@ApiOkResponse({type: UserEntity})
	async replaceUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: CreateUserBisDto) : Promise<User> {
		return this.userBisService.updateUser(id, UserUpdate);
	}

	@Patch(':id')
	@ApiOkResponse({type: UserEntity})
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() UserUpdate: UpdateUserBisDto) {
		return this.userBisService.updateUser(id, UserUpdate);
	}

	@Delete(':id')
	@ApiOkResponse({type: UserEntity})
	async removeUser(@Param('id', ParseIntPipe) id: number) {
		return this.userBisService.removeUser(id);
	}
}
