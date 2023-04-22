import { Injectable } from "@nestjs/common";
import { Prisma, Channel, ChatUser, Message, Mute, GroupChannel } from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";
import { MessageWithAll, MessageWithAuthor, MessageWithChannel } from "./Chat.module";
import { CreateMessageDto } from "./message.create.dto";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { CreateDMChannelDto } from "./DMChannel.create.dto";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaService } from "src/database/prisma.service";
import { MuteDTO, adminRequestDTO, DMRequestDTO, GroupChannelDTO, chanPrivateRequestDTO, ChanRequestDTO, basicChanRequestDTO, InviteRequestDTO, inviteUpdateDTO } from "./Chat.entities";
import { WsException } from "@nestjs/websockets";
import { error } from "console";
import { ValidationError } from "./Chat.error";
import { userInfo } from "os";


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

/**
 * The Chat Service is here to interface with the DB,
 * Fetch some data and modify it
 * 
 * It handles all the permissions logic and can throw a validationError exception
 * 
 * Every communications are handled in the gateway
 * 
 * PS:Calls to anything.repository are the same as prisma calls it's juste one more layer
 */

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
				key: newGroupChannel.key,
				privateChan: newGroupChannel.privateChan,
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
		const message = await this.prisma.message.create({
			data:
			{
			content: newMessage.content,
			channel: {
				connect: {id: newMessage.ChannelId}},
			author: {
				connect: {userId: newMessage.authorId}},
			postedAt: new Date
			},
			include: {
				channel: true,
				author: true
			},
		});

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

	async joinGroupChannel(channelId: number, userId: number, key? :string): Promise<GroupChannelDTO> {

		//might do checks that the user isnt banned
		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: {channelId},
			include: {
				banned: true,
				invited: true
			}
		})

		if (channel.banned.find(user => {
			return user.userId == userId;
		}) != null)
			throw new ValidationError("User is banned from this channel");

		if (channel.key != null && key != channel.key)
			throw new ValidationError("Incorrect or missing channel key");

		if (channel.privateChan == true && channel.invited.find(user =>
			{return user.userId == userId}) == undefined)
			throw new ValidationError("You have not been invited in this channel");

		//this prisma request updates a group channel
		// -the group channel is found using its base channel's channelId

		// - it goes in its base channel
		// - requests an update of the base channel
		// - in the users fields and connects a new user

		//remove user from invite list
		if (channel.privateChan == true)
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					invited: {
						disconnect: {userId}
					}
				}
			});

		//we include the members in the returned channel
		const update = await this.prisma.groupChannel.update({
			where: {channelId},
			data: {
				channel: {
					update: {
						users: {
							connect: {userId}
						},
					},
				},
			},
			include: {
				channel: includeMembersAndLast10Messages,
				admins: {include: {user: true}},
				owner: {include: {user:true }},
				invited: {include: {user:true}}
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

		
		const user = await this.prisma.chatUser.findUniqueOrThrow({
			where: {userId},
			include: {
				user: true,
				invites: true
			}
		});

		return user;
	}


	async getChatUserWithChannels(userId: number)
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
				owner: {include: {user:true }},
				invited: {include: {user:true}}
			}
		});

		return channels;
	}


	/************** CHANNEL OPERATIONS *******************/



	async setUserAdmin(
		request: ChanRequestDTO
		)
	{
		// const groupChannel = this.channelRepository.getSingleGroupChannel({channelId:GroupChannelId}, true);

		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: { 
				channelId:request.channelId
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
		if (this.isAdmin(request.authorUserId, channel) == false)
			throw new ValidationError("You don't have the rights to set an admin");

		//and presence of target in channel
		if (channel.channel.users.find(user => {
			user.userId == request.targetUserId;
		}) === undefined)
			throw new ValidationError("This user isn't on channel");

		//if we want to demote an admin
		if (request.action == false && channel.admins.find(user => {user.userId == request.targetUserId}) == undefined)
			throw new ValidationError("This user is not an admin");

		if (request.action)
		{
		this.channelRepository.updateGroupChannel({
			where: {
				channelId:request.channelId
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
		else {
		this.channelRepository.updateGroupChannel({
			where: {
				channelId:request.channelId
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

	async banUser(request: ChanRequestDTO) {

		const {authorUserId, targetUserId, channelId } = request;
		const channel = await this.prisma.groupChannel.findUnique({
			where: {
				channelId
			},
			include: {
				admins: true,
				banned: true
			}
		});


		if (request.action) { //banning the target

			if (!this.isAdmin(authorUserId, channel))
				throw new ValidationError("Permission denied, you cant ban another user");
			
			if (this.isAdmin(targetUserId, channel))
				throw new ValidationError("Permission denied, you cant ban another admin");
			
			//this prisma request updates an existing channel
			//first adding a new user in the banlist
			//and removing him from the members of the channel
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					banned: {
						connect: {
							userId:targetUserId
						}
					},
					channel: {
						update: {
							users: {
								disconnect: {
									userId: targetUserId
								}
							}
						}
					}
				}
			});
		}
		else { //unbanning the target
			if (this.isAdmin(authorUserId, channel) == false)
				throw new ValidationError("You are not Admin");
			
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					banned: {
						disconnect: {
							userId:targetUserId
						}
					}
				}
			});
				
		}
	}

	async set_chan_visibility(request: ChanRequestDTO)
	{
		const channel = await this.prisma.groupChannel.findUnique({
			where: {channelId:request.channelId},
			include: {
				admins: true
			}
		});

		if (!this.isAdmin(request.authorUserId, channel) != true)
			throw new ValidationError("You are not admin");

		await this.prisma.groupChannel.update({
			where: {channelId: request.channelId},
			data: {
				privateChan: request.action
			}
		});
	}

	async kickUser(request: basicChanRequestDTO) {

		const {channelId, authorUserId, targetUserId} = request;
		const channel = await this.prisma.groupChannel.findUnique({
			where: {
				channelId
			},
			include: {
				admins: true,
				channel: {
					include: {
						users:true
					}
				}
			}
		});


		if (!this.isAdmin(authorUserId, channel))
			throw new ValidationError("Permission denied, you cant kick another user");

		if (channel.channel.users.find(user =>
			{return user.userId == targetUserId}) == undefined)
			throw new ValidationError("Target is not in channel");

		// if (this.isAdmin(targetUserId, channel))
		// 	throw new ValidationError("Permission denied, you cant kick another admin");
		
		await this.leaveGroupChannel(channelId, targetUserId);
	}

	//in an invite request there is an username ( for ease of use, its better to remember usernames than userId :p)
	//so i need to return a InviteUpdate object with an userId since the rest of the codebase uses userIds
	async inviteUser(request: InviteRequestDTO) : Promise<inviteUpdateDTO>
	{
		const user = await this.prisma.user.findUniqueOrThrow({
			where: {
				username:request.targetUserName
			},
			include: {
				chatUser: true
			}
		});

		const targetUserId = user.id;
		

		const channel = await this.prisma.groupChannel.findUnique({
			where: {
				channelId:request.channelId
			},
			include: {
				admins: true,
				channel: {
					include: {
						users: true
					}
				},
				invited: true
			}
		});

		if (request.action == true) //if we want to invite someone
			{
			// if (channel.channel.users.find(user => 
			// 	{return user.userId == targetUserId}) != undefined)
			// 	throw new ValidationError("User is already on channel");
			
			if (channel.privateChan == true && !this.isAdmin(request.authorUserId, channel))
				throw new ValidationError("You need to be admin to invite in private chan")
			
			await this.prisma.groupChannel.update({
				where: {channelId:request.channelId},
				data: {
					invited: {
						connect: {userId:targetUserId}
					}
				}
			});
		}
		else { //if we want to uninvite someone
			if (this.isAdmin(request.authorUserId, channel) == false)
			throw new ValidationError("You must be Admin to uninvite someone");

		if (channel.invited.find(user =>
			{user.userId == targetUserId}) != undefined)
			throw new ValidationError("User is not invited !")

		await this.prisma.groupChannel.update({
			where:{channelId:request.channelId},
			data: {
				invited: {
					disconnect: {userId: targetUserId}
				}
			}
		});	
		}

		return  ({
			targetUserId:user.id,
			action:request.action,
			channelId:channel.channelId,
			channelName:channel.name
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

	isAdmin(userId: number, channel: GroupChannel & { admins: ChatUser[]})
	{
		return (channel.admins.find(user => 
			{return user.userId == userId;}) != undefined
			|| channel.ownerId == userId);
	}
}
