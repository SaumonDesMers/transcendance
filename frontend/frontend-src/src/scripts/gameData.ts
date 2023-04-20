export class GameData {

	arena: {
		width: number,
		height: number
	}
	paddle: {
		width: number,
		height: number,
		speed: number,
	}
	side: {
		paddlePos: {
			x: number,
			y: number,
		},
		score: number
	}[]
	ball: {
		radius: number,
		pos: {
			x: number,
			y: number,
		},
	}
	pause: {
		enabled: boolean,
		reason: string,
		startTime: number,
		totalTime: number,
		timeLeft: number,
	}
	points: { x: number, y: number }[];
	lines: { pos1: { x: number, y: number }, pos2: { x: number, y: number }}[];

	constructor() {
		this.arena = { width: 800, height: 500 };
		this.paddle = { width: 20, height: 100, speed: 12 };
		this.side = [
			{ paddlePos: { x: 0.05, y: 0.5 }, score: 0 },
			{ paddlePos: { x: 0.95, y: 0.5 }, score: 0 },
		];
		this.ball = { radius: 30, pos: { x: this.arena.width / 2, y: this.arena.height / 2 } };
		this.pause = { enabled: false, reason: '', startTime: 0, totalTime: 0, timeLeft: 0 };
		this.points = [];
		this.lines = [];
	}

	update(newData: GameData) {
		this.arena = newData.arena;
		this.paddle = newData.paddle;
		this.side = newData.side;
		this.ball = newData.ball;
		this.pause = newData.pause;
		this.points = newData.points;
		this.lines = newData.lines;
	}
}