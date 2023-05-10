
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
import { OnEvent } from "@nestjs/event-emitter";
import { Server, Socket  } from 'socket.io';

@WebSocketGateway({
	namespace: 'updates',
	cors : true,
})
export class UpdateGateway implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor() {}

	@WebSocketServer() server: Server =  new Server();

	async handleConnection(@ConnectedSocket() socket: Socket) {

	}

	async handleDisconnect(@ConnectedSocket() socket: any) {

	}

	@OnEvent("user_update")
	updateUser(userId: number)
	{
		this.server.emit("user_update", userId);
	}
}
