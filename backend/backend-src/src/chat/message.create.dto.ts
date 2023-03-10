import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
	authorId: number;

	ChannelId: number;

	content: string;
}
