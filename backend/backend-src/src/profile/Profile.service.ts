import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, Profile } from "@prisma/client";
import { ProfileWithUser } from "./Profile.module";
import { ProfileRepository } from "./Profile.repository";
import { CreateProfileDto } from "./Profile.create-dto";
import { UpdateProfileDto } from "./Profile.update-dto";

@Injectable()
export class ProfileService {
	constructor(private repository: ProfileRepository) {}

	async createProfile(params: {userId: number; profileDto: CreateProfileDto})
	: Promise<ProfileWithUser> {
		const {userId, profileDto } = params;
		const profile = await this.repository.createProfile({
			user: { connect: {id: userId}},
			username: profileDto.username
		});

		return profile;
	}

	async getProfiles() : Promise<Profile[]> {
		const profiles = await this.repository.getProfiles({});

		return profiles;
	}

	async getOneProfile(userId: Profile['userId']) : Promise<Profile> {
		const profile = await this.repository.getSingleProfile({userId});

		return profile;
	}

	async getOneProfileWithUser(userId: Profile['userId']) : Promise<ProfileWithUser> {
		const profile = await this.repository.getSingleProfileWithUser({userId})

		return profile;
	}

	async updateProfile(userId: Profile['userId'], data: UpdateProfileDto) : Promise<Profile> {
		const profile = await this.repository.updateProfile({
			where: {
				userId
			},
			data: data,
		});

		return profile;
	}

	async removeProfile(userId: Profile['userId']) : Promise<Profile> {
		const profile = this.repository.deleteProfile({
			where: {
				userId
			}
		});

		return profile;
	}
}
