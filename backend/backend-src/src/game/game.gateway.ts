import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	MessageBody,
	ConnectedSocket,
	WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io'
import { AuthService } from 'src/auth/auth.service';
import { GameService } from './game.service';
import { BroadcastService } from './broadcast.service'

@WebSocketGateway({
	namespace: 'game',
	cors: true,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly gameService: GameService,
		private readonly authService: AuthService,
		private readonly broadcastService: BroadcastService,
	) {}

	async afterInit() {
		this.broadcastService.server = this.server;
	}

	async handleConnection(socket: any) {

		// verify jwt
		let payload: any;
		const jwt = socket.handshake.headers.authorization;
		try {
			payload = await this.authService.verifyJWT(jwt.split(' ')[1]);
		} catch {
			console.log('Error: game.gateway: jwt =', jwt);
			// throw new WsException('Invalid credentials.')
			socket.disconnect();
		}

		// attach userId to socket
		socket.userId = payload.sub;

		console.log(socket.userId, ': connect');
		this.gameService.connection(socket);
	}

	async handleDisconnect(socket: any) {
		console.log(socket.userId, ': disconnect');
		await this.gameService.disconnection(socket);
	}

	@SubscribeMessage('queue')
	async onQueue(
		@MessageBody() body: any,
		@ConnectedSocket() socket: any
	) {
		console.log(socket.userId, ': queue :', body);
		return await this.gameService.updateQueue(socket, body);
	}

	@SubscribeMessage('input')
	async onInput(
		@MessageBody() body: any,
		@ConnectedSocket() socket: any
	) {
		console.log(socket.userId, ': input :', body);
		this.gameService.playerInput(socket, body);
	}

	@SubscribeMessage('surrende')
	async onSurrende(
		@ConnectedSocket() socket: any
	) {
		console.log(socket.userId, ': surrende');
		this.gameService.playerSurrende(socket);
	}
}
