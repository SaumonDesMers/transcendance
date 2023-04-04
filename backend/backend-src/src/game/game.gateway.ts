import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'net';
import { Server } from 'socket.io'
import { AuthService } from 'src/auth/auth.service';
import { GameService } from './game.service';

@WebSocketGateway({
	namespace: 'game',
	cors: true,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

	constructor(
		private readonly gameService: GameService,
		private readonly authService: AuthService
	) {}

	@WebSocketServer()
	server: Server;

	async afterInit() {
		// console.log("Game gateway initialized")
	}

	async handleConnection(socket: any) {
		// this.server.emit('event', 'connected');
		const jwt = socket.handshake.headers.authorization;

		try {
			await this.authService.verifyJWT(jwt.split(' ')[1]);
		} catch {
			console.log('Error: game.gateway: jwt =', jwt);
			socket.disconnect();
		}

	}

	async handleDisconnect(socket: any) {
		// console.log("Game gateway disconnect")
	}

	@SubscribeMessage('queue')
	async onMessage(@MessageBody() body: any) {
		console.log(body)
	}
}

// un user peut-il avoir plusieurs session ?
// si oui, peut-il faire plusieurs games en simultane ?