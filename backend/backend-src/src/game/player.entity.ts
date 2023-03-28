import { GameEntity } from "./game.entity";

export class PlayerEntity {

	id: number
	state: string = 'none'
	socket: any
	game: GameEntity | null = null

	constructor(socket: any) {
		this.id = socket.userId;
		this.socket = socket;
	}

	joinGame(game: GameEntity) {
		if (this.state != 'game') {
			this.socket.join(game.UID);
			this.game = game;
			this.state = 'game';
			console.log(this.id, ": join game");
		} else {
			// throw new Error('Player cannot join more than one game');
			console.log('Player cannot join more than one game');
		}
	}

	leaveGame() {
		if (this.state == 'game') {
			this.socket.leave(this.game.UID);
			this.game = null;
			this.state = 'none';
			console.log(this.id, ": leave game");
		} else {
			// throw new Error('Player cannot leave game (he is not part of one)');
			console.log('Player cannot leave game (he is not part of one)');
		}
	}

	play(input: string) {
		this.game.playerInput(this, input);
	}

	surrender() {
		this.game.playerSurrender(this);
	}

	log() {
		console.log(
			'{ id: ' + this.id
			+ ', state: ' + this.state + ' }'
		)
	}

}