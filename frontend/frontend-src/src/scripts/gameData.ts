
import { Vec2, Rect } from './utils';
export class GameData {

	arena: {
		width: number,
		height: number
	}
	side: {
		paddle: Rect,
		score: number
	}[]
	ball: {
		radius: number,
		pos: Vec2,
	}
	obstacles: Rect[]
	pause: {
		enabled: boolean,
		reason: string,
		startTime: number,
		totalTime: number,
		timeLeft: number,
	}
	points: Vec2[];
	lines: { pos1: Vec2, pos2: Vec2}[];

	constructor() {
		this.arena = { width: 800, height: 500 };
		this.side = [
			{
				paddle: {
					pos: new Vec2(0, 0),
					width: 0,
					height: 0,
				},
				score: 0,
			},
			{
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