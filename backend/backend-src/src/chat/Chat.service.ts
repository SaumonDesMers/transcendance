import { Injectable } from "@nestjs/common";
import { Prisma, Channel, ChatUser, Message } from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";

@Injectable()
export class ChatService {
	constructor(private channelRepository: ChannelRepository,
				private messageRepository: MessageRepository) {}

	async createGroupChannel()
	{
		
	}

	async createDMChannel()

	async sendMessage()

	async eraseMessage()

	async joinChannel()

	async leaveChannel()
}
