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
} from './Chat.entities'

import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "./message.create.dto";
import { ChatService } from "./Chat.service";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { Channel, ChatUser, GroupChannel } from "@prisma/client";
import { Public } from "src/auth/public.decorator";
import { AuthService } from "src/auth/auth.service";
import { ParseIntPipe, UseFilters } from "@nestjs/common";

import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { IsNumber, validateOrReject } from "class-validator";
import { chatSocket, chatServer } from "./Chat.module";

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


@UseFilters(new BaseWsExceptionFilter())
@Public()
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
		console.log("New socket connected to chat");
		console.log("jwt token:", jwt);
		try {
			payload = await this.authService.verifyJWT(jwt.split(' ')[1]);
			console.log(payload);
			console.log(payload.id);
			socket.data.userId = parseInt(payload.id);
			console.log(socket.data.userId);
			user = await this.chatService.getChatUser(socket.data.userId);
		}
		catch (e) {
			console.log("ERROR WHILE CONNECTING");
			console.log(e);
			socket.disconnect(true);
		}

		console.log(user);
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

		try {
			channel = await this.chatService.createGroupChannel(createChannel, {channel: {
				include: {
					users: true,
					messages: true
				}
			}});
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		try {
			await this.chatService.joinGroupChannel(channel.channel.id, socket.data.userId, createChannel.key);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		socket.join(channel.channel.id.toString());
		return (channel);
	}

	@SubscribeMessage("join_channel")
	async handleJoinEvent(
		@MessageBody() request: joinRequestDTO,
		@ConnectedSocket() socket: chatSocket)
		: Promise<GroupChannelDTO>
	{
		let channel: GroupChannel;
		let channelWithMessage: GroupChannelDTO;
		console.log(request);
		try {
			channel = await this.chatService.findGroupChannelbyName(request.channelName);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		try {
			channelWithMessage = await this.chatService.joinGroupChannel(channel.channelId, socket.data.userId, request.key);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		console.log("user %d joining channel %s", socket.data.userId, channel.name)
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

		console.log("leave channel called");
		try {
			channel = await this.chatService.findGroupChannelbyID(channelId);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		console.log("no crash yet");
		try {
			await this.chatService.leaveGroupChannel(channelId,
				socket.data.userId);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}
		console.log("user %d leaving channel %s", socket.data.userId, channel.name)
		socket.leave(channelId.toString());
		return undefined;
	}

	@SubscribeMessage('test_event')
	async handleTest()
	{
		console.log("Throwing error");
		throw new WsException('cheh');
		return "coucou";
	}

	@SubscribeMessage('get_user')
	async handleGetUser(@ConnectedSocket() socket: chatSocket)
	{
		return this.chatService.getChatUser(socket.data.userId);
	}

	@SubscribeMessage("get_groupchannels")
	async handleGetChannels(@ConnectedSocket() socket: chatSocket)
	{
		console.log("get channel called");
		return this.chatService.getUserGroupChannels(socket.data.userId);
	}

	@SubscribeMessage("send_message")
	async sendMessage(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() messageCreate: CreateMessageDto
		)
	{
		let message: any; 
		try {
			message = await this.chatService.sendMessage(messageCreate);
		}
		catch (e: any) {
			console.log(e);
			// throw WsException;
			throw new WsException(e.message);
		}

		this.server.to(message.channel.id.toString()).emit("message", message);
	}

	@SubscribeMessage("set_admin_request")
	async setAdmin(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: adminRequestDTO)
	{
		try {
			await this.chatService.setUserAdmin(request)
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		this.server.to(request.groupChannelId.toString()).emit("user_set_admin", request);
	}

	@SubscribeMessage("unset_admin_request")
	async unsetAdmin(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody() request: adminRequestDTO)
	{
		try {
			await this.chatService.unsetUserAdmin(request);
		} catch (e: any) {
			console.log(e);
			throw new WsException(e);
		}

		this.server.to(request.groupChannelId.toString()).emit("user_unset_admin", request);
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

	@SubscribeMessage("start_dm")
	async startDM(
		@ConnectedSocket() socket: chatSocket,
		@MessageBody('targetUserId', ParseIntPipe)
		targetUserId: number
	)
	{
		let channel;

		//ask the service to start a DM with the other user, will return a DMChannel
		try {
			channel = await this.chatService.startDM({targetUserId, callerUserId:socket.data.userId});
		} catch (e: any) {
			console.log(e);
			throw new WsException(e.toString());
		}
		const sockets = await this.server.fetchSockets();
		const targetSocket = sockets.find(socket => {
			return socket.data.userId == targetUserId;
		});

		if (targetSocket != undefined)
			this.server.to(targetSocket.id).emit("dm_starting", channel);

		return (channel.channel);
	}
}
