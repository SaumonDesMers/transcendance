import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserRepository } from "./User.repository";
import { CreateUserDto } from "./User.create-dto";
import { UpdateUserDto } from "./User.update-dto";


@Injectable()
export class UserService {
	constructor(private repository: UserRepository) {}

	async createUser(createDto: CreateUserDto){

		const user = await this.repository.createUser({
			data: createDto
		});

		return user;
	}

	async getUsers() : Promise<User[]> {
		const users = await this.repository.getUsers({});

		return users;
	}

	async getOneUser(id: User['id']) : Promise<User>
	{
		const user = await this.repository.getSingleUser({id});
		return user;
	}

	async getOneUserWithProfile(id: User['id']) : Promise<User>
	{
		const user = await this.repository.getSingleUserWithProfile({id});

		return user;
	}

	async updateUser(id : User['id'], data: UpdateUserDto) : Promise<User>
	{

		const user = await this.repository.updateUser({
			where: {
				id
			},
			data: data,
		});

		return user;
	}

	async removeUser(id : User['id']) : Promise<User>
	{
		const user = this.repository.deleteUser({
			where: {
				id
			}
		});

		return user;
	}
}
