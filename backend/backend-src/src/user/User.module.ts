import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { UserRepository } from "./User.repository";
import { UserService } from "./User.service";
import { UserController } from "./User.controller";
import { Prisma } from "@prisma/client";

export type UserWithProfile = Prisma.UserGetPayload<{include: { profile: true}}>

@Module({
	imports: [PrismaModule],
	providers: [UserRepository, UserService],
	exports: [UserService],
	controllers: [UserController],
})
export class UserModule {}
