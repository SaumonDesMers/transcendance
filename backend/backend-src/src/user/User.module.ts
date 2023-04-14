import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { UserRepository } from "./User.repository";
import { UserService } from "./User.service";
import { UserController } from "./User.controller";
import { Prisma, User } from "@prisma/client";

export type UserWithoutSecret = Omit<User, "twoFactorAuthenticationSecret">
@Module({
	imports: [PrismaModule],
	providers: [UserRepository, UserService],
	exports: [UserService],
	controllers: [UserController],
})
export class UserModule {}

