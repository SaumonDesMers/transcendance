import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { ProfileRepository } from "./Profile.repository";
import { ProfileService } from "./Profile.service";
import { ProfileController } from "./Profile.controller";
import { Prisma, Profile } from "@prisma/client";

export type ProfileWithUser = Prisma.ProfileGetPayload<{include: {user}}>;

@Module({
	imports: [PrismaModule],
	providers: [ProfileRepository, ProfileService],
	exports: [ProfileService],
	controllers: [ProfileController],
})
export class ProfileModule {}
