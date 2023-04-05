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

	@WebSocketServer() server: Server = new Server();

	async handleConnection(@ConnectedSocket() socket: Socket) {
		let payload : any;
		let jwt : string = socket.handshake.headers.authorization;
		let user : any;
		console.log("New socket connected to chat");
		console.log("jwt token:", jwt);
		try {
			payload = await this.authService.verifyJWT(jwt.split(' ')[1]);
			console.log(payload);
			console.log(payload.sub);
			socket.data.userId = payload.sub;
			console.log(socket.data.userId);
			user = this.chatService.getChatUser(parseInt(socket.data.userId));
		}
		catch (e) {
			console.log(e);
			socket.disconnect(true);
		}

		console.log(socket.data.userId, ': connected to chat');
	}

	async handleDisconnect(@ConnectedSocket() socket: any) {
	}

	@SubscribeMessage('chat')
	async handleChatEvent(@MessageBody() payload: CreateMessageDto)
	{
		this.chatService.sendMessage(payload);
		this.server.to(payload.ChannelId.toString()).emit('chat', payload);
		return payload;
	}

	@SubscribeMessage('join_room')
	async handleJoinEvent(@MessageBody()
		payload: {
			userId: number,
			channelId?: number,
			channel_name?: string
		}, @ConnectedSocket() socket: any)
	{
		let channel: any;
		if (payload.channelId !== undefined)
		{
			channel = await this.chatService.findChannel(payload.channelId);
			await this.chatService.joinChannel(payload.channelId, payload.userId);
		}
		else if (payload.channel_name !== undefined)
			channel = await this.chatService.createGroupChannel({
				ownerId:payload.userId,
				usersId: [payload.userId]
			}, {channel:true});
		else
			throw WsException
		socket.join(channel.id.toString());
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

}
