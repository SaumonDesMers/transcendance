import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { MessageRepository } from "./Message.repository";
import { Prisma,
		Message,
		Channel,
		ChatUser,
		GroupChannel,
		DMChannel } from "@prisma/client";
import { ChatGateway } from "./Chat.gateway";
import { ChatService } from "./Chat.service";
import { ChannelRepository } from "./Channel.repository";
import { AuthModule } from "src/auth/auth.module";
import { Socket, Server } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./Chat.events";

const messageWithAuthor = Prisma.validator<Prisma.MessageArgs>()({include: {author: true}});
const messageWithChannel = Prisma.validator<Prisma.MessageArgs>()({include: {channel: true}});
export type MessageWithAuthor = Prisma.MessageGetPayload<typeof messageWithAuthor>;
export type MessageWithChannel = Prisma.MessageGetPayload<typeof messageWithChannel>;
export type MessageWithAll = Prisma.MessageGetPayload<typeof messageWithChannel & typeof messageWithAuthor>;


const dmChannelWithBase = Prisma.validator<Prisma.DMChannelArgs>()({include:{channel: true}});
const groupChannelWithBase = Prisma.validator<Prisma.GroupChannelArgs>()({include:{channel: true}});
export type DMChannelWithBase = Prisma.DMChannelGetPayload<typeof dmChannelWithBase>;
export type GroupChannelWithBase = Prisma.GroupChannelGetPayload<typeof groupChannelWithBase>;

const includeChannelUsers = Prisma.validator<Prisma.ChannelArgs>()({include: {users: true}});
const includeDMChannel = Prisma.validator<Prisma.DMChannelArgs>()({include: {channel: includeChannelUsers}});
const includeGroupChannel = Prisma.validator<Prisma.GroupChannelArgs>()({include: {channel: includeChannelUsers}});
export type DMChannelWithMembers = Prisma.DMChannelGetPayload<typeof includeDMChannel>
export type GroupChannelWithMembers = Prisma.GroupChannelGetPayload<typeof includeGroupChannel>


export type chatSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type chatServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
@Module({
	imports: [PrismaModule, AuthModule],
	providers: [MessageRepository, ChatService, ChannelRepository, ChatGateway],
	exports: [ChatService],
})
export class ChatModule {}
