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
	adminRequestDTO,
	MuteDTO,
	GroupChannelDTO,
	ChanRequestDTO,
	ChanTypeRequestDTO,
	basicChanRequestDTO,
	InviteRequestDTO,
	inviteUpdateDTO,
	ChanKeyRequestDTO,
	DMChannelDTO,
	CreateMessageDto
} from './Chat.entities'

import { Server, Socket } from 'socket.io';
import { ChatService } from "./Chat.service";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { Channel, ChatUser, GroupChannel, User } from "@prisma/client";
import { Public } from "src/auth/public.decorator";
import { AuthService } from "src/auth/auth.service";
import { Inject, Injectable, ParseIntPipe, UseFilters, forwardRef } from "@nestjs/common";

import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { IsNumber, validateOrReject } from "class-validator";
import { chatSocket, chatServer } from "./Chat.module";
import { ValidationError } from "./Chat.error";
import { UpdateUserDto } from "src/user/User.update-dto";
import { UserWithoutSecret } from "src/user/User.module";

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
@UseFilters(new BaseWsExceptionFilter())
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
			console.log(e);
			socket.disconnect(true);
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
		@MessageBody() createChannel: CreateGroupChannelDto
	) : Promise<GroupChannelDTO>
	{
		let channel;
		let returnedChannel: GroupChannelDTO;

		try {
			channel = await this.chatService.createGroupChannel(createChannel,
				{
					channel: {
						include: {
							users: true,
							messages: true,
						}
					},
					admins: true,
					owner: true,
					invited: true,
				});
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		try {
			returnedChannel = await this.chatService.joinGroupChannel(channel.channel.id, socket.data.userId, createChannel.key);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		socket.join(channel.channel.id.toString());
		if (returnedChannel.type == 'PUBLIC')
			this.server.emit('public_chans', {channels: [returnedChannel], add: true});
		return (returnedChannel);
	}

	@SubscribeMessage("join_channel")
	async handleJoinEvent(
		@MessageBody() request: joinRequestDTO,
		@ConnectedSocket() socket: chatSocket)
		: Promise<GroupChannelDTO>
	{
		let channel: GroupChannel;
		let channelWithMessage: GroupChannelDTO;
		try {
			channel = await this.chatService.findGroupChannelbyName(request.channelName);

			channelWithMessage = await this.chatService.joinGroupChannel(channel.channelId, socket.data.userId, request.key);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.message);
		}

		const user = await this.chatService.getChatUser(socket.data.userId);
		console.log("user %d joining channel %s", socket.data.userId, channel.name)
		this.server.to(channel.channelId.toString()).emit("user_joined_room", {
			user: user,
			channelId: channel.channelId
		});
		socket.join(channel.channelId.toString());
		// socket.emit("join_room", channel);
		return (channelWithMessage);
	}

	@SubscribeMessage("leave_channel")
	async handleLeaveEvent(
		@MessageBody() channelId: number,
		@ConnectedSocket() socket: chatSocket
	)
	{
		let channel: any;

		try {
			channel = await this.chatService.findGroupChannelbyID(channelId);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		try {
			await this.chatService.leaveGroupChannel(channelId,
				socket.data.userId);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		const user = await this.chatService.getChatUser(socket.data.userId);
		console.log("user %d leaving channel %s", socket.data.userId, channel.name)
		socket.leave(channelId.toString());
		this.server.to(channel.channelId.toString()).emit("user_left_room", {
			user: user,
			channelId: channel.channelId
		});
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
		@MessageBody() request: ChanKeyRequestDTO)
	{
		try {
			this.chatService.changeChanKey(request);
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

	@SubscribeMessage("send_message")
	async sendMessage(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() messageCreate: CreateMessageDto
		)
	{
		let message: MessageDTO; 
		try {
			message = await this.chatService.sendMessage(messageCreate);
		}
		catch (e: any) {
			console.log(e);
			// throw WsException;
			throw new WsException(e.message);
		}
		
		console.log("sending message:", message);
		this.server.to(message.channelId.toString()).emit("message", message);
	}

	@SubscribeMessage("invite_request")
	async inviteUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: InviteRequestDTO)
	{
		let update: inviteUpdateDTO;
		try {
			update = await this.chatService.inviteUser(request);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.message);
		}


		//sending invite/uninvite to target
		const sockets = await this.server.fetchSockets();
		const targetSocket = sockets.find(socket => {
			return socket.data.userId == update.targetUserId;
		});

		targetSocket?.emit("invite_update", update);


		//maybe send update to channel members to keep track of current invites in channel ?
		this.server.to(update.channelId.toString()).except(targetSocket.id.toString()).emit("invite_update", update);
	}

	@SubscribeMessage("chan_type_request")
	async setVisiblity(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: ChanTypeRequestDTO)
	{
		let oldChan: GroupChannel;
		try {
			oldChan = await this.chatService.set_chan_type(request);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		//GLOBAL NOTIFICATIONS

		//if channel was public, send notice that it isnt anymore
		if (oldChan.type == 'PUBLIC')
			this.server.emit("public_chans", {channels:[oldChan], add: false});
		//if channel is going public send notice
		else if (request.type == 'PUBLIC')
			this.server.emit("public_chans", {channels:[oldChan], add: true});
		//note: the type channelSnippet that is sent will only extract the name and id of the channel
		//so it's not the whole channel that is being sent

		//CHANNEL NOTIFICATIONS
		this.server.to(request.channelId.toString()).emit("chan_type_update", request);		
	}

	@SubscribeMessage("admin")
	async setAdmin(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: ChanRequestDTO)
	{
		try {
			await this.chatService.setUserAdmin(request)
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		this.server.to(request.channelId.toString()).emit("admin_update", request);
	}

	@SubscribeMessage("mute_request")
	async muteUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: MuteDTO)
	{
		try {
			await this.chatService.muteUser(request);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		this.server.to(request.groupChannelId.toString()).emit("user_muted", request);
	}

	@SubscribeMessage("kick_request")
	async kickUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: basicChanRequestDTO
	)
	{
		try {
			await this.chatService.kickUser(request)
		} catch (e: any) {
			console.log(e)
			throw new WsException(e.message);
		}

		const user = await this.chatService.getChatUser(request.targetUserId);
		this.server.to(request.channelId.toString()).emit("user_kicked", request);

		const sockets = await this.server.fetchSockets();
		const targetSocket = sockets.find(socket => {
			return socket.data.userId == request.targetUserId;
		});

		targetSocket?.leave(request.channelId.toString());
	}

	@SubscribeMessage("ban_request")
	async banUser(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: ChanRequestDTO
	)
	{
		try {
			await this.chatService.banUser(request)
		} catch (e: any) {
			console.log(e)
			throw new WsException(e.message);
		}


		const user = await this.chatService.getChatUser(request.targetUserId);
		this.server.to(request.channelId.toString()).emit("user_banned", request);

		if (request.action) //if user is getting banned
		{
			const sockets = await this.server.fetchSockets();
			const targetSocket = sockets.find(socket => {
				return socket.data.userId == request.targetUserId;
			});

			targetSocket.leave(request.channelId.toString());
		}
	}

	@SubscribeMessage("start_dm")
	async startDM(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() targetUserName: string
	): Promise<DMChannelDTO>
	{
		let channel : DMChannelDTO;
		let target_user : ChatUser;

		//ask the service to start a DM with the other user, will return a DMChannel
		try {
			channel = await this.chatService.startDM(socket.data.userId, targetUserName);
			target_user = await this.chatService.getChatUserByName(targetUserName);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.toString());
		}
		const sockets = await this.server.fetchSockets();
		const targetSocket = sockets.find(socket => {
			return socket.data.userId == target_user.userId;
		});

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
		@MessageBody() msg: MessageDTO
	)
	{
		try {
			this.chatService.acceptGameInvite(socket.data.userId, msg.gameInvite.uid);
		} catch (e: any) {
			throw new WsException(e.message);
		}
		
		//send update that invite has expired
		
		console.log("An User accepted the game invite", msg);
		this.server.to(msg.channelId.toString()).emit("game_invite_expire", msg);
	}

	updateUser(userId: number, update: UserWithoutSecret)
	{
		this.server.emit("user_update", {userId:userId, user:update});
	}
}
