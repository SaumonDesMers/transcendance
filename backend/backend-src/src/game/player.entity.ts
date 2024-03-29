import { GameEntity } from "./game.entity";
import { Socket } from 'socket.io'

export class PlayerEntity {

	id: number
	state = {
		value: 'none',
		type: '',
		set(value: string, type: string) {
			this.value = value;
			this.type = type;
		}
	}
	socket: Socket | null
	game: GameEntity | null = null

	constructor(socket: any) {
		this.id = parseInt(socket.data.userId);
		this.socket = socket;
	}

	joinGame(game: GameEntity) {
		if (this.state.value == 'game') {
			// throw new Error('Player cannot join more than one game');
			console.log('Player cannot join more than one game');
			return;
		}

		this.socket?.join(game.UID);
		this.game = game;
		this.state.set('game', game.type);
		console.log(this.id, ": join game");
	}

	leaveGame() {
		if (this.state.value != 'game') {
			// throw new Error('Player cannot leave game (he is not part of one)');
			console.log('Player cannot leave game (he is not part of one)');
			return;
		}

		this.socket?.leave(this.game.UID);
		this.game = null;
		this.state.set('none', '');
		console.log(this.id, ": leave game");
	}

	play(input: string) {
		this.game.playerInput(this, input);
	}

	surrender() {
		this.game.playerSurrender(this);
	}

	disconnectInGame() {
		if (this.state.value != 'game') {
			console.log('player', this.id, 'call \"disconnectInGame\" but is not part of one');
			return;
		}
		this.socket = null;
		this.game.playerDisconnected(this);
	}

	reconnectToGame() {
		if (this.state.value != 'game') {
			console.log('player', this.id, 'call \"reconnectToGame\" but is not part of one');
			return;
		}
		this.socket.join(this.game.UID);
		this.game.playerReconnected(this);
	}

	log() {
		console.log(
			'{ id: ' + this.id
			+ ', state: ' + this.state.value + ' }'
		)
	}

}
