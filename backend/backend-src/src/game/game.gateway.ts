import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io'

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	users: number = 0;

	handleConnection() {
		// A client has connected
		this.users++;

		// Notify connected clients of current users
		this.server.emit('game', this.users);
	}

	handleDisconnect() {
		// A client has disconnected
		this.users--;

		// Notify connected clients of current users
		this.server.emit('game', this.users);
	}

	@SubscribeMessage('game')
	onGame(@MessageBody() body: any) {
		console.log(body)
		// client.broadcast.emit('game', message);
	}
}