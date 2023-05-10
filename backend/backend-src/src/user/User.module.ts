import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { UserRepository } from "./User.repository";
import { UserService } from "./User.service";
import { UserController } from "./User.controller";
import { GameStatController } from "./User.stats.controller";
import { Prisma, User } from "@prisma/client";

export type UserWithoutSecret = Omit<User, "twoFactorAuthenticationSecret">

export const defaultPicture = 'default.png'
@Module({
	imports: [PrismaModule],
	providers: [UserRepository, UserService],
	exports: [UserService],
	controllers: [UserController, GameStatController],
})
export class UserModule {}

