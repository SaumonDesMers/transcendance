import { Injectable } from "@nestjs/common";
import { Prisma, User, Profile } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UserWithProfile } from "./User.module";

const userProfile = Prisma.validator<Prisma.UserInclude>()({ profile:true })

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
		const { data } = params;
		return this.prisma.user.create({ data });
	}

	async getUsers(params: {
		skip?: number;
		take?: number;
		cursor? : Prisma.UserWhereUniqueInput;
		where? : Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({skip, take, cursor, where, orderBy});
	}

	async getSingleUser(params: Prisma.UserWhereUniqueInput) : Promise<User> {
		return this.prisma.user.findUniqueOrThrow({
				where: params
			}
		);
	}

	async getSingleUserWithProfile(params: Prisma.UserWhereUniqueInput) : Promise<UserWithProfile> {
		return this.prisma.user.findUniqueOrThrow({
			where:params,
			include: userProfile
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
