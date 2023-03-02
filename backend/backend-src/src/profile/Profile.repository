import { Injectable } from "@nestjs/common";
import { Prisma, User, Profile } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { ProfileWithUser } from "./Profile.module";

const profileUser = Prisma.validator<Prisma.ProfileInclude>()({user: true});

@Injectable()
export class ProfileRepository {
	constructor(private prisma: PrismaService) {}

	async createProfile(params: Prisma.ProfileCreateInput) : Promise<ProfileWithUser> {
		return this.prisma.profile.create({
			include: {user:true},
			data: params,
		});
	}

	async getProfiles(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.ProfileWhereUniqueInput;
		where?: Prisma.ProfileWhereInput;
		orderBy?: Prisma.ProfileOrderByWithRelationInput;
	}) : Promise<Profile[]> {
		const {skip, take, cursor, where, orderBy } = params;
		return this.prisma.profile.findMany({skip, take, cursor, where, orderBy});
	}

	async getSingleProfile(params: Prisma.ProfileWhereUniqueInput) : Promise<Profile> {
		return this.prisma.profile.findUniqueOrThrow({
			where: params
		});
	}

	async getSingleProfileWithUser(params: Prisma.ProfileWhereUniqueInput) : Promise<ProfileWithUser> {
		return this.prisma.profile.findUniqueOrThrow({
			where:params,
			include: profileUser
		});
	}

	async updateProfile(params: {
		where: Prisma.ProfileWhereUniqueInput;
		data: Prisma.ProfileUpdateInput;
	}) : Promise<Profile> {
		const { where, data } = params;
		return this.prisma.profile.update({where, data});
	}

	async deleteProfile(params: {
		where: Prisma.ProfileWhereUniqueInput;
	}) : Promise<Profile> {
		const { where } = params;
		return this.prisma.profile.delete({where});
	}
}
