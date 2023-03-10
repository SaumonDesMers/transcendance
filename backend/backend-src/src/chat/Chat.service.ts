import { Injectable } from "@nestjs/common";
import { Prisma, Channel, ChatUser, Message } from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";
import { CreateMessageDto } from "./message.create.dto";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { CreateDMChannelDto } from "./DMChannel.create.dto";

@Injectable()
export class ChatService {
	constructor(private channelRepository: ChannelRepository,
				private messageRepository: MessageRepository) {}

	async createGroupChannel(newGroupChannel: CreateGroupChannelDto) {
		//im sorry for these ugly things i dont know how to do this any other way
		let my_arr: Prisma.ChatUserWhereUniqueInput[];
		newGroupChannel.usersId.forEach(userId => my_arr.push({userId}));

		const channel = await this.channelRepository.createGroupChannel({
			channel: {
				create: {
					users: {
						connect: my_arr
					}
				}
			}
		}, true);

		return channel;
	}

	async createDMChannel(newDMChannel: CreateDMChannelDto) {
		let my_arr: Prisma.ChatUserWhereUniqueInput[];

		newDMChannel.usersId.forEach(userId => my_arr.push({userId}));

		const channel = await this.channelRepository.createDMChannel({
			channel: {
				create: {
					users: {
						connect: my_arr
					}
				}
			}
		}, true);

		return channel;
	}

	async sendMessage(newMessage: CreateMessageDto) {

		//should do checks about mute in the future


		const message = await this.messageRepository.createMessage({
			content: newMessage.content,
			channel: {
				connect: {id: newMessage.ChannelId}},
			author: {
				connect: {userId: newMessage.authorId}},
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

	async joinChannel(channelId: number, userId: number) {


		//might do checks that the user isnt banned

		const update = await this.channelRepository.updateGroupChannel({
			where: {channelId},
			data: {
				channel: {
					update: {
						users: {
							delete:{userId}
						}
					}
				}

			}
		}, true);

		return update;
	}

	async leaveChannel(channelId: number, userId: number) {
		const update = await this.channelRepository.updateGroupChannel({
			where:{channelId},
			data: {
				channel: {
					update: {
						users: {
							delete: {userId}
						}
					}
				}
			}
		}, true);

		return update;
	}
}
