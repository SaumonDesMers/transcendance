import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserBis } from "./userBis.model";
import { UserBisRepository } from "./userBis.repository";

@Injectable()
export class UserBisService {
	constructor(private repository: UserBisRepository) {}

	async createUser(params: {email: UserBis['email'];
	password: UserBis['password']; username: UserBis['username']}){
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

	async getUser() {
		const users = await this.repository.getUsers({});

		return users;
	}

	async getUserById(params: {id: UserBis['id']})
	{
		const { id } = params;
		const user = await this.repository.getUserById({id});

		return user;
	}

	async getUserByEmail(params: {email: UserBis['email']})
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
