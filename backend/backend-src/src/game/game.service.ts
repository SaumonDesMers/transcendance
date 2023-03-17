import { Injectable } from "@nestjs/common";
import { PlayerEntity } from "./player.entity"
import { GameEntity } from "./game.entity"
import { WsException } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { BroadcastService } from './broadcast.service'

@Injectable()
export class GameService {

	onlineUser = new WeakMap<any, PlayerEntity>();
	queue = new Array<PlayerEntity>();
	games = new Array<GameEntity>();

	constructor(
		private readonly broadcastService: BroadcastService,
	) {}

	async connection(socket: any) {
		this.onlineUser.set(socket, new PlayerEntity(socket));
	}

	async disconnection(socket: any) {
		let user = this.onlineUser.get(socket);
		if (user.state == 'game') {
			// wait some time before delete to let him reconnect
			user.surrende();
			this.onlineUser.delete(socket);
		} else {
			this.onlineUser.delete(socket);
		}
	}

	async updateQueue(socket: any, msg: string): Promise<string> {
		let user = this.onlineUser.get(socket);

		if (msg == 'join' && user.state == 'none') {
			if (this.queue.length > 0) {
				this.createGame(user, this.queue.pop());
				return 'game';
			} else {
				user.state = 'queue';
				this.queue.push(user);
			}
		} else if (msg == 'leave' && user.state == 'queue') {
			this.queue = this.queue.filter(u => u != user);
			user.state = 'none';
		} else {
			return 'error';
		}
		return msg;
	}

	logQueue() {
		console.log(`Game queue (${this.queue.length} elements):`)
		this.queue.forEach(u => u.log());
	}

	async createGame(player_1: PlayerEntity, player_2: PlayerEntity) {
		this.games.push(new GameEntity(this.broadcastService, player_1, player_2));
	}

	async playerInput(socket: any, input: string) {
		let user = this.onlineUser.get(socket);

		if (user.state == 'game') {
			user.play(input);
		} else {
			console.log('Received user input wihtout a game.')
		}
	}

	async playerSurrende(socket: any) {
		let user = this.onlineUser.get(socket);

		if (user.state == 'game') {
			user.surrende();
		} else {
			console.log('Received user input wihtout a game.')
		}
	}

}
