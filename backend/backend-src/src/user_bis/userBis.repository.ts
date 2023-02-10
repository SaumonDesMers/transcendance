import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UserBis } from "./userBis.model";

@Injectable()
export class UserBisRepository {
	constructor(private prisma: PrismaService) {}

	async createUser(params: { data: Prisma.UserCreateInput }): Promise<UserBis> {
		const { data } = params;
		return this.prisma.user.create({ data });
	}

	async getUsers(params: {
		skip?: number;
		take?: number;
		cursor? : Prisma.UserWhereUniqueInput;
		where? : Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<UserBis[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({skip, take, cursor, where, orderBy});
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<UserBis> {
		const { where, data } = params;
		return this.prisma.user.update({where, data });
	}

	async deleteUser(params: {
		where: Prisma.UserWhereUniqueInput;
	}): Promise<UserBis> {
		const { where } = params;
		return this.prisma.user.delete({ where });
	}
}
