import {
	BaseWsExceptionFilter,
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from "@nestjs/websockets";	

import {
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData,
} from './Chat.events'

import {
	MessageDTO,
	ChannelDTO,
	ChatUserDTO,
	joinRequestDTO,
	MuteDTO,
	GroupChannelDTO,
	ChanRequestDTO,
	ChanTypeRequestDTO,
	basicChanRequestDTO,
	inviteUpdateDTO,
	ChanKeyRequestDTO,
	DMChannelDTO,
	CreateMessageDto,
	GroupChannelSnippetDTO,
	ChanNotifDTO,
	searchQueryDTO
} from './Chat.entities'

import { Server, Socket } from 'socket.io';
import { ChatService } from "./Chat.service";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { Channel, ChatUser, GroupChannel, User } from "@prisma/client";
import { Public } from "src/auth/public.decorator";
import { AuthService } from "src/auth/auth.service";
import { BadRequestException, Inject, Injectable, ParseBoolPipe, ParseIntPipe, UseFilters, UsePipes, ValidationPipe, forwardRef } from "@nestjs/common";

import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { IsNumber, validateOrReject } from "class-validator";
import { chatSocket, chatServer } from "./Chat.module";
import { ValidationError } from "./Chat.error";
import { UpdateUserDto } from "src/user/User.update-dto";
import { UserWithoutSecret } from "src/user/User.module";
import { OnEvent } from "@nestjs/event-emitter";

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
	catch(exception: WsException | HttpException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient() as Socket;
		const data = host.switchToWs().getData();
		const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
		const details = error instanceof Object ? { ...error } : { message: error };
		console.log("EMIITING ERROR");
		client.emit("exception",
		{
			id: (client as any).id,
			rid: data.rid,
			...details
		}
    );
  }}

@Catch(BadRequestException)
	export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
		catch(exception: BadRequestException, host: ArgumentsHost) {
		const properException = new WsException(exception.getResponse());
		super.catch(properException, host);
	}
}
  
  /**
   * The Chat Gateway is here to syncronise every connected client to the chat
   * 
   * and send requests to the chat service, there is not logic here
   * only try catch blocks
   * 
   * and sending updates to keep everyone syncronised
   * 
   * The different events that it can receive and send are documented in chat.events
   * and the different interfaces/DTOs used are documented in chat.entities
   */
@UseFilters(new BadRequestTransformationFilter())
@UseFilters(new BaseWsExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway(
	{namespace: "chat"}
)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(
		private chatService: ChatService,
		private authService: AuthService) {}

	@WebSocketServer() server: chatServer = new Server<
		ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData
		>();

	async handleConnection(@ConnectedSocket() socket: Socket) {
		let payload : any;
		let jwt : string = socket.handshake.headers.authorization;
		let user : any;
		try {
			payload = await this.authService.verifyJWT(jwt.split(' ')[1]);
			socket.data.userId = parseInt(payload.id);
			user = await this.chatService.getChatUserWithChannels(socket.data.userId);
		}
		catch (e) {
			console.log("ERROR WHILE CONNECTING");
			socket.disconnect(true);
			return;
		}

		//joining every channel the user was connected to
		user.joinedChannels.forEach(channel => {
			socket.join(channel.id.toString());
			// console.log(socket.data.userId, " : joined channel [", channel.name, "]")
		});

		console.log(socket.data.userId, ': connected to chat');
	}

	async handleDisconnect(@ConnectedSocket() socket: any) {

		console.log(socket.data.userId, " : disconnected from chat");
	}

	@SubscribeMessage("create_channel")
	async handleCreateEvent(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: CreateGroupChannelDto
	) : Promise<GroupChannelDTO>
	{
		let channel: GroupChannelDTO;

		try {
			channel = await this.chatService.createGroupChannel(data);
		} catch (e: any) {
			throw new WsException(e.message);
		}

		socket.join(channel.channel.id.toString());
		if (channel.type == 'PUBLIC' || channel.type == 'KEY')
		{
			const snippet: GroupChannelSnippetDTO = {
				channelId:channel.channelId,
				type:channel.type,
				name:channel.name
			}
			this.server.emit('public_chans', {channels: [snippet], add: true});
		}
		return (channel);
	}

	@SubscribeMessage("join_channel")
	async handleJoinEvent(
		@MessageBody() data: joinRequestDTO,
		@ConnectedSocket() socket: chatSocket)
		: Promise<GroupChannelDTO>
	{
		let channelId: number;
		let channelWithMessage: GroupChannelDTO;
		try {

			if (data.channelId == undefined)
				channelId = (await this.chatService.findGroupChannelbyName(data.channelName)).channelId;
			else
				channelId = data.channelId;

			channelWithMessage = await this.chatService.joinGroupChannel(channelId, socket.data.userId, data.key);
		} catch (e: any) {
			throw new WsException(e.message);
		}

		const user = await this.chatService.getChatUser(socket.data.userId);
		console.log("user %d joining channel %s", socket.data.userId, channelWithMessage.name)
		this.server.to(channelId.toString()).emit("user_joined_room", {
			targetUserId:user.userId,
			channelId
		});
		socket.join(channelId.toString());
		// socket.emit("join_room", channel);
		return (channelWithMessage);
	}

	@SubscribeMessage("leave_channel")
	async handleLeaveEvent(
		@MessageBody() data: number,
		@ConnectedSocket() socket: chatSocket
	)
	{
		let channel: any = await this.chatService.findGroupChannelbyID(data);
		let oldOwner = channel.ownerId;

		try {
			channel = await this.chatService.leaveGroupChannel(channel,
				socket.data.userId);
		} catch (e: any) {
			throw new WsException(e.message);
		}

		socket.leave(data.toString());
		this.server.to(channel.channelId.toString()).emit("user_left_room", {
			targetUserId:socket.data.userId,
			channelId: channel.channelId,
		});
		console.log("user %d leaving channel %s", socket.data.userId, channel.name)

		if(oldOwner != channel.ownerId)
		{
			this.server.to(channel.channelId.toString()).emit("owner_update", {
				targetUserId:channel.ownerId,
				channelId:channel.channelId
			});
		}
		// return undefined;
	}

	@SubscribeMessage('test_event')
	async handleTest()
	{
		console.log("Throwing error");
		throw new WsException('cheh');
		return "coucou";
	}

	@SubscribeMessage("get_my_user")
	async handleGetUser(@ConnectedSocket() socket: chatSocket)
	{
		return this.chatService.getChatUserWithInvite(socket.data.userId);
	}

	@SubscribeMessage("chan_key_request")
	async handleChanKey(@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: ChanKeyRequestDTO)
	{
		try {
			this.chatService.changeChanKey(data);
		} catch (e: any) {
			throw new WsException(e.message);
		}
	}

	@SubscribeMessage("get_other_user")
	async handleGetOtherUser(@ConnectedSocket() socket: chatSocket,
		@MessageBody() id: number)
	{
		return this.chatService.getChatUser(id);
	}

	@SubscribeMessage("get_groupchannels")
	async handleGetChannels(@ConnectedSocket() socket: chatSocket)
	{
		return this.chatService.getUserGroupChannels(socket.data.userId);
	}

	@SubscribeMessage("get_public_channels")
	async handleGetPublicChannels(
		@ConnectedSocket() socket: chatSocket)
	{
		return this.chatService.getPublicChannels();
	}

	@SubscribeMessage("get_dmchannels")
	async handleGetDMs(@ConnectedSocket() socket: chatSocket)
	{
		return this.chatService.getUserDMChannels(socket.data.userId);
	}

	@SubscribeMessage("search_username")
	async handleSearch(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() query: searchQueryDTO
	)
	{
		let usernames: { username: string, id: number }[];
		try {
			usernames = await this.chatService.search_user(query);
		} catch (e: any) {
			throw new WsException(e.message);
		}

		return usernames;
	}


	@SubscribeMessage("send_message")
	async sendMessage(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: CreateMessageDto
		)
	{
		let message: MessageDTO; 
		try {
			message = await this.chatService.sendMessage(data);
		}
		catch (e: any) {
			// throw WsException;
			throw new WsException(e.message);
		}
		
		this.server.to(message.channelId.toString()).emit("message", message);
	}

	@SubscribeMessage("send_game_invite")
	async sendGameInvite(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: CreateMessageDto
		)
	{
		let message: MessageDTO;

		// try {
			message = await this.chatService.createGameInvite(data, socket.handshake.headers.sessionid as string);
		// } catch (e: any) {
			// throw new WsException(e.message);
		// }

		this.server.to(message.channelId.toString()).emit("message", message);
	}

	@SubscribeMessage("invite_request")
	async inviteUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: ChanRequestDTO)
	{
		try {
			const {targetUserId, channel} = await this.chatService.inviteUser(data);
			const targetSocket = await this.findSocket(targetUserId);

			this.server.to(channel.channelId.toString())
			.emit("user_joined_room", {targetUserId, channelId: channel.channelId});

			if (targetSocket != undefined)
			{
				targetSocket.emit("invite_update", {targetUserId, channel});
				targetSocket.join(channel.channelId.toString());
			}
		} catch (e: any) {
			throw new WsException(e.message);
		}


		//sending invite/uninvite to target

		// targetSocket?.emit("invite_update", update);
		


		//maybe send update to channel members to keep track of current invites in channel ?
		// this.server.to(update.channelId.toString()).except(targetSocket.id.toString()).emit("invite_update", update);
	}

	@SubscribeMessage("chan_type_request")
	async setVisiblity(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: ChanTypeRequestDTO)
	{
		let oldChan: GroupChannel & {
			invited: ChatUser[];
			admins: ChatUser[];
		};
		try {
			oldChan = await this.chatService.set_chan_type(data);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.message);
		}

		//GLOBAL NOTIFICATIONS
		if (oldChan.type != data.type)
		{
			//if new channel is priv then it was visible before so send notif
			if (data.type == 'PRIV')
				this.server.emit("public_chans", {channels:[oldChan], add: false});
			//every other case, update channel in visible chan list
			else
				this.server.emit("public_chans", {channels:[oldChan], add: true});
			//note: the type channelSnippet that is sent will only extract the name and id of the channel
			//so it's not the whole channel that is being sent

			//INVITE NOTIFICATIONS
			// removed temporarily because invites are instantaneous now
			// if (data.type == 'KEY' || data.type == 'PRIV')
			// {
			// 	oldChan.invited.forEach(async user => {
			// 		const otherSocket = await this.findSocket(user.userId);

			// 		//uninvite notif
			// 		otherSocket?.emit("invite_update", {
			// 			channelId:oldChan.channelId,
			// 			channelName:oldChan.name,
			// 			targetUserId:user.userId,
			// 			action:false
			// 		});
			// 	});
			// }

			//CHANNEL NOTIFICATIONS
			this.server.to(data.channelId.toString()).emit("chan_type_update", data);		
		}
	}

	@SubscribeMessage("admin_request")
	async setAdmin(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: ChanRequestDTO)
	{
		let update: ChanNotifDTO;
		try {
			update = await this.chatService.setUserAdmin(data)
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.message);
		}

		this.server.to(data.channelId.toString()).emit("admin_update", update);
	}

	@SubscribeMessage("mute_request")
	async muteUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: MuteDTO)
	{
		try {
			await this.chatService.muteUser(data);
		} catch (e: any) {
			throw new WsException(e.message);
		}

		this.server.to(data.groupChannelId.toString()).emit("user_muted", data);
	}

	@SubscribeMessage("kick_request")
	async kickUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: basicChanRequestDTO
	)
	{
		let update: ChanNotifDTO;
		try {
			update = await this.chatService.kickUser(data)
		} catch (e: any) {
			console.log(e)
			throw new WsException(e.message);
		}

		// const user = await this.chatService.getChatUser(data.targetUserId);
		this.server.to(data.channelId.toString()).emit("user_kicked", update);

		const targetSocket = await this.findSocket(update.targetUserId);

		targetSocket?.leave(data.channelId.toString());
	}

	@SubscribeMessage("ban_request")
	async banUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: ChanRequestDTO
	)
	{
		let update: ChanNotifDTO;
		try {
			update = await this.chatService.banUser(data)
		} catch (e: any) {
			console.log(e)
			throw new WsException(e.message);
		}


		const user = await this.chatService.getChatUser(update.targetUserId);
		this.server.to(data.channelId.toString()).emit("user_banned", update);

		if (data.action) //if user is getting banned
		{
			const targetSocket = await this.findSocket(update.targetUserId);

			if (targetSocket != undefined)
				targetSocket.leave(data.channelId.toString());
		}
	}

	@SubscribeMessage("block_request")
	async BlockUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: {targetUserId: number, action: boolean}
	)
	{
		let update;
		console.log("trying to block:", data);
		try {
			update = await this.chatService.blockUser(socket.data.userId, data);
		} catch (e: any) {
			throw new WsException(e.message);
		}

		console.log(update);

		if (update.dmId != undefined && data.action)
			this.server.to(update.dmId.toString()).emit('chan_deleted', update.dmId);

		return update.targetId;
	}

	@SubscribeMessage("start_dm")
	async startDM(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: string
	): Promise<DMChannelDTO>
	{
		let channel : DMChannelDTO;
		let target_user : ChatUser;

		//ask the service to start a DM with the other user, will return a DMChannel
		try {
			channel = await this.chatService.startDM(socket.data.userId, data);
			target_user = await this.chatService.getChatUserByName(data);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.toString());
		}
		const targetSocket = await this.findSocket(target_user.userId);

		if (targetSocket != undefined)
		{
			targetSocket.join(channel.channelId.toString());
			this.server.to(targetSocket.id).emit("dm_starting", channel);
		}

		socket.join(channel.channelId.toString());

		return (channel);
	}

	@SubscribeMessage("accept_game_invite")
	async acceptGameInvite(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() data: MessageDTO
	)
	{

		this.server.to(data.channelId.toString()).emit("game_invite_expire", data);
		try {
			await this.chatService.acceptGameInvite(socket.data.userId, data, socket.handshake.headers.sessionid as string);
		} catch (e: any) {
			throw new WsException(e.message);
		}
		
		//send update that invite has expired
		
		console.log("An User accepted the game invite", data);
	}

	
	private async findSocket(userId: number)
	{
		const sockets = await this.server.fetchSockets();
		const targetSocket = sockets.find(socket => {
			return socket.data.userId == userId;
		});

		return targetSocket;
	}
}
