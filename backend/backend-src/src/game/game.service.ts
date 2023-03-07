import { Injectable } from "@nestjs/common";
import { PlayerEntity } from "./player.entity"
import { GameEntity } from "./game.entity"

@Injectable()
export class GameService {
	onlineUser = new Map<number, PlayerEntity>();
	queue = new Array<PlayerEntity>();
	games = new Array<GameEntity>();

	async connection(socket: any) {
		let user = this.onlineUser.get(socket.userId);

		if (user === undefined) {
			// create user in onlineUser
			this.onlineUser.set(socket.userId, new PlayerEntity(socket.userId));
			user = this.onlineUser.get(socket.userId);
		}
		user.sockets.push(socket);
		user.log()
	}

	async disconnection(socket: any) {
		let user = this.onlineUser.get(socket.userId);
		if (user.state == 'game') {
			// wait some time before delete to let him reconnect
			this.onlineUser.delete(socket.userId);
		} else {
			this.onlineUser.delete(socket.userId);
		}
		user.log()
	}

	async updateQueue(socket: any, msg: string) {
		let user = this.onlineUser.get(socket.userId);

		if (msg == 'join' && user.state == 'none') {
			if (this.queue.length > 0) {
				this.createGame(user, this.queue.pop());
			} else {
				user.state = 'queue';
				this.queue.push(user);
			}
		} else if (msg == 'leave' && user.state == 'queue') {
			this.queue = this.queue.filter(u => u != user);
			user.state = 'none';
		}
		this.logQueue()
	}

	async createGame(player_1: PlayerEntity, player_2: PlayerEntity) {
		this.games.push(new GameEntity(player_1, player_2));
	}

	logQueue() {
		console.log(`Game queue (${this.queue.length} elements):`)
		this.queue.forEach(u => u.log());
	}
}
