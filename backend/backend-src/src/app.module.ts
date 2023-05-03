import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/User.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { Jwt2faAuthGuard } from './auth/jwt-2fa/jwt-2fa.guard';
import { GameModule } from './game/game.module';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from './chat/Chat.module';
import { StatusModule } from './status/status.module'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),
		UserModule,
		GameModule,
		ChatModule,
		StatusModule,
		MulterModule.register({
			dest: './images',
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'pictures'),
		  }),
		EventEmitterModule.forRoot({
			// set this to `true` to use wildcards
			wildcard: false,
			// the delimiter used to segment namespaces
			delimiter: '.',
			// set this to `true` if you want to emit the newListener event
			newListener: false,
			// set this to `true` if you want to emit the removeListener event
			removeListener: false,
			// the maximum amount of listeners that can be assigned to an event
			maxListeners: 10,
			// show event name in memory leak message when more than maximum amount of listeners is assigned
			verboseMemoryLeak: false,
			// disable throwing uncaughtException if an error event is emitted and it has no listeners
			ignoreErrors: false,
		  })
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
