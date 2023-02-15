import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserBisModule } from './user_bis/userBis.module';

@Module({
  imports: [ChatModule, AuthModule, ConfigModule.forRoot({ isGlobal:true }), UserBisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
