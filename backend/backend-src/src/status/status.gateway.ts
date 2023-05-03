import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { GameService } from '../game/game.service'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service';
import { playerStatus } from './status.events'

@WebSocketGateway({
	namespace: "status"
})
export class StatusGateway {
	constructor(
		private authService: AuthService
	){
		this.playersStatus = new Map();
	};

	private playersStatus: Map<number, playerStatus>;

	@WebSocketServer() server: Server = new Server();

	async handleConnection(@ConnectedSocket() socket: Socket) {
		let payload : any;
		let jwt : string = socket.handshake.headers.authorization;
		try {
			payload = await this.authService.verifyJWT(jwt.split(' ')[1]);
			socket.data.userId = parseInt(payload.id);
		}
		catch (e) {
			console.log("ERROR WHILE CONNECTING");
			console.log(e);
			socket.disconnect(true);
			return;
		}
		this.playersStatus.set(socket.data.userId, playerStatus.ONLINE);
		this.server.emit("update", {userId: socket.data.userId, status: playerStatus.ONLINE});
	}

	async handleDisconnect(@ConnectedSocket() socket: Socket) {
		if (socket.data.userId != undefined)
		{
			this.playersStatus.delete(socket.data.userId);
			this.server.emit("update", {userId: socket.data.userId, status: playerStatus.OFFLINE});
		}
	}

	@SubscribeMessage('getStatus')
	async onGetStatus(
		@MessageBody() userId: number,
		@ConnectedSocket() socket: Socket
	)
	{
		const status = this.playersStatus.get(userId);

		if (status == undefined)
			return playerStatus.OFFLINE;
		else
			return status;
	}

}
