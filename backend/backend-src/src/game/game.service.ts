import { Injectable } from "@nestjs/common";
import { PlayerEntity } from "./player.entity"
import { GameEntity } from "./game.entity"
import { WsException } from "@nestjs/websockets";
import { Socket } from 'socket.io'
import { BroadcastService } from './broadcast.service'
import { PrismaService } from "src/database/prisma.service";
import {
	Prisma,
	User,
	Game,
} from "@prisma/client";

@Injectable()
export class GameService {

	onlinePlayer = new WeakMap<any, PlayerEntity>();
	reconnectionHub = new Array<PlayerEntity>();
	// queue = new Array<PlayerEntity>();
	queue = {
		classic: new Array<PlayerEntity>(),
		custom: new Array<PlayerEntity>(),
	}
	games = new Array<GameEntity>();

	constructor(
		private readonly broadcastService: BroadcastService,
		private prismaService: PrismaService,
	) {}

	async connection(socket: Socket) {
		// check for existing player waiting for reconnection
		let player: PlayerEntity = this.reconnectionHub.find(p => { return p.id == socket.data.userId; });

		if (player) {
			this.reconnectionHub = this.reconnectionHub.filter(p => { return p != player });
			player.socket = socket;
			if (player.state.value == 'game')
				player.reconnectToGame();
		}
		else
			player = new PlayerEntity(socket);
		
		this.onlinePlayer.set(socket, player);
	}

	async disconnection(socket: Socket) {
		let player: PlayerEntity = this.onlinePlayer.get(socket);
		if (player.state.value == 'game') {
			// wait some time before delete to let him reconnect
			player.disconnectInGame();
			this.reconnectionHub.push(player);
			setTimeout(this.disconnectionAfterDelay.bind(this), 30 * 1000, player);
		} else if (player.state.value == 'queue') {
			this.queue[player.state.type] = this.queue[player.state.type].filter((p: PlayerEntity) => p != player);
		}
		this.onlinePlayer.delete(socket);
	}

	async disconnectionAfterDelay(player: PlayerEntity) {
		if (player.socket != null)
			return;

		if (player.state.value == 'game') {
			player.surrender();
		}

		this.reconnectionHub = this.reconnectionHub.filter(p => { return p != player });
	}

	async updateQueue(socket: Socket, body: { value: string, type: string }): Promise<string> {
		let player: PlayerEntity = this.onlinePlayer.get(socket);
		let queue = this.queue[body.type];

		if (body.value == 'join' && player.state.value == 'none') {
			if (this.queue[body.type].length > 0) {
				this.createGame(player, this.queue[body.type].pop(), body.type);
				return 'game';
			} else {
				player.state.set('queue', body.type);
				this.queue[body.type].push(player);
			}
		} else if (body.value == 'leave' && player.state.value == 'queue') {
			this.queue[body.type] = this.queue[body.type].filter((p: PlayerEntity) => p != player);
			player.state.set('none', '');
		} else {
			return 'error';
		}
		return body.value;
	}

	logQueue() {
		for (let [key, value] of Object.entries(this.queue)) {
			console.log(`Game ${key} queue (${value.length} elements):`);
			value.forEach(u => u.log());
		}
	}

	async createGame(player_1: PlayerEntity, player_2: PlayerEntity, type: string) {
		this.games.push(new GameEntity(this, this.broadcastService, player_1, player_2, type));
	}

	async playerInput(socket: Socket, input: string) {
		let player: PlayerEntity = this.onlinePlayer.get(socket);

		if (player.state.value == 'game') {
			player.play(input);
		} else {
			console.log('Received player input wihtout a game.')
		}
	}

	async playerSurrender(socket: Socket) {
		let player: PlayerEntity = this.onlinePlayer.get(socket);

		if (player.state.value == 'game') {
			player.surrender();
		} else {
			console.log('Received player input wihtout a game.')
		}
	}

	async saveGame(winnerId: number, loserId: number, winnerScore: number, loserScore: number)
	{
		this.prismaService.game.create({
			data: {
				loser: {
					connect : {
						id:loserId
					}
				},
				winner: {
					connect: {id:winnerId
					}
				},
				LoserScore: loserScore,
				winnerScore: winnerScore
			}
		});

	}
}
