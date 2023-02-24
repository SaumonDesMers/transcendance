import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { ProfileRepository } from "./Profile.repository";
import { Prisma, Profile } from "@prisma/client";

export type ProfileWithUser = Prisma.ProfileGetPayload<{include: {user}}>;

@Module({
	imports: [PrismaModule],
	providers: [ProfileRepository],
	exports: [],
})
export class ProfileModule {}
