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
	MessageDTO,
	ChannelDTO,
	ChatUserDTO,
	joinRequestDTO,
	adminRequestDTO,
	MuteDTO
} from './Chat.events'

import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "./message.create.dto";
import { ChatService } from "./Chat.service";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { Channel, ChatUser, GroupChannel } from "@prisma/client";
import { Public } from "src/auth/public.decorator";
import { AuthService } from "src/auth/auth.service";
import { UseFilters } from "@nestjs/common";

import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const data = host.switchToWs().getData();
    const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    client.emit("error",
	{
        id: (client as any).id,
        rid: data.rid,
        ...details
    }
    );
  }}


@UseFilters(new WebsocketExceptionsFilter())
@Public()
@WebSocketGateway(
	{namespace: "chat"}
)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(
		private chatService: ChatService,
		private authService: AuthService) {}

	@WebSocketServer() server: Server = new Server<
		ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData>();

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
			console.log(socket.data.userId, " : joined channel [", channel.name, "]")
		});

		console.log(socket.data.userId, ': connected to chat');
	}

	async handleDisconnect(@ConnectedSocket() socket: any) {

		console.log(socket.data.userId, " : disconnected from chat");
	}

	@SubscribeMessage("create_room")
	async handleCreateEvent(
		@ConnectedSocket() socket: Socket,
		@MessageBody() createChannel: CreateGroupChannelDto
	)
	{
		let channel: any;

		try {
			channel = await this.chatService.createGroupChannel(createChannel, {channel: true});
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		try {
			await this.chatService.joinChannel(channel.channel.id, socket.data.userId);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		socket.emit("join_room", channel.channel);
		socket.join(channel.channel.id.toString());
	}

	@SubscribeMessage("join_room")
	async handleJoinEvent(
		@MessageBody() channelName: string,
		@ConnectedSocket() socket: Socket)
	{
		let channel: any;

		try {
			channel = await this.chatService.findChannelbyName(channelName);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		try {
			await this.chatService.joinChannel(channel.id, socket.data.userId);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		socket.join(channelName);
	}

	@SubscribeMessage("leave_room")
	async handleLeaveEvent(
		@MessageBody() channelName: string,
		@ConnectedSocket() socket: Socket
	)
	{
		let channel: any;

		try {
			channel = await this.chatService.findChannelbyName(channelName);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		try {
			await this.chatService.leaveChannel(channel.id, socket.data.userId);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		socket.leave(channelName);
	}

	@SubscribeMessage('test_event')
	async handleTest()
	{
		console.log("Throwing error");
		throw new WsException('cheh');
		return "coucou";
	}

	@SubscribeMessage('get_user')
	async handleGetUser(@ConnectedSocket() socket: Socket)
	{
		return this.chatService.getChatUser(socket.data.userId);
	}

	@SubscribeMessage("send_message")
	async sendMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody() messageCreate: CreateMessageDto
		)
	{
		let message: any; 
		try {
			message = await this.chatService.sendMessage(messageCreate);
		}
		catch (e) {
			console.log(e);
			throw WsException;
		}

		this.server.to(message.channel.id.toString()).emit("message", message);
	}

	@SubscribeMessage("set_admin_request")
	async setAdmin(
		@ConnectedSocket() socket: Socket,
		@MessageBody() request: adminRequestDTO)
	{
		try {
			await this.chatService.setUserAdmin(request)
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		this.server.to(request.groupChannelId.toString()).emit("set_admin", request);
	}

	@SubscribeMessage("unset_admin_request")
	async unsetAdmin(
		@ConnectedSocket() socket: Socket,
		@MessageBody() request: adminRequestDTO)
	{
		try {
			await this.chatService.unsetUserAdmin(request);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		this.server.to(request.groupChannelId.toString()).emit("unset_admin", request);
	}

	@SubscribeMessage("mute_request")
	async muteUser(
		@ConnectedSocket() socket: Socket,
		@MessageBody() request: MuteDTO)
	{
		try {
			await this.chatService.muteUser(request);
		} catch (e) {
			console.log(e);
			throw WsException;
		}

		this.server.to(request.groupChannelId.toString()).emit("mute", request);
	}
}
