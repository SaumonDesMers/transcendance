import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";	

import { Server,
		Socket } from 'socket.io'
import { CreateMessageDto } from "./message.create.dto";
import { ChatService } from "./Chat.service";
import { CreateGroupChannelDto } from "./GroupChannel.create.dto";
import { Channel, GroupChannel } from "@prisma/client";

export class ChatGateway {
	constructor(private chatService: ChatService) {}

	@WebSocketServer() server: Server = new Server();



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
		if (payload.channelId)
			channel = await this.chatService.findChannel(payload.channelId);
		else
			channel = await this.chatService.createGroupChannel({
				ownerId:payload.userId,
				usersId: null
			}, {channel:true});

		socket.join(channel.id.toString());
	}
}
