import { PlayerEntity } from "./player.entity"
import { v4 as uuid } from "uuid";
import { BroadcastService } from './broadcast.service'

const maxScore = 10;

const player_1_paddlePos_x = 0.1;
const player_2_paddlePos_x = 0.9;

export class GameEntity {

	UID: string = uuid()

	side = new WeakMap<PlayerEntity,
		{
			paddlePos: {
				x: number, // in %
				y: number, // in %
			},
			score: number
		}
	>()

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
		player_1: PlayerEntity, player_2: PlayerEntity
	) {
		this.side.set(player_1, { paddlePos: { x: player_1_paddlePos_x, y: 0.5 }, score: 0 });
		this.side.set(player_2, { paddlePos: { x: player_2_paddlePos_x, y: 0.5 }, score: 0 });

		player_1.joinGame(this);
		player_2.joinGame(this);

		console.log('Game '+this.UID);

			this.broadcastCurrentState();
	}

	currentState() {
		return {
			side: [ this.side[0], this.side[1] ],
			ball: this.ball
		}
	}

	broadcastCurrentState() {
		console.log(this.UID, 'broadcast current state')
		this.broadcastService.to(this.UID, 'gameUpdate', this.currentState());
		setTimeout(this.broadcastCurrentState, 1000);
	}

	async update() {

	}

	async endGame() {
		this.side[0].leaveGame();
		this.side[1].leaveGame();
	}

	async addWatcher(watcher: PlayerEntity) {

	}
}