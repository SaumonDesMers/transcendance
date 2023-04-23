import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserRepository } from "./User.repository";
import { CreateUserDto } from "./User.create-dto";
import { UpdateUserDto } from "./User.update-dto";
import { UserWithoutSecret } from "./User.module";

function exclude<User, Key extends keyof User>(
	user: User,
	keys: Key[]
  ): Omit<User, Key>
{
	for (let key of keys) {
	  delete user[key];
	}
	return user;
}

@Injectable()
export class UserService {
	constructor(
		private repository: UserRepository) {}

	async createUser(createDto: CreateUserDto, id: number): Promise<UserWithoutSecret> {
		let params;

		params = createDto;
		params.id = id;
		const user = await this.repository.createUser({
			data : params
		});

		return exclude(user, ['twoFactorAuthenticationSecret']);
	}

	async getUsers() : Promise<UserWithoutSecret[]> {
		const users = await this.repository.getUsers({});
		let usersWithoutSecret: any = users;
		usersWithoutSecret.forEach(user => {
			user = exclude(user, ['twoFactorAuthenticationSecret'])
		});
		return usersWithoutSecret;
	}

	async getOneUser(id: User['id']): Promise<UserWithoutSecret> 
	{
		const user = await this.repository.getSingleUser({id});
		return exclude(user, ['twoFactorAuthenticationSecret']);
	}

	async getOneUserWithSecret(id: User['id'])
	{
		const user = await this.repository.getSingleUser({id});

		return user;
	}

	async updateUser(id : User['id'], data: UpdateUserDto): Promise<UserWithoutSecret> 
	{

		const user = await this.repository.updateUser({
			where: {
				id
			},
			data: data,
		});

		return exclude(user, ['twoFactorAuthenticationSecret']);
	}

	async removeUser(id : User['id']): Promise<UserWithoutSecret> 
	{
		const user = await this.repository.deleteUser({
			where: {
				id
			}
		});

		return exclude(user, ['twoFactorAuthenticationSecret']);
	}
}
