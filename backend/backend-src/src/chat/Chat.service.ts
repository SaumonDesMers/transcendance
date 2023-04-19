import { Injectable } from "@nestjs/common";
import { Prisma, Channel, ChatUser, Message, Mute } from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";
import { CreateMessageDto } from "./message.create.dto";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { CreateDMChannelDto } from "./DMChannel.create.dto";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaService } from "src/database/prisma.service";
import { MuteDTO, adminRequestDTO, DMRequestDTO, GroupChannelDTO } from "./Chat.entities";
import { WsException } from "@nestjs/websockets";
import { error } from "console";
import { ValidationError } from "./Chat.error";



const includeMembers = {
		include : {
			users : {
				include : {
				user: true
				}
			}
		}
};

const includeMembersAndLast10Messages = Prisma.validator<Prisma.ChannelArgs>()({
	include: {
		users: {
			include: {user: true}
		},
		messages: {
			orderBy: {postedAt: 'asc'},
			take: 10,
			include: {
				author: {
					include: {
						user: true
					}
				}
			}
		}
	},
});

// const includeGroupChannelDTO = Prisma.validator<Prisma.GroupChannelArgs>()({
// 	include: {
// 		channel: {
// 			include: {
// 				users: {include: { user: true}},
// 			}
// 		},
// 		owner: {
// 		}
// 	}
// })

@Injectable()
export class ChatService {
	constructor(private channelRepository: ChannelRepository,
				private messageRepository: MessageRepository,
				private prisma: PrismaService) {}

	async createGroupChannel(newGroupChannel: CreateGroupChannelDto, include: Prisma.GroupChannelInclude) {
		//im sorry for these ugly things i dont know how to do this any other way
		let my_arr: Prisma.ChatUserWhereUniqueInput[];
		newGroupChannel.usersId.forEach(userId => my_arr.push({userId}));

		const channel = await this.prisma.groupChannel.create({
			data: {
				name: newGroupChannel.name,
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
						users: {
							connect: my_arr
						}
					}
				},
			},
			include
		});

		return channel;
	}

	async createDMChannel(newDMChannel: CreateDMChannelDto) {
		let my_arr: Prisma.ChatUserWhereUniqueInput[];

		newDMChannel.usersId.forEach(userId => my_arr.push({userId}));

		const channel = await this.prisma.dMChannel.create({
			data: {
				channel: {
					create: {
						users: {
							connect: my_arr
						}
					}
				}
			},
			include: {
				channel: includeMembersAndLast10Messages
			}
		});

		return channel;
	}

	async startDM(request: DMRequestDTO)
	{

		//add a check to see if caller isnt blocked by targetUser

		//try to find an existing channel
		let channel = await this.prisma.dMChannel.findFirst({
			where: {
				channel: {
					users: {
						some: {
							userId: request.callerUserId
						},
					},
					AND: {users: {some: {
								userId: request.targetUserId
							}
						}
					}
				}
			},
			include: {channel: includeMembersAndLast10Messages}
		});

		//if no channel exists create one
		if (channel == undefined)
			channel = await this.createDMChannel({usersId: [request.callerUserId, request.targetUserId]});
		
		return channel;
	}

	async sendMessage(newMessage: CreateMessageDto) {

		//should do checks about mute in the future

		// is user muted
		if (await this.isMuted(newMessage.authorId, newMessage.ChannelId) == true)
			throw new ValidationError("The user is muted and can't send a message");


		
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
			{channel: true, author: {
				include: {
					user: true
				}
			}},
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

	async joinGroupChannel(channelId: number, userId: number) {


		//might do checks that the user isnt banned

		//this prisma request updates a group channel
		// -the group channel is found using its base channel's channelId

		// - it goes in its base channel
		// - requests an update of the base channel
		// - in the users fields and connects a new user

		//we include the members in the returned channel
		const update = await this.prisma.groupChannel.update({
			where: {channelId:channelId},
			data: {
				channel: {
					update: {
						users: {
							connect: {userId:userId}
						}
					}
				},
			},
			include: {
				channel: includeMembersAndLast10Messages,
				admins: {include: {user: true}},
				owner: {include: {user:true }}
			}
		});

		return update;
	}

	async leaveGroupChannel(channelId: number, userId: number) {

		//this prisma request is pretty similar to join channel
		
		//but instead of connecting a new user to the users field
		//we delete one
		console.log("userid %d leaveing channelid %d", userId, channelId);
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
		});

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

	async findGroupChannelbyName(channelName: string)
	{
		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: {
				name: channelName
			},
			// include: {
				// channel: includeMembers
			// }
		})
		return channel;
	}

	async findGroupChannelbyID(channelId: number)
	{
		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: {
			channelId:channelId
			}, include: {
			channel: { include:{
				users: {include: {
							user: true
						}}
				}}
			}
		});

		return channel;
	}

	async findDmChannelbyID(channelId: number)
	{
		const channel = await this.prisma.dMChannel.findUniqueOrThrow({
			where: {
			channelId:channelId
			}, include: {
			channel: { include:{
				users: {include: {
							user: true
						}}
				}}
			}
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
			where: {userId:userId}
		});

		return user;
	}

	async getUserGroupChannels(userId: number) : Promise<GroupChannelDTO[]>
	{
		const channels = this.prisma.groupChannel.findMany({
			where: {
				channel: {
					users: {
						some: {
							userId
						}
					}
				}
			},
			include:{
				channel: includeMembersAndLast10Messages,
				admins: {include: {user: true}},
				owner: {include: {user:true }}
			}
		});

		return channels;
	}

	async setUserAdmin(
		request: adminRequestDTO
		)
	{
		// const groupChannel = this.channelRepository.getSingleGroupChannel({channelId:GroupChannelId}, true);

		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: { 
				channelId:request.groupChannelId
			},
			include : {
				admins: true,
				owner:true,
				channel: {
					include: {
						users: true
				}
			}
		}
		});

		//add logic here checking
		
		//that users are in channels and caller has the rights (owner ou admin) to add a new admin, cf check du mute
		// throw error

		//if author isnt admin
		if (channel.admins.find(user => {
			user.userId == request.callerUserId;
		}) === undefined)
			throw new ValidationError("You don't have the rights to mute a user");

		//and presence of target in channel
		if (channel.channel.users.find(user => {
			user.userId == request.targetUserId;
		}) === undefined)
			throw new ValidationError("This user isn't on channel");
		
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
		});
	}

	async unsetUserAdmin(
		request: adminRequestDTO
	)
	{
		// const groupChannel = this.channelRepository.getSingleGroupChannel({channelId:GroupChannelId}, true);
		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: { 
				channelId:request.groupChannelId
			},
			include : {
				admins: true,
				owner:true,
				channel: {
					include: {
						users: true
				}
			}
		}
		});

		//add logic here checking
		//that users are in channels and caller has the rights to remove an admin
		
		//if author isnt admin
		if (channel.admins.find(user => {
			user.userId == request.callerUserId;
		}) === undefined)
		throw new ValidationError("You don't have the rights to mute a user");

		//and presence of target in channel
		if (channel.channel.users.find(user => {
			user.userId == request.targetUserId;
		}) === undefined)
			throw new ValidationError("This user isn't on channel");

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
		});
	}

	async muteUser(request: MuteDTO)
	{
		//add logic here checking admin rights from author

		// does the channel exist?
		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: { 
				channelId:request.groupChannelId
			},
			include : {
				admins: true,
				channel: {
					include: {
						users: true
				}
			}
		}
		});

		// if target is owner
		if (channel.ownerId == request.targetUserId)
			throw new ValidationError("The owner can't be mute");

		//if author isnt admin
		if (channel.admins.find(user => {
			user.userId == request.authorUserId;
		}) === undefined)
			throw new ValidationError("You don't have the rights to mute a user");

		//and presence of target in channel
		if (channel.channel.users.find(user => {
			user.userId == request.targetUserId;
		}) === undefined)
			throw new ValidationError("This user isn't on channel");
		
		await this.prisma.mute.create({
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

	/**
	 * @returns `true` if user is currently muted in the channel defined in the args
	 * `false` otherwise
	 */
	async isMuted(userId: number, groupChannelId: number) : Promise<boolean>
	{
		//mutes in our chat have a special way of working

		//when a mute is issued it is stored in the db with its end date
		//when we want to check if someone is muted,
		//we select every mute that concerns a user in a given channel
		//order them so that the mute that ends the furthest in the future is first
		//take the first one and compare its end Date with now,
		//if end Date is more in the future than now, user is still muted

		let mute: Mute;
		try {
			mute = await this.prisma.mute.findFirstOrThrow({
				where: {
					targetId: userId,
					groupChannelId: groupChannelId
				},
				orderBy: {
					endDate: 'desc'
				},
			});
		} catch (e) {
			console.log(e)
			return false;
		}

		//"bigger" date means more in the future ( since date are stored as ms since EPOCH :p )
		if (mute.endDate.getTime() > Date.now())
			return true;
		return false;
	}

	/**
	 * @returns `true` if caller is blocked by target
	 * 	`false` otherwise
	 */
	async isBlocked(callerUserId: number, targetUserId: number) : Promise<boolean>
	{
		let user = await this.prisma.chatUser.findUnique({
				where: {
					userId:callerUserId
				},
				include: {
					blockedBy : true
				}
			});
		
		if (user == null || user === undefined)
			return false;
		
		for (let index = 0; index < user.blockedBy.length; index++) {
			if (targetUserId == user.blockedBy[index].userId)
				return true;
		}
		return false;
	}
}
