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
	jwt: string;

	constructor() {
		this.data = reactive(new GameData());
		this.state = reactive(new State());
		this.initSocket();
	}

	connect(jwt: string) {
		if (this.socket.connected)
			return;
		if (jwt)
			this.jwt = jwt;
		this.socket.io.opts.extraHeaders = {
			authorization: `Bearer ${this.jwt}`,
			sessionId: localStorage.sessionId
		};
		this.socket.connect();
	}

	disconnect() {
		this.socket.disconnect();
	}

	initSocket() {
		this.socket = io('http://localhost:3001/game', {
			autoConnect: false,
			reconnection: false
		});
		
		this.socket.on('connect', () => {
			this.state.set('none', '');
		});
		
		this.socket.on('disconnect', this.onDisconnect.bind(this));
		this.socket.on('connect_error', this.onConnectError.bind(this));

		this.socket.on('queue', this.onQueueUpdate.bind(this));

		this.socket.on('start', this.onGameStart.bind(this));
		this.socket.on('update', this.onGameUpdate.bind(this));
		this.socket.on('end', this.onGameEnd.bind(this));

	}

	onDisconnect(reason: string) {
		setTimeout(this.connect.bind(this), 5000);
	}

	onConnectError(error: string) {
		setTimeout(this.connect.bind(this), 5000);
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

	onQueueUpdate(event: any) {
		console.log('queue update');
		this.state.set('queue', event.type);
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