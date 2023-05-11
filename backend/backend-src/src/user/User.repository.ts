import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { defaultPicture } from "./User.module";

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
		const { data } = params;
		data.picture = defaultPicture;

		let user: User;
		try {
			user = await this.prisma.user.create({ data });
		} catch (e: any) {
			return this.prisma.user.update({
				where: {
					id:data.id
				},
				data
			});
		}

		await this.prisma.chatUser.create({
			data: {
				user: {
					connect : {id:params.data.id}
				},
			},
		});

		return user;
	}
	
	async getUsers(params: {
		skip?: number;
		take?: number;
		cursor? : Prisma.UserWhereUniqueInput;
		where? : Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithAggregationInput;
	}): Promise<User[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({skip, take, cursor, where, orderBy});
	}

	async getSingleUser(params: Prisma.UserWhereUniqueInput, include?: Prisma.UserInclude) : Promise<User> {
		return this.prisma.user.findUniqueOrThrow({
				where: params,
				include,
			}
		);
	}

	async getSingleUserWithProfile(params: Prisma.UserWhereUniqueInput) : Promise<User> {
		return this.prisma.user.findUniqueOrThrow({
			where:params,
		});
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<User> {
		const { where, data } = params;
		return this.prisma.user.update({where, data });
	}

	async deleteUser(params: {
		where: Prisma.UserWhereUniqueInput;
	}): Promise<User> {
		const { where } = params;
		return this.prisma.user.delete({ where });
	}
}
