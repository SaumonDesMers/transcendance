export class Vec2 {
	
	constructor(public x: number, public y: number) {}

	set(length: number, angle: number) {
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
	}

	copy(): Vec2 { return new Vec2(this.x, this.y); }

	add(other: Vec2): Vec2 { return new Vec2(this.x + other.x, this.y + other.y); }
	sub(other: Vec2): Vec2 { return new Vec2(this.x - other.x, this.y - other.y); }
	mul(scalar: number): Vec2 { return new Vec2(this.x * scalar, this.y * scalar); }
	div(scalar: number): Vec2 { return new Vec2(this.x / scalar, this.y / scalar); }
	dot(other: Vec2): number { return this.x * other.x + this.y * other.y; }
	normed(length: number): Vec2 { return this.normalized.mul(length); }
	get length(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized(): Vec2 { return this.div(this.length); }
	get angle(): number { return Math.atan2(this.y, this.x); }

	angleTo(other: Vec2): number {
		return Math.acos(this.dot(other) / (this.length * other.length));
	}
}

export class Line {
	start: Vec2;
	end: Vec2;

	constructor(start: Vec2, end: Vec2) {
		this.start = start;
		this.end = end;
	}
}

export class Rect {
	pos: Vec2;
	width: number;
	height: number;

	constructor(pos: Vec2, width: number, height: number) {
		this.pos = pos;
		this.width = width;
		this.height = height;
	}
}

export class Ball {
	pos: Vec2;
	radius: number;

	constructor(pos: Vec2, radius: number) {
		this.pos = pos;
		this.radius = radius;
	}
}
export class GameData {

	arena: {
		width: number,
		height: number
	}
	side: {
		playerId: number,
		paddle: Rect,
		score: number
	}[]
	ball: Ball
	obstacles: Rect[]
	pause: {
		enabled: boolean,
		reason: string,
		startTime: number,
		totalTime: number,
		timeLeft: number,
	}
	points: Vec2[];
	lines: Line[];

	constructor() {
		this.arena = { width: 800, height: 500 };
		this.side = [
			{
				playerId: 0,
				paddle: {
					pos: new Vec2(0, 0),
					width: 0,
					height: 0,
				},
				score: 0,
			},
			{
				playerId: 0,
				paddle: {
					pos: new Vec2(0, 0),
					width: 0,
					height: 0,
				},
				score: 0,
			},
		];
		this.ball = { radius: 0, pos: new Vec2(0, 0) };
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