import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/User.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import { Jwt2faAuthGuard } from './auth/jwt-2fa/jwt-2fa.guard';
import { GameModule } from './game/game.module';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from './chat/Chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),
		UserModule,
		GameModule,
		ChatModule,
		MulterModule.register({
			dest: './images',
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'pictures'),
		  }),

	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: Jwt2faAuthGuard,
		}
	],
})
export class AppModule {}
