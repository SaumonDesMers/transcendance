import { PlayerEntity } from "./player.entity"
import { v4 as uuid } from "uuid";
import { BroadcastService } from './broadcast.service'

const maxScore = 10;

const player1_paddlePos_x = 0.05;
const player2_paddlePos_x = 0.95;

export class GameEntity {

	UID: string = uuid()

	side : {
		player: PlayerEntity,
		paddlePos: {
			x: number, // in %
			y: number, // in %
		},
		score: number
	}[]

	ball = {
		position: {
			x: 0.5, // in %
			y: 0.5, // in %
		},
		orientation: 0, // in ?
		speed: 1 // in ?
	}

	watchers = new Array<PlayerEntity>()

	constructor(
		private readonly broadcastService: BroadcastService,
		player1: PlayerEntity, player2: PlayerEntity
	) {
		this.side = [
			{ player: player1, paddlePos: { x: player1_paddlePos_x, y: 0.5 }, score: 0 },
			{ player: player2, paddlePos: { x: player2_paddlePos_x, y: 0.5 }, score: 0 },
		]

		player1.joinGame(this);
		player2.joinGame(this);
		this.broadcastService.to(this.UID, 'start');

		setInterval(this.broadcastCurrentState, 100, this)
	}

	currentState() {
		return {
			side: [
				{ paddlePos: this.side[0].paddlePos, score: this.side[0].score },
				{ paddlePos: this.side[1].paddlePos, score: this.side[1].score },
			],
			ball: this.ball
		}
	}

	broadcastCurrentState(game: GameEntity) {
		// console.log(game.UID, 'broadcast current state');
		game.broadcastService.to(game.UID, 'update', game.currentState());
	}

	async update() {}

	async playerInput(player: PlayerEntity, input: string) {
		let side = this.side.find(side => side.player.socket.id == player.socket.id);
		// console.log('game: input:', input);
		if (side.paddlePos.y > 0 && input == "up") {
			side.paddlePos.y -= 0.05;
		} else if (side.paddlePos.y < 1 && input == "down") {
			side.paddlePos.y += 0.05;
		}
	}

	async playerSurrende(player: PlayerEntity) {
		let side = this.side.find(side => side.player.socket.id != player.socket.id);
		this.endGame(side.player);
		console.log('game: surrende');
	}

	async endGame(winner: PlayerEntity) {
		this.broadcastService.to(this.UID, 'end');
		this.side[0].player.leaveGame();
		this.side[1].player.leaveGame();
	}

	async addWatcher(watcher: PlayerEntity) {

	}
}