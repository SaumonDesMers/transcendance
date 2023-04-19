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
	queue = new Array<PlayerEntity>();
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
			if (player.state == 'game')
				player.reconnectToGame();
		}
		else
			player = new PlayerEntity(socket);
		
		this.onlinePlayer.set(socket, player);
	}

	async disconnection(socket: Socket) {
		let player: PlayerEntity = this.onlinePlayer.get(socket);
		if (player.state == 'game') {
			// wait some time before delete to let him reconnect
			player.disconnectInGame();
			this.reconnectionHub.push(player);
			setTimeout(this.disconnectionAfterDelay.bind(this), 30 * 1000, player);
		} else if (player.state == 'queue') {
			this.queue = this.queue.filter(p => p != player);
		}
		this.onlinePlayer.delete(socket);
	}

	async disconnectionAfterDelay(player: PlayerEntity) {
		if (player.socket != null)
			return;

		this.reconnectionHub = this.reconnectionHub.filter(p => { return p != player });
	}

	async updateQueue(socket: Socket, msg: string): Promise<string> {
		let player: PlayerEntity = this.onlinePlayer.get(socket);

		if (msg == 'join' && player.state == 'none') {
			if (this.queue.length > 0) {
				this.createGame(player, this.queue.pop());
				return 'game';
			} else {
				player.state = 'queue';
				this.queue.push(player);
			}
		} else if (msg == 'leave' && player.state == 'queue') {
			this.queue = this.queue.filter(u => u != player);
			player.state = 'none';
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

	async playerInput(socket: Socket, input: string) {
		let player: PlayerEntity = this.onlinePlayer.get(socket);

		if (player.state == 'game') {
			player.play(input);
		} else {
			console.log('Received player input wihtout a game.')
		}
	}

	async playerSurrender(socket: Socket) {
		let player: PlayerEntity = this.onlinePlayer.get(socket);

		if (player.state == 'game') {
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
