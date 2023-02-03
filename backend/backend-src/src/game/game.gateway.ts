import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io'

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

	@WebSocketServer()
	server: Server;
	users: number = 0;

	afterInit() {
		console.log("GameGateway initialized")
	}

	handleConnection() {
		this.users++;
		this.server.emit('user', this.users);
	}

	handleDisconnect() {
		this.users--;
		this.server.emit('user', this.users);
	}

	@SubscribeMessage('event')
	onGame(@MessageBody() body: any) {
		console.log(body)
		this.server.emit('event', body);
	}
}