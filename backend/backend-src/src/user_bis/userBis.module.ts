import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { UserBisRepository } from "./userBis.repository";
import { UserBisService } from "./userBis.service";

@Module({
	imports: [PrismaModule],
	providers: [UserBisRepository, UserBisService],
	exports: [UserBisService],
})
export class UserBisModule {}
