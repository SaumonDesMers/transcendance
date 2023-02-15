import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserBisRepository } from "./userBis.repository";

@Injectable()
export class UserBisService {
	constructor(private repository: UserBisRepository) {}

	async createUser(params: {email: User['email'];
	password: User['password']; username: User['username']}){
		const { email, password, username } = params;

		const user = await this.repository.createUser({
			data: {
				username,
				password,
				email
			}
		});

		return user;
	}

	async getUsers() : Promise<User[]> {
		const users = await this.repository.getUsers({});

		return users;
	}

	async getOneUser(params: Prisma.UserWhereUniqueInput) : Promise<User>
	{
		const user = await this.repository.getSingleUser(params);

		return user;
	}

	// async getUserByEmail(params: {email: User['email']})
	// {
	// 	const { email } = params;
	// 	const user = await this.repository.getUsers({
	// 		where: {
	// 			email: email,
	// 		},
	// 	});

	// 	return user;
	// }

	async updateUser(id : User['id'], data: Prisma.UserUpdateInput) : Promise<User>
	{

		const user = await this.repository.updateUser({
			where: {
				id
			},
			data: data,
		});

		return user;
	}
}
