import { Injectable } from "@nestjs/common";
import { PlayerEntity } from "./player.entity"
import { GameEntity } from "./game.entity"
import { WsException } from "@nestjs/websockets";
import { Socket } from 'socket.io'
import { BroadcastService } from './broadcast.service'
import { PrismaService } from "src/database/prisma.service";
import { v4 as uuid } from "uuid";
import {
	Prisma,
	User,
	Game,
} from "@prisma/client";
import { QueueService } from "./queue.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class GameService {

	onlinePlayer = new Array<PlayerEntity>();
	reconnectionHub = new Array<PlayerEntity>();
	games = new Array<GameEntity>();

	constructor(
		private readonly broadcastService: BroadcastService,
		private readonly queueService: QueueService,
		private prismaService: PrismaService,
		private eventEmitter: EventEmitter2,
	) {}

	private getPlayerBySocket(socket: Socket): PlayerEntity {
		let player: PlayerEntity = this.onlinePlayer.find(p => { return p.socket == socket; });
		if (player == undefined)
			console.log('Error: game.service: player not found');
		return player;
	}

	private getPlayerById(id: number): PlayerEntity {
		let player: PlayerEntity = this.onlinePlayer.find(p => { return p.id == id; });
		if (player == undefined)
			console.log('Error: game.service: player not found');
		return player;
	}

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
		
		this.onlinePlayer.push(player);
	}

	async disconnection(socket: Socket) {
		let player: PlayerEntity = this.getPlayerBySocket(socket);
		if (!player)
			return;

		if (player.state.value == 'game') {
			// wait some time before delete to let him reconnect
			player.disconnectInGame();
			this.reconnectionHub.push(player);
			setTimeout(this.disconnectionAfterDelay.bind(this), 30 * 1000, player);
		} else if (player.state.value == 'queue') {
			this.queueService.leave(player);
		}
		this.onlinePlayer.splice(this.onlinePlayer.indexOf(player), 1);
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
		let player: PlayerEntity = this.getPlayerBySocket(socket);

		if (body.value == 'join' && player.state.value != 'game') {

			let players = await this.queueService.join(player, body.type);

			if (players) {
				this.createGame(players.p1, players.p2, body.type);
				return 'game';
			}

		} else if (body.value == 'leave') {

			this.queueService.leave(player);

		} else {
			return 'error';
		}
		this.queueService.log();
		return body.value;
	}

	async createUniqueQueue(type: string, playerId: number): Promise<{ success: boolean, error: string, uid?: string }> {
		let player: PlayerEntity = this.getPlayerById(playerId);

		if (!player) {
			console.log('game.service: createUniqueQueue: player not found');
			return { success: false, error: 'player not found' };
		}

		if (player.state.value == 'game') {
			console.log('game.service: createUniqueQueue: player already in game');
			return { success: false, error: 'player already in game' };
		}

		const uid = uuid();
		this.queueService.createUniqueQueue(player, type, uid);

		return { success: true, error: '', uid: uid };
	}

	async joinUniqueQueue(uid: string, playerId: number): Promise<{ success: boolean, error: string }> {
		let player: PlayerEntity = this.getPlayerById(playerId);
		if (!player) {
			console.log('game.service: joinUniqueQueue: player not found');
			return { success: false, error: 'Player not found' };
		}

		if (player.state.value == 'game') {
			console.log(`game.service: joinUniqueQueue: player already in game`);
			return { success: false, error: `Player already in game` };
		}

		const gameData = await this.queueService.joinUniqueQueue(player, uid);

		if (!gameData) {
			return { success: false, error: 'Queue not found' };
		}

		this.createGame(gameData.p1, gameData.p2, gameData.type);

		return { success: true, error: '' };
	}

	async createGame(player_1: PlayerEntity, player_2: PlayerEntity, type: string) {
		this.games.push(new GameEntity(this, this.broadcastService, this.eventEmitter, player_1, player_2, type));
	}

	async playerInput(socket: Socket, input: string) {
		let player: PlayerEntity = this.getPlayerBySocket(socket);

		if (player.state.value == 'game') {
			player.play(input);
		} else {
			console.log('Received player input wihtout a game.')
		}
	}

	async playerSurrender(socket: Socket) {
		let player: PlayerEntity = this.getPlayerBySocket(socket);

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
