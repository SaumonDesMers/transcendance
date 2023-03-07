import { GameEntity } from "./game.entity";

export class PlayerEntity {

	id: number
	state: string = 'none'
	sockets: Array<any> = []
	game: GameEntity | null = null

	constructor(userId: number) {
		this.id = userId;
	}

	joinGame(game: GameEntity) {
		if (this.state != 'game') {
			this.game = game;
			this.state = 'game';
		} else {
			throw new Error('Player cannot join more than one game');
		}
	}

	leaveGame() {
		if (this.state == 'game') {
			this.state = 'none';
		} else {
			throw new Error('Player cannot leave game (he is not part of one)');
		}
	}

	log() {
		console.log(
			'{ id: ' + this.id
			+ ', state: ' + this.state
			+ ', sockets_nb: ' + this.sockets.length + ' }'
		)
	}

}