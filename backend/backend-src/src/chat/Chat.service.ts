import { Injectable } from "@nestjs/common";
import {
	Prisma,
	Channel,
	ChatUser,
	Message,
	Mute,
	GroupChannel,
	ChanType, 
	User,
	inviteStatus} from "@prisma/client";
import { MessageRepository } from "./Message.repository";
import { ChannelRepository } from "./Channel.repository";
import {
	GroupChannelWithMembers,
	MessageWithAll,
	MessageWithAuthor,
	MessageWithChannel,
	includeAllGroupChannel,
	saltRounds } from "./Chat.module";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { CreateDMChannelDto } from "./DMChannel.create.dto";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaService } from "src/database/prisma.service";
import {
	MuteDTO,
	DMRequestDTO,
	GroupChannelDTO,
	ChanRequestDTO,
	basicChanRequestDTO,
	inviteUpdateDTO,
	ChanTypeRequestDTO,
	GroupChannelSnippetDTO,
	ChanKeyRequestDTO,
	CreateMessageDto,
	MessageDTO,
	SimpleChatUserDTO,
	ChanNotifDTO, 
	ChatUserDTO,
	DMChannelDTO,
	searchQueryDTO,
	gameType} from "./Chat.entities";
import { WsException } from "@nestjs/websockets";
import { error } from "console";
import { ValidationError } from "./Chat.error";
import { type, userInfo } from "os";
import { GameService } from "src/game/game.service";
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';


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
			select: {
				userId: true
			}
		},
		messages: {
			orderBy: {postedAt: 'asc'},
			take: 10,
			include: {
				author: true,
				gameInvite: true
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
				private gameService: GameService,
				private prisma: PrismaService)
	{
		this.prisma.invite.updateMany({
			data: {
				status: inviteStatus.EXPIRED
			}
		}).then(() => {});
	}

	async createGroupChannel(newGroupChannel: CreateGroupChannelDto): Promise<GroupChannelDTO> {
		//im sorry for these ugly things i dont know how to do this any other way
		let my_arr: Prisma.ChatUserWhereUniqueInput[] = new Array();
		let new_key: string;
		newGroupChannel.usersId.forEach(userId => my_arr.push({userId}));
		my_arr.push({userId:newGroupChannel.ownerId});

		if (newGroupChannel.type == 'KEY')
		{
			new_key = await bcrypt.hash(newGroupChannel.key, saltRounds);
		}
		
		let channel: GroupChannelDTO;

		try {
		channel = await this.prisma.groupChannel.create({
			data: {
				name: newGroupChannel.name,
				key: new_key,
				type: newGroupChannel.type,
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
			include: includeAllGroupChannel.include
		});
		} catch (e: any) {
			throw new ValidationError("Chan creation error, try different channel name");
		}

		return channel;
	}

	async createDMChannel(usersIds: number[]) {

		let my_arr: Prisma.ChatUserWhereUniqueInput[] = new Array<Prisma.ChatUserWhereUniqueInput>;

		console.log("creating dm channel");
		console.log(usersIds);

		usersIds.forEach(userId => my_arr.push({userId}));

		const channel = await this.prisma.dMChannel.create({
			data: {
				channel: {
					create: {
						users: {
							connect: my_arr
						}
					}
				},
			},
			include: {
				channel: includeMembersAndLast10Messages
			}
		});

		return channel;
	}

	async startDM(callerUserId: number, targetUserName: string)
	{

		//add a check to see if caller isnt blocked by targetUser

		let user: any;
		let channel: DMChannelDTO;

		try {
			user = await this.prisma.user.findUniqueOrThrow({ where: {username: targetUserName}, include: {
				chatUser: {
					include: {
						blocked: true,
						blockedBy: true,
					}
				}
			}});
		} catch (e: any) {
			throw new ValidationError("Target User not found");
		}

		if (user.chatUser.blocked.find(chatuser => {
			return chatuser.userId == callerUserId
		}) != undefined)
			throw new ValidationError("Cannot start DM, this user has blocked you");
		
		if (user.chatUser.blockedBy.find(chatuser => {
			return chatuser.userId == callerUserId
		}) != undefined)
			throw new ValidationError("Cannot start DM, you have blocked this user");

		if (user.id == callerUserId)
		{
			channel = await this.prisma.dMChannel.findFirst({
				where: {
					channel: {
						AND: [
							{
							users: {
								every: {
									userId:callerUserId
								}
							}
							},
							{
								NOT: {
									users: {
										none :{}
									}
								}
							}
						]
					}
				},
				include: {channel: includeMembersAndLast10Messages}
			});
			console.log("callerId: %d, found solo channel:", callerUserId, channel);
		} else {
			//try to find an existing channel
			channel = await this.prisma.dMChannel.findFirst({
				where: {
					channel: {
						AND: [
							{
								users: { some: {
									userId: user.id
								}}
							},
							{
								users: { some: {
									userId: callerUserId
								}}
							}					
						],
					},
				},
				include: {channel: includeMembersAndLast10Messages}
			});
		}

		//if no channel exists create one
		if (channel == undefined)
		{
			console.log("awaiting dm channel creation");
			return this.createDMChannel([callerUserId, user.id]);
		}
		
		return channel;
	}

	async sendMessage(newMessage: CreateMessageDto, invite?: Prisma.inviteCreateWithoutBaseMsgInput) {
		// is user muted
		if (await this.isMuted(newMessage.authorId, newMessage.ChannelId) == true)
			throw new ValidationError("You are muted and can't send a message, try again later");
		
		const channel = await this.prisma.channel.findUnique({
			where: {
				id:newMessage.ChannelId
			},
			include: {
				users:true
			}
		});

		if (channel == null)
			throw new ValidationError("This channel doesnt exist");
		//if user isnt on channel
		if (channel.users.find(user => {
			return user.userId == newMessage.authorId;
		}) == undefined)
			throw new ValidationError("You are not on this channel")		

			//this prisma request 
			// - assigns message content
		// - connects to an existing channel using the channelId
		// - connects to its author using an userId
		// - assign creation date to current date
		//
		// includes the channel and author object in the returned object
		let message: MessageDTO = await this.prisma.message.create({
			data:
			{
				content: newMessage.content,
				channel: {
					connect: {id: newMessage.ChannelId}},
				author: {
					connect: {userId: newMessage.authorId}},
				postedAt: new Date,
				gameInvite: invite != undefined ? {
					create: invite
				} : {}
			},
			include: {
				channel: true,
				author: true,
				gameInvite: true
			},
		});
		
		//if the user wants to embed a game invite in the message
		
		
		return message;
	}
	
	async eraseMessage(id: number) {
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
	
	async createGameInvite(newInvite: CreateMessageDto, sessionId: string) {
		
		// if (await this.isMuted(newInvite.authorId, newInvite.ChannelId) == true)
		// 	throw new ValidationError("The user is muted and can't send a message");
		
		// if (newInvite.gameInvite == undefined)
		// 	throw new ValidationError("Invalid Invite message");
		
		
		// INSERT GAME BACK CALL TO GENERATE UID HERE
		const type = newInvite.gameInvite.gameType == gameType.CUSTOM ? 'CUSTOM' : 'NORMAL';
		const { success, error, uid } = await this.gameService.createUniqueQueue(type, sessionId);
		
		// ID OF USER INVITING IS newMessage.authorId
		
		//if you need more than id and a game type you can add everything you want
		//in gameInvitArgs interface in chat.entities
		//then you will also need to send these infos in the front where the call is made

		if (!success)
		throw new ValidationError(error);

		return this.sendMessage(newInvite, {uid, status: 'PENDING', type});
		
		let message: MessageDTO = {
			id: 0,
			gameInvite: {
				status: 'PENDING',
				type: newInvite.gameInvite.gameType,
				uid: uid
			},
			author: {userId:newInvite.authorId},
			channelId: newInvite.ChannelId,
			content: newInvite.content,
			postedAt: new Date(),
		}

		return message;
	}
	
	async acceptGameInvite(userId: number, invite_message: MessageDTO, sessionId: string)
	{
		// HERE ADD THE CALLS YOU WANT TO DO TO GAME BACK
		//THROW AN EXCEPTION IF THERE IS A PROBLEM
		/*
			throw new ValidationError("Game invite expired or Invalid")
		*/
		await this.prisma.invite.update({
			where: {
				messageId: invite_message.id
			},
			data: {
				status: inviteStatus.EXPIRED
			}
		});

		const { success, error } = await this.gameService.joinUniqueQueue(invite_message.gameInvite.uid, sessionId);

		if (!success) {
			throw new ValidationError(error);
		}
	}

	async joinGroupChannel(channelId: number, userId: number, key? :string): Promise<GroupChannelDTO> {

		//might do checks that the user isnt banned
		const channel = await this.prisma.groupChannel.findUniqueOrThrow({
			where: {channelId},
			include: {
				banned: true,
				invited: true,
				channel: {
					select: {
						users: {
							select: {
								userId:true
							}
						}
					}
				}
			}
		})

		if (channel.channel.users.find(user => {
			return user.userId == userId;
		}) != undefined)
			throw new ValidationError("User is already on channel");

		if (channel.banned.find(user => {
			return user.userId == userId;
		}) != undefined)
			throw new ValidationError("User is banned from this channel");

		if (channel.type === 'KEY')
		{
			const match = await bcrypt.compare(key, channel.key);
			if (!match)
				throw new ValidationError("Incorrect or missing channel key");
		}

		if (channel.type === 'PRIV' && channel.invited.find(user =>
			{return user.userId == userId}) == undefined)
			throw new ValidationError("You have not been invited in this channel");

			
		//remove user from invite list if he was invited
		if (channel.type === 'PRIV') {
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					invited: {
						disconnect: {userId}
					}
				}
			});
		}

		if (channel.ownerId == null) {
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					owner: {
						connect:{userId}
					}
				}
			});
		}
		//this prisma request updates a group channel
		// -the group channel is found using its base channel's channelId

		// - it goes in its base channel
		// - requests an update of the base channel
		// - in the users fields and connects a new user
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
				admins: true,
				owner: true ,
				invited: true,
			}
		});

		return update;
	}

	//i chose to expect a whole channel as parameter to avoid having to fetch the db twice because
	//every caller of this function fetches the channel for some operations before calling this function
	async leaveGroupChannel(channel: GroupChannelWithMembers, userId: number) {

		//this prisma request is pretty similar to join channel

		if (channel.ownerId == userId) {
			let newOwnerId: number | undefined;
			delete_user_from_array(userId, channel.admins);
			delete_user_from_array(userId, channel.channel.users);

			//look for a random admin
			if (channel.admins.length > 0) //since owner is admin too
				newOwnerId = channel.admins[Math.random() * (channel.admins.length - 1)].userId;
			//look for a random user
			else if (channel.channel.users.length > 0)
			{
				console.log(channel.channel.users);
				newOwnerId = channel.channel.users[Math.random() * (channel.channel.users.length - 1)].userId;
				
			}

			if (newOwnerId != undefined) {
				await this.prisma.groupChannel.update({
					where:{channelId:channel.channelId},
					data: {
						owner: {
							connect: {
								userId:newOwnerId
							}
						}
					}
				});
			} else { //just remove owner from the channel
				await this.prisma.groupChannel.update({
					where:{channelId:channel.channelId},
					data: {
						owner: {
							disconnect: true
						}
					}
				});
			}
		}
		

		//but instead of connecting a new user to the users field
		//we delete one
		const update = await this.channelRepository.updateGroupChannel({
			where:{channelId:channel.channelId},
			data: {
				channel: {
					update: {
						users: {
							disconnect: {userId}
						}
					}
				},
				admins: {disconnect: {userId}},
				invited: {disconnect: {userId}},
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
				users: {select: {
							userId:true
						}}
				}},
			admins: {
				select: {
					userId: true
				}
			},
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

	async getChatUserWithInvite(userId: number) {
		const user = await this.prisma.chatUser.findUniqueOrThrow({
			where: {userId},
			include: {
				user: true,
				invites: true,
				blocked: {
					select: {
						userId : true
					}
				}
			}
		});

		return user;
	}

	async getChatUser(userId: number) {

		
		const user = await this.prisma.chatUser.findUniqueOrThrow({
			where: {userId},
			include: {
				user: true,
				// invites: true
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
				admins: true,
				owner: true,
				invited: true
			}
		});

		return channels;
	}

	async getUserDMChannels(userId: number)
	{
		const channels = this.prisma.dMChannel.findMany({
			where: {
				channel: {
					users: {
						some: {
							userId
						}
					}
				}
			},
			include: {
				channel: includeMembersAndLast10Messages
			}
		});

		return channels;
	}

	async getPublicChannels() : Promise<GroupChannelSnippetDTO[]>
	{
		const channels = this.prisma.groupChannel.findMany({
			where: {
				OR: [
					{
						type: {
							equals: 'PUBLIC'
						},
					},
					{
						type: {
							equals: 'KEY'
						}
					}
				]
			},
			select: {
				channelId: true,
				name: true,
				type: true
			}
		});

		return channels;
	}

	async getChatUserByName(username: string) : Promise<ChatUser>
	{
		const user = this.prisma.chatUser.findFirstOrThrow({
			where: {
				user: {
					username
				}
			}
		});

		return user;
	}
	/************** CHANNEL OPERATIONS *******************/



	async setUserAdmin(request: ChanRequestDTO): Promise<ChanNotifDTO>
	{
		// const groupChannel = this.channelRepository.getSingleGroupChannel({channelId:GroupChannelId}, true);
		console.log(request);
		const target = await this.prisma.user.findUniqueOrThrow({
			where: {
				id: request.targetUserId
			},
			select: {
				id: true
			}
		});
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

		if (request.targetUserId == channel.ownerId)
			throw new ValidationError("You dont have the rights to do that");

		//and presence of target in channel
		if (channel.channel.users.find(user => {
			return user.userId == target.id;
		}) === undefined)
			throw new ValidationError("This user isn't on channel");

		//if we want to demote an admin
		if (request.action == false && channel.admins.find(user => {return user.userId == target.id}) == undefined)
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
						userId: target.id
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
					disconnect: {
						userId: target.id
					}
				}
			}
		});

		}

		//returning object containing only ids
		return {
			action:request.action,
			targetUserId:target.id,
			callerUserId:request.authorUserId,
			channelId:request.channelId
		};
	}

	async muteUser(request: MuteDTO)
	{
		//add logic here checking admin rights from author
		console.log("MUTING USER");
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

		const target = await this.prisma.user.findUniqueOrThrow({
			where: {
				id: request.targetUserId
			},
			select: {
				id: true
			}
		});

		// if target is owner
		if (channel.ownerId == target.id)
			throw new ValidationError("The owner can't be mute");

		//if author isnt admin
		if (!this.isAdmin(request.authorUserId, channel))
			throw new ValidationError("You don't have the rights to mute a user");

		//and presence of target in channel
		if (channel.channel.users.find(user => {
			return user.userId == target.id;
		}) === undefined)
			throw new ValidationError("This user isn't on channel");
		
		let endDate = moment().add(request.durationInMinutes, 'minutes');

		await this.prisma.mute.create({
			data: {
				author: {
					connect: {userId:request.authorUserId}
				},
				target: {
					connect: {userId:target.id}
				},
				groupChannel: {
					connect: {channelId:request.groupChannelId}
				},
				endDate: endDate.toDate()
			}
		});
	}

	async banUser(request: ChanRequestDTO): Promise<ChanNotifDTO> {

		const {authorUserId, targetUserId, channelId, action } = request;

		const target = await this.prisma.user.findUnique({
			where: {
				id: request.targetUserId
			},
			select: {
				id: true
			}
		});
		const channel = await this.prisma.groupChannel.findUnique({
			where: {
				channelId
			},
			include: {
				admins: true,
				banned: true
			}
		});


		if (action) { //banning the target

			if (!this.isAdmin(authorUserId, channel))
				throw new ValidationError("Permission denied, you cant ban another user");
			
			if (this.isAdmin(target.id, channel))
				throw new ValidationError("Permission denied, you cant ban another admin");
			
			//this prisma request updates an existing channel
			//first adding a new user in the banlist
			//and removing him from the members of the channel
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					banned: {
						connect: {
							userId:target.id
						}
					},
					invited: {
						disconnect: {
							userId:target.id
						}
					},
					admins: {
						disconnect: {
							userId:target.id
						}
					},
					channel: {
						update: {
							users: {
								disconnect: {
									userId: target.id
								}
							}
						}
					}
				}
			});
		}
		else { //unbanning the target
			if (this.isAdmin(authorUserId, channel) == false)
				throw new ValidationError("Permission denied, you cant unban another user");
			
			await this.prisma.groupChannel.update({
				where: {channelId},
				data: {
					banned: {
						disconnect: {
							userId:target.id
						}
					}
				}
			});
				
		}

		return {channelId, action, callerUserId:authorUserId, targetUserId:target.id};
	}

	/**
	 * WARNING WILL RETURN OLD CHANNEL,
	 * TO DETECT PASSAGE TO AND FROM PUBLIC TYPE
	 */
	async set_chan_type(request: ChanTypeRequestDTO)
	{
		const channel = await this.prisma.groupChannel.findUnique({
			where: {channelId:request.channelId},
			include: {
				admins: true,
				invited: true
			}
		});

		if (this.isAdmin(request.authorUserId, channel) != true)
			throw new ValidationError("You are not admin");

		if (channel.type == request.type)
			throw new ValidationError("Chan is already " + channel.type);

		if (request.type == 'KEY')
		{
			if (request.key == undefined)
				throw new ValidationError("new channel key missing");
			//hashing password like a pro around here
			request.key = await bcrypt.hash(request.key, saltRounds);
		}

		await this.prisma.groupChannel.update({
			where: {channelId: request.channelId},
			data: {
				type: request.type,
				key: request.key
			}
		});

		return channel;
	}

	async changeChanKey(request: ChanKeyRequestDTO)
	{
		const channel = await this.prisma.groupChannel.findUnique({
			where: {channelId:request.channelId},
			include: {
				admins: true
			}
		});

		if (this.isAdmin(request.authorUserId, channel) != true)
			throw new ValidationError("You are not admin");
		if (channel.type != 'KEY')
			throw new ValidationError("Cannot put key on this channel, change channel type");
		
		const new_hash = await bcrypt.hash(request.key, saltRounds);
		await this.prisma.groupChannel.update({
			where: {channelId:request.channelId},
			data: {
				key:new_hash
			}
		});
	}

	async kickUser(request: basicChanRequestDTO): Promise<ChanNotifDTO> {

		const {channelId, authorUserId, targetUserId} = request;

		const target = await this.prisma.user.findUnique({
			where: {
				id: request.targetUserId
			},
			select: {
				id: true,
			}
		})
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
		if (this.isAdmin(targetUserId, channel) && authorUserId != channel.ownerId)
			throw new ValidationError("Permission denied you cant kick another admin");

		if (channel.channel.users.find(user =>
			{return user.userId == target.id}) == undefined)
			throw new ValidationError("Target is not in channel");

		// if (this.isAdmin(targetUserId, channel))
		// 	throw new ValidationError("Permission denied, you cant kick another admin");
		
		await this.leaveGroupChannel(channel, target.id);

		return {channelId, callerUserId:authorUserId, targetUserId:target.id, action:true};
	}

	async blockUser(callerUserId: number, data: {targetUserId: number, action: boolean}): Promise<{targetId: number, dmId: number | undefined}>
	{
		//find target
		let target: User;
		const {targetUserId, action} = data;

		try {
			target = await this.prisma.user.findUniqueOrThrow({
				where: {
					id:targetUserId
				}
			});
		} catch (e: any) {
			throw new ValidationError("No such user");
		}

		if (target.id == callerUserId && action)
			throw new ValidationError("Cant block yourself");

		//if there is a DM channel, find it to delete it
		const dm = await this.prisma.dMChannel.findFirst({
			where: {
				channel: {
					AND: [
						{
							users: { some: {
								userId: targetUserId
							}}
						},
						{
							users: { some: {
								userId: callerUserId
							}}
						}					
					],
				},
			},
		});

		if (action)	{
			await this.prisma.chatUser.update({
				where: {
					userId:callerUserId
				},
				data: {
					blocked: {
						connect: {
							userId:target.id
						}
					}
				}
			});
		} else {
			await this.prisma.chatUser.update({
				where: {
					userId:callerUserId
				},
				data: {
					blocked: {
						disconnect: {
							userId:target.id
						}
					}
				}
			});
		}

		if (dm != undefined && action) {
			await this.prisma.channel.delete({
				where: {
					id:dm.channelId
				}
			});
		}

		return {targetId:target.id, dmId:dm?.channelId};
	}

	//in an invite request there is an username ( for ease of use, its better to remember usernames than userId :p)
	//so i need to return a InviteUpdate object with an userId since the rest of the codebase uses userIds
	async inviteUser(request: ChanRequestDTO) : Promise<{targetUserId: number, channel: GroupChannelDTO}>
	{
		const user = await this.prisma.user.findUniqueOrThrow({
			where: {
				id: request.targetUserId
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
				invited: true,
				banned: true
			}
		});

		if (channel.type == 'KEY')
			throw new ValidationError("You can't invite to a pass protected channel");

		// if (request.action == true) //if we want to invite someone
		// {
		if (channel.channel.users.find(user => 
			{return user.userId == targetUserId}) != undefined)
			throw new ValidationError("User is already on channel");
			
		if (channel.type == 'PRIV' && !this.isAdmin(request.authorUserId, channel))
			throw new ValidationError("You need to be admin to invite in private chan")

		if (channel.banned.find(user => {
			return user.userId == targetUserId;
		}) != undefined)
			throw new ValidationError("This user is banned from this channel");
		
		// await this.prisma.groupChannel.update({
		// 	where: {channelId:request.channelId},
		// 	data: {
		// 		invited: {
		// 			connect: {userId:targetUserId}
		// 		}
		// 	}
		// });

		const channelWithMessages = await this.prisma.groupChannel.update({
			where: {channelId:request.channelId},
			data: {
				channel: {
					update: {
						users: {
							connect: {userId:targetUserId}
						}
					}
				}
			},
			include: {
				channel: includeMembersAndLast10Messages,
				admins: true,
				owner: true ,
				invited: true,
			}
		});
		// }
		// else { //if we want to uninvite someone
		// 	if (this.isAdmin(request.authorUserId, channel) == false)
		// 	throw new ValidationError("You must be Admin to uninvite someone");

		// if (channel.invited.find(user =>
		// 	{user.userId == targetUserId}) != undefined)
		// 	throw new ValidationError("User is not invited !")

		// const channelWithMessages = await this.prisma.groupChannel.update({
		// 	where:{channelId:request.channelId},
		// 	data: {
		// 		invited: {
		// 			disconnect: {userId: targetUserId}
		// 		}
		// 	}
		// });	
		// }

		return  ({targetUserId, channel: channelWithMessages});
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

	async search_user(query: searchQueryDTO): Promise<{username: string, id: number}[]>
	{
		const {channelId, username} = query;

		if (username == null || username.length == 0)
			return [];

		let possible_usernames: {username: string, id:number}[];

		if (channelId == undefined)
		{
			possible_usernames = await this.prisma.user.findMany({
				where: {
					username: {
						contains: username,
						mode: 'insensitive'
					}
				},
				take: 20,
				select: {
					username: true,
					id: true,
				}
			});
		} else {
			possible_usernames = await this.prisma.user.findMany({
				where: {
					chatUser: {
						joinedChannels: {
							some: {
								id: channelId
							}
						}
					},
					username: {
						contains: username,
						mode: 'insensitive'
					}
				},
				take: 20,
				select: {
					username: true,
					id: true,
				}
			});
		}

		return possible_usernames;
	}

}

function  delete_user_from_array(userId: number, array: SimpleChatUserDTO[])
{
	for (let i = 0; i < array.length; i++)
	{
		if (array[i].userId == userId)
		{
			array.splice(i, 1);
			break;
		}
	}
}
