import { PlayerEntity } from "./player.entity"

export class GameEntity {

	side: {
		player: PlayerEntity,
		paddlePos: number, // in %
		score: number,
	}[] = []

	ball = {
		position: {
			x: 0.5, // in %
			y: 0.5, // in %
		},
		orientation: 0, // in ?
		speed: 1 // in ?
	}

	constructor(player_1: PlayerEntity, player_2: PlayerEntity) {
		this.side = [
			{ player: player_1, paddlePos: 0.5, score: 1 },
			{ player: player_2, paddlePos: 0.5, score: 1 },
		];

		player_1.joinGame(this);
		player_2.joinGame(this);
	}
}