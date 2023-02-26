import { Controller,
		Body,
		Get,
		Param,
		Patch,
		Put,
		Post,
		Query,
		ParseIntPipe,
		Delete } from "@nestjs/common";
import { Prisma, Profile } from "@prisma/client";
import { ProfileService } from "./Profile.service";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreateProfileDto } from "./Profile.create-dto";
import { UpdateProfileDto } from "./Profile.update-dto";
import { get } from "http";

@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
	constructor(private profileService: ProfileService) {}

	@Get() //get all profiles
	getProfiles(): Promise<Profile[]> {
		return this.profileService.
	}

	@Get() // get only one profile

	@Post() // create a pofile

	@Patch() // update

	@Delete() 

		
}
