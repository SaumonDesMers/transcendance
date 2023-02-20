import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService, FortyTwoStrategy],
})
export class AuthModule {}
