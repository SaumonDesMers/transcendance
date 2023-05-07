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
import { Server, Socket } from 'socket.io'
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

	async handleConnection(socket: Socket) {

		// verify jwt
		let payload: any;
		const jwt = socket.handshake.headers.authorization;
		try {
			payload = await this.authService.verifyJWT(jwt.split(' ')[1]);
		} catch {
			console.log('Error: game.gateway: jwt =', jwt);
			socket.disconnect();
			return;
		}

		console.log('game.gateway: session =', socket.handshake.headers.sessionid);

		// attach userId to socket
		socket.data.userId = payload.id;

		console.log(socket.data.userId, ': connect to game');
		this.gameService.connection(socket);
	}

	async handleDisconnect(socket: any) {
		await this.gameService.disconnection(socket);
	}

	@SubscribeMessage('queue')
	async onQueue(
		@MessageBody() body: any,
		@ConnectedSocket() socket: Socket
	) {
		console.log(socket.data.userId, ': queue :', body);
		return await this.gameService.updateQueue(socket, body);
	}

	@SubscribeMessage('input')
	async onInput(
		@MessageBody() body: any,
		@ConnectedSocket() socket: Socket
	) {
		// console.log(socket.data.userId, ': input :', body);
		this.gameService.playerInput(socket, body);
	}

	@SubscribeMessage('surrender')
	async onSurrender(
		@ConnectedSocket() socket: Socket
	) {
		console.log(socket.data.userId, ': surrender');
		this.gameService.playerSurrender(socket);
	}
}
