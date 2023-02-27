import { Controller,
		Body,
		Get,
		Param,
		Patch,
		Put,
		Post,
		Query,
		ParseIntPipe,
		Delete, 
		NotFoundException} from "@nestjs/common";
import { Prisma, Profile } from "@prisma/client";
import { ProfileService } from "./Profile.service";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreateProfileDto } from "./Profile.create-dto";
import { UpdateProfileDto } from "./Profile.update-dto";
import { get } from "http";
import { CreateTracingOptions } from "trace_events";
import { use } from "passport";
import { Public } from "src/auth/public.decorator";

@Public()
@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
	constructor(private profileService: ProfileService) {}

	@Get() //get all profiles
	async getProfiles(): Promise<Profile[]> {
		return this.profileService.getProfiles();
	}

	@Get(':id') // get only one profile
	async getOneProfile(@Param('id', ParseIntPipe) id: number) : Promise<Profile> {
		let profile: Profile;
		try {
			profile = await this.profileService.getOneProfile(id);
		}
		catch {
			throw new NotFoundException();
		}
		return profile;
	}

	@Post() // create a pofile
	async createProfile(@Body('userId', ParseIntPipe) userId: number, @Body('profile') profileDto: CreateProfileDto) : Promise<Profile> {
		return this.profileService.createProfile({userId, profileDto});
	}

	@Patch(':id') // update
	async updateProfile(@Param('id', ParseIntPipe) userId: number, @Body() ProfileUpdate: UpdateProfileDto) {
		return this.profileService.updateProfile(userId, ProfileUpdate);
	}

	@Delete(':id')
	async removeProfile(@Param('id', ParseIntPipe) id: number) {
		return this.profileService.removeProfile(id);
	}		
}
