import { Injectable } from "@nestjs/common";
import { Prisma, Channel, ChatUser, Message } from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";
import { CreateMessageDto } from "./message.create.dto";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { CreateDMChannelDto } from "./DMChannel.create.dto";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaService } from "src/database/prisma.service";
import { MuteDTO, adminRequestDTO } from "./Chat.events";

@Injectable()
export class ChatService {
	constructor(private channelRepository: ChannelRepository,
				private messageRepository: MessageRepository,
				private prisma: PrismaService) {}

	async createGroupChannel(newGroupChannel: CreateGroupChannelDto, include: Prisma.GroupChannelInclude) {
		//im sorry for these ugly things i dont know how to do this any other way
		let my_arr: Prisma.ChatUserWhereUniqueInput[];
		newGroupChannel.usersId.forEach(userId => my_arr.push({userId}));

		const channel = await this.channelRepository.createGroupChannel({
			owner: {
				connect: {
					userId: newGroupChannel.ownerId
				}
			},
			admins: {
				connect: {
					userId: newGroupChannel.ownerId
				}
			},
			channel: {
				create: {
					name: newGroupChannel.name,
					users: {
						connect: my_arr
					}
				}
			},
			
		}, include);

		return channel;
	}

	async createDMChannel(newDMChannel: CreateDMChannelDto) {
		let my_arr: Prisma.ChatUserWhereUniqueInput[];

		newDMChannel.usersId.forEach(userId => my_arr.push({userId}));

		const channel = await this.channelRepository.createDMChannel({
			channel: {
				create: {
					name: newDMChannel.name,
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

		//this prisma request 
		// - assigns message content
		// - connects to an existing channel using the channelId
		// - connects to its author using an userId
		// - assign creation date to current date
		//
		// includes the channel and author object in the returned object
		const message = await this.messageRepository.createMessage({
			content: newMessage.content,
			channel: {
				connect: {id: newMessage.ChannelId}},
			author: {
				connect: {userId: newMessage.authorId}},
			postedAt: new Date
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

		//this prisma request updates a group channel
		// -the group channel is found using its base channel's channelId

		// - it goes in its base channel
		// - requests an update of the base channel
		// - in the users fields and connects a new user

		//we include the members in the returned channel
		const update = await this.channelRepository.updateGroupChannel({
			where: {channelId:channelId},
			data: {
				channel: {
					update: {
						users: {
							connect: {userId:userId}
						}
					}
				}
			},
		}, true);

		return update;
	}

	async leaveChannel(channelId: number, userId: number) {

		//this prisma request is pretty similar to join channel
		
		//but instead of connecting a new user to the users field
		//we delete one
		const update = await this.channelRepository.updateGroupChannel({
			where:{channelId},
			data: {
				channel: {
					update: {
						users: {
							disconnect: {userId}
						}
					}
				}
			}
		}, true);

		return update;
	}

	// async leaveAllChannels(userId: number)
	// {
	// }

	async findChannelbyId(channelId: number)
	{
		const channel = await this.channelRepository.getSingleChannel({
			id:channelId
		});

		return channel;
	}

	async findChannelbyName(channelName: string)
	{
		const channel = await this.channelRepository.getSingleChannel({
			name: channelName
		});
		return channel;
	}

	async getChatUser(userId: number)
	{

		//this prisma request is weird i know
		//
		//it finds a chatUser using its corresponding userId
		//
		//it includes the joinedChannels in the return
		//	- in those joinedChannels it includes the users
		//		-in  those users in only selects the username and the userId
		//	- in those joinedChannels it includes the messages
		//		- in those messages it only selects the content and the author
		//		- it only takes the last 10 sent messages ordered by posted date
		const user = await this.prisma.chatUser.findUniqueOrThrow({
			include:
			{
				joinedChannels:
				{
					include:
					{
						users:
						{
							select:
							{
								user: {select: {username: true}},
								userId: true,
							}
						},
						messages:
						{
							select: {
								content: true,
								author: {
									select: {
										user: {select: {username: true}},
										userId: true,
									}
								}
							},
							orderBy: {
								postedAt : 'asc'
							},
							take: 10,
						}
					}
				}
			},
			where: {userId}
		});

		return user;
	}

	async setUserAdmin(
		request: adminRequestDTO
		)
	{
		// const groupChannel = this.channelRepository.getSingleGroupChannel({channelId:GroupChannelId}, true);

		//add logic here checking
		//that users are in channels and caller has the rights to add a new admin

		this.channelRepository.updateGroupChannel({
			where: {
				channelId:request.groupChannelId
			},
			data: {
				admins: {
					connect: {
						userId: request.targetUserId
					}
				}
			}
		}, false);
	}

	async unsetUserAdmin(
		request: adminRequestDTO
	)
	{
		// const groupChannel = this.channelRepository.getSingleGroupChannel({channelId:GroupChannelId}, true);

		//add logic here checking
		//that users are in channels and caller has the rights to remove an admin

		this.channelRepository.updateGroupChannel({
			where: {
				channelId:request.groupChannelId
			},
			data: {
				admins: {
					disconnect: {
						userId: request.targetUserId
					}
				}
			}
		}, false);
	}

	async muteUser(request: MuteDTO)
	{
		//add logic here checking admin rights from author 
		//and presence of target in channel
		//and target isnt admin or owner
		
		this.prisma.mute.create({
			data: {
				author: {
					connect: {userId:request.authorUserId}
				},
				target: {
					connect: {userId:request.targetUserId}
				},
				groupChannel: {
					connect: {channelId:request.groupChannelId}
				},
				endDate: request.endDate
			}
		});
	}
}
