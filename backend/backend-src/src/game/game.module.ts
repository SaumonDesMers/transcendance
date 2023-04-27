import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { BroadcastService } from './broadcast.service'
import { PrismaModule } from 'src/database/prisma.module';
import { QueueService } from './queue.service';

@Module({
	imports: [AuthModule, PrismaModule],
	controllers: [],
	providers: [GameGateway, GameService, BroadcastService, QueueService],
	exports: [GameService],
})
export class GameModule {}
