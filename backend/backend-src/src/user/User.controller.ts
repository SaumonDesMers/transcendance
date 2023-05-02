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
		Req,
		UseInterceptors,
		UploadedFile,
		HttpException,
		HttpStatus} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { isNumberObject, isStringObject } from "util/types";
import { UserService } from "./User.service";
import { UserEntity } from "./User.entity";
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiParam, ApiBody, ApiConsumes, ApiResponse, ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./User.create-dto";
import { UpdateUserDto } from "./User.update-dto";
import { UserWithoutSecret } from "./User.module";
import { FileInterceptor } from "@nestjs/platform-express";
import { use } from "passport";
import { extname, join } from "path";
import { Request } from "express";
import { diskStorage } from "multer";
import { imageFileFilter, randomFileName, userPicturename } from './image_utils'
import { Public } from "src/auth/public.decorator";
import { unlink } from "fs";

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

	
	@Put(':id/image')
	@ApiCreatedResponse({type: UserEntity})
	@UseInterceptors(
		FileInterceptor('image', {
			storage:diskStorage({
				destination: './pictures',
				filename: userPicturename
			}),
			fileFilter: imageFileFilter
		})
		)
	async putImage(
		@Param('id', ParseIntPipe) id: number,
		@Req() req,
		@UploadedFile() file: Express.Multer.File
		)
		{

		if (id != req.user.id)
		throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
		
		const user = await this.userService.getOneUser(id);

		user.picture = file.filename;
		await this.userService.updateUser(id, user);
		return user;
	}
	
	@Delete(':id/image')
	@ApiCreatedResponse({type: UserEntity})
	async deleteImage(
		@Param('id', ParseIntPipe) id: number,
		@Req() req,
	)
	{

		if (id != req.user.id)
			throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
			
			const user = await this.userService.getOneUser(id);
			
		unlink(join("./pictures", user.picture), (err) => {
			if (err)
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
		})
		user.picture = null;
		await this.userService.updateUser(id, user);
		return user;
	}

	@ApiBody({
		description: "Username of the friend you want to add",
	})
	@ApiCreatedResponse({
		description: "Id of the added friend",
		type: Number
	})
	@Post(':id/friend')
	async addFriend(
		@Param('id', ParseIntPipe) id:number,
		@Body('friendUserName') friendUserName: string,
		@Req() req,
	)
	{

		if (id != req.user.id)
			throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

		const ret = await this.userService.addFriend(id, friendUserName);

		return ret;
	}

	@ApiBody({
		description: "id of the friend you want to remove",
	})
	@ApiOkResponse({})
	@Delete(":id/friend")
	async removeFriend(
		@Param('id', ParseIntPipe) id: number,
		@Body('friendId', ParseIntPipe) friendId: number,
		@Req() req
	)
	{
		if (id != req.user.id)
			throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

		await this.userService.removeFriend(id, friendId);
	}
}
