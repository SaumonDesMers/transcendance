import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { BroadcastService } from './broadcast.service'

@Module({
	imports: [AuthModule],
	controllers: [],
	providers: [GameGateway, GameService, BroadcastService]
})
export class GameModule {}
