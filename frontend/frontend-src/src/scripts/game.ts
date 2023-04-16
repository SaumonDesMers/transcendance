import io, { Socket } from "socket.io-client"

export class Game {

	socket: Socket;
	state: string;
	game: any;
	test: number;

	constructor() {
		this.initSocket();
		this.test = 0;
	}

	inc() {
		this.test++;
	}

	connect(jwt: string) {
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
			this.state = 'none';
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

	joinQueue() {
		this.socket.emit('queue', 'join', res => {
			if (res == 'join') {
				this.state = 'queue';
			}
		});
	}

	leaveQueue() {
		this.socket.emit('queue', 'leave', res => {
			if (res == 'leave') {
				this.state = 'none';
			}
		});
	}
	
	onGameStart(event: any) {
		console.log('game start');
		this.state = 'game';
		window.addEventListener('keydown', this.handleKeydownEvent.bind(this));
		window.addEventListener('keyup', this.handleKeyupEvent.bind(this));
	}

	onGameUpdate(event: any) {
		console.log('game update: test:', this.test);
		this.game = event;
	}
	
	onGameEnd(event: any) {
		console.log('game end');
		this.state = 'none';
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