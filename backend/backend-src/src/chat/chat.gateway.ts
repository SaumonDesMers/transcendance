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
import * as fs from 'fs'

const getCircularReplacer = () => {
	const seen = new WeakSet();
	return (key, value) => {
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) {
				return;
			}
			seen.add(value);
		}
		return value;
	};
};

@WebSocketGateway({
	cors: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

	@WebSocketServer()
	server: Server;
	users: number = 0;

	afterInit() {
		// console.log("Chat gateway initialized")
		this.server.on('connection', (socket: any) => {
			console.log(socket.request._query)
		})
	}

	handleConnection(socket: any) {
		this.users++;
		this.server.emit('event', {'type': 'connect'});
	}

	handleDisconnect(socket: any) {
		// console.log("Chat gateway disconnect")
		this.users--;
		this.server.emit('event', {'type': 'disconnect'});
	}

	@SubscribeMessage('message')
	onMessage(@MessageBody() body: any) {
		console.log(body)
		this.server.emit('event', body);
	}
}