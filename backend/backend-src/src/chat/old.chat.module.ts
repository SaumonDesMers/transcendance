import { Module } from '@nestjs/common';
import { OldChatGateway } from './old.chat.gateway'

@Module({
	imports: [],
	controllers: [],
	providers: [OldChatGateway],
})
export class OldChatModule {}
