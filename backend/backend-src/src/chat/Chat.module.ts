import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { MessageRepository } from "./Message.repository";
import { Prisma,
		Message,
		Channel,
		ChatUser,
		GroupChannel,
		DMChannel } from "@prisma/client";

const messageWithAuthor = Prisma.validator<Prisma.MessageArgs>()({include: {author: true}});
const messageWithChannel = Prisma.validator<Prisma.MessageArgs>()({include: {channel: true}});
export type MessageWithAuthor = Prisma.MessageGetPayload<typeof messageWithAuthor>;
export type MessageWithChannel = Prisma.MessageGetPayload<typeof messageWithChannel>;
export type MessageWithAll = Prisma.MessageGetPayload<typeof messageWithChannel & typeof messageWithAuthor>;

@Module({
	imports: [PrismaModule],
	providers: [MessageRepository],
	exports: [],
})
export class MessageModule {}
