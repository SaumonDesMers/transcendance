import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { StatusGateway } from './status.gateway'

@Module({
	imports: [AuthModule],
	controllers: [],
	providers: [StatusGateway],
	exports: [],
})
export class StatusModule {}
