import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.model";

@Injectable()
export class UserService {
	users: User[] = [];

	async validateUser(profile): Promise<[any, any]> {
		// const user = await this.users.find(user => user.name = name);
		// return user;
		return [null, 'no error'];
	}

	addUser(name: string, email: string, password: string) {
		const userId = Math.random().toString();
		const newUser = new User(userId, name, email, password);
		this.users.push(newUser);
		return newUser;
	}

	getUsers(): User[] {
		return [...this.users];
	}

	getUser(userId: string): User {
		const index = this.findUserIndex(userId);
		return this.users[index];
	}

	updateUser(
		userId: string,
		name: string,
		email: string,
		password: string
	): User {
		const index = this.findUserIndex(userId);
		const user = this.users[index];
		if (name) {
			user.name = name;
		}
		if (email) {
			user.email = email;
		}
		if (password) {
			user.password = password;
		}
		return user;
	}

	deleteUser(userId: string) {
		const index = this.findUserIndex(userId);
		this.users.splice(index, 1);
	}

	private findUserIndex(userId: string): number {
		const index = this.users.findIndex(user => user.id === userId);
		if (index === -1) {
			throw new NotFoundException("User not found");
		}
		return index;
	}
}