import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
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

	async getUsers() {
		const users = await this.repository.getUsers({});

		return users;
	}

	async getUserById(params: {id: User['id']})
	{
		const { id } = params;
		const user = await this.repository.getUserById({id});

		return user;
	}

	async getUserByEmail(params: {email: User['email']})
	{
		const { email } = params;
		const user = await this.repository.getUsers({
			where: {
				email: email,
			},
		});

		return user;
	}

	// async updateUser(params: {update: UserBis})
	// {
	// 	const { update } = params;

	// 	const user = await this.repository.updateUser({
	// 		where:
	// 	})
	// }
}
