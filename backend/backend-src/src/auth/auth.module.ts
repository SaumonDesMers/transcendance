import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/User.module';
import { FortyTwoStrategy } from './fortytwo/fortytwo.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Jwt2faStrategy } from './jwt-2fa/jwt-2fa.stategy'

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			secret: jwtConstants.secret,
      		// signOptions: { expiresIn: '60s' },
		})
	],
	controllers: [AuthController],
	providers: [AuthService, FortyTwoStrategy, JwtStrategy, Jwt2faStrategy],
	exports: [AuthService]
})
export class AuthModule {}
