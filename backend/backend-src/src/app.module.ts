import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/User.module';
import { OldChatModule } from './chat/old.chat.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';

@Module({
	imports: [
		OldChatModule,
		AuthModule,
		ConfigModule.forRoot({
			envFilePath: ['.env', '.env.ft_app'],
			isGlobal: true
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		}
	],
})
export class AppModule {}
