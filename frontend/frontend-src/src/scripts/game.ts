import io, { Socket } from "socket.io-client"
import { reactive } from "vue";
import { GameData } from "./gameData";

class State {
	value: string;
	type: string;
	constructor() {
		this.value = 'none';
		this.type = '';
	}

	set(value: string, type: string) {
		this.value = value;
		this.type = type;
	}
}

export class Game {

	socket: Socket;
	state: State;
	data: GameData;

	constructor() {
		this.data = reactive(new GameData());
		this.state = reactive(new State());
		this.initSocket();
	}

	connect(jwt: string) {
		if (this.socket.connected)
			return;
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${jwt}`
		};
		this.socket.connect();
	}

	initSocket() {
		this.socket = io('http://localhost:3001/game', {
			autoConnect: false
		});
		
		this.socket.on('connect', () => {
			console.log("Successfully connected to the game websocket server...");
			this.state.set('none', '');
		});
		
		this.socket.on('disconnect', function(reason) {
			console.log("Connection to the game websocket server closed: ", reason);
		});
		
		this.socket.on('connect_error', function(error) {
			console.log("Error connecting to the game websocket server: ", error);
		});

		this.socket.on('start', this.onGameStart.bind(this));
		this.socket.on('update', this.onGameUpdate.bind(this));
		this.socket.on('end', this.onGameEnd.bind(this));

	}

	joinQueue(type: string) {
		this.socket.emit('queue', {
			value: 'join',
			type: type
		}, (res: any) => {
			if (res == 'join') {
				this.state.set('queue', type);
			}
		});
	}

	leaveQueue() {
		this.socket.emit('queue', {
			value: 'leave',
			type: this.state.type
		}, (res: any) => {
			if (res == 'leave') {
				this.state.set('none', '');
			}
		});
	}
	
	onGameStart(event: any) {
		console.log('game start');
		this.state.value = 'game';
		window.addEventListener('keydown', this.handleKeydownEvent.bind(this));
		window.addEventListener('keyup', this.handleKeyupEvent.bind(this));
	}

	onGameUpdate(event: GameData) {
		console.log('game update');
		this.data.update(event);
	}
	
	onGameEnd(event: any) {
		console.log('game end');
		this.state.value = 'none';
		window.removeEventListener('keydown', this.handleKeydownEvent.bind(this));
		window.removeEventListener('keyup', this.handleKeyupEvent.bind(this));
	}

	surrender() {
		this.socket.emit('surrender');
	}

	handleKeydownEvent(e: KeyboardEvent) {
		// console.log('key:', e.key);
		if (e.key == 'ArrowUp') {
			this.socket.emit('input', 'up');
		} else if (e.key == 'ArrowDown') {
			this.socket.emit('input', 'down');
		}
	}

	handleKeyupEvent(e: KeyboardEvent) {
		// console.log('key:', e.key);
		if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
			this.socket.emit('input', 'none');
		}
	}
}

export default reactive<Game>(new Game());