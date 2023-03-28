import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from "@nestjs/websockets";	

import { Server,
		Socket } from 'socket.io'
import { CreateMessageDto } from "./message.create.dto";
import { ChatService } from "./Chat.service";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { Channel, GroupChannel } from "@prisma/client";
import { Public } from "src/auth/public.decorator";

@Public()
@WebSocketGateway(
	{namespace: "chat"}
)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(private chatService: ChatService) {}

	@WebSocketServer() server: Server = new Server();

	async handleConnection(socket: Socket) {
		
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
}
