
class vec2 {
	x: number;
	y: number;
}
export class GameData {

	arena: {
		width: number,
		height: number
	}
	side: {
		paddle: {
			pos: vec2,
			width: number,
			height: number,
		},
		score: number
	}[]
	ball: {
		radius: number,
		pos: vec2,
	}
	obstacles: {
		pos: vec2,
		width: number,
		height: number,
	}[]
	pause: {
		enabled: boolean,
		reason: string,
		startTime: number,
		totalTime: number,
		timeLeft: number,
	}
	points: vec2[];
	lines: { pos1: vec2, pos2: vec2}[];

	constructor() {
		this.arena = { width: 800, height: 500 };
		this.side = [
			{
				paddle: {
					pos: { x: 0, y: 0 },
					width: 0,
					height: 0,
				},
				score: 0,
			},
			{
				paddle: {
					pos: { x: 0, y: 0 },
					width: 0,
					height: 0,
				},
				score: 0,
			},
		];
		this.ball = { radius: 30, pos: { x: this.arena.width / 2, y: this.arena.height / 2 } };
		this.pause = { enabled: false, reason: '', startTime: 0, totalTime: 0, timeLeft: 0 };
		this.obstacles = [];
		this.points = [];
		this.lines = [];
	}

	update(newData: GameData) {
		this.arena = newData.arena;
		this.side = newData.side;
		this.ball = newData.ball;
		this.pause = newData.pause;
		this.points = newData.points;
		this.lines = newData.lines;
		this.obstacles = newData.obstacles;
	}
}