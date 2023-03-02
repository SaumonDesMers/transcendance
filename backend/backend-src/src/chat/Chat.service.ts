import { Injectable } from "@nestjs/common";
import { Prisma, Channel, ChatUser, Message } from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";

@Injectable()
export class ChatService {
	constructor(private channelRepository: ChannelRepository,
				private messageRepository: MessageRepository) {}

	async createGroupChannel()	{	
	}

	async createDMChannel() {

	}

	async sendMessage(params: {
		author: ChatUser;
		channel: Channel;
		content: string;}) {
		const {author, channel, content} = params;
		const message = await this.messageRepository.createMessage({
			content: content,
			channel: {
				connect: {id: channel.id}},
			author: {
				connect: {userId: author.userId}},
			},
			{channel: true, author: true},
		);

		return message;
	}

	async eraseMessage(params: {
		id: Message['id'];
	}) {
		const {id} = params;
		const message = await this.messageRepository.deleteMessage({
			where: {id}
		},
		{channel: true, author: {
			select: {
				user: {select: { username: true}}
			}
		}}
		)
	}

	async joinChannel()

	async leaveChannel()
}
