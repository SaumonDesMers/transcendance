import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserRepository } from "./User.repository";
import { CreateUserDto } from "./User.create-dto";
import { UpdateUserDto } from "./User.update-dto";
import { UserWithoutSecret } from "./User.module";
import { UserEntity } from "./User.entity";

export function exclude<User, Key extends keyof User>(
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
	constructor(private repository: UserRepository) {}

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
		let usersWithoutSecret = new Array;
		users.forEach(user => {
			usersWithoutSecret.push(exclude(user, ['twoFactorAuthenticationSecret']));
		});
		return usersWithoutSecret;
	}

	async getOneUser(id: User['id'], includeFriends?: boolean): Promise<UserWithoutSecret> 
	{
		let user: User;

		if (includeFriends) {
			user = await this.repository.getSingleUser({id}, {
				following: {
					select: {
						id: true
					}
				}
			});
		} else {
			user = await this.repository.getSingleUser({id});
		}
		
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

		const userBis = exclude(user, ['twoFactorAuthenticationSecret']);

		return userBis;
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

	async addFriend(id: User['id'], friendUserName: string)
	{
		const friend = await this.repository.getSingleUser({
			username: friendUserName
		});

		const user = await this.repository.updateUser({
			where: {
				id,
			},
			data: {
				following: {
					connect: {id:friend.id}
				}
			}
		});

		return(friend.id);
	}

	async removeFriend(id: User['id'], friendId: number)
	{
		const user = await this.repository.updateUser({
			where: {
				id,
			},
			data: {
				following: {
					disconnect: {id:friendId}
				}
			}
		});

		return friendId;
	}
}
