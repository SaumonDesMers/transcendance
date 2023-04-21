import { PlayerEntity } from "./player.entity"
import { v4 as uuid } from "uuid";
import { BroadcastService } from './broadcast.service'
import { ConsoleLogger } from "@nestjs/common";

// side
const LEFT = 0;
const RIGHT = 1;

const updateInterval = 10;

const maxScore = 10;

const player1_paddlePos_x = 0.05;
const player2_paddlePos_x = 0.95;

function rad(angle: number): number { return angle * Math.PI / 180; }
function deg(angle: number): number { return angle * 180 / Math.PI; }

function random(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

class Vec2 {
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

}

class Line {

	vector: Vec2;

	constructor(public start: Vec2, public end: Vec2) {
		this.vector = end.sub(start);
	}

	// orthographic projection of point onto line
	project(point: Vec2): Vec2 {
		let v = point.sub(this.start);
		let u = this.vector.normalized;
		return this.start.add(u.mul(v.dot(u)));
	}
}

let pointsArray: Vec2[] = [];
let linesArray: Line[] = [];

class Collider {

	pos: Vec2;

	// x and y are the center of the collider
	constructor(x: number, y: number, public width: number, public height: number, public type: 'rect' | 'circle') {
		// set x and y to the top left corner of the collider
		this.pos = new Vec2(x - width/2, y - height/2);
	}

	get x(): number { return this.pos.x; }
	set x(value: number) { this.pos.x = value; }
	get y(): number { return this.pos.y; }
	set y(value: number) { this.pos.y = value; }
	get center(): Vec2 { return new Vec2(this.x + this.width/2, this.y + this.height/2); }
	set center(value: Vec2) { this.pos = value.sub(new Vec2(this.width/2, this.height/2)); }

	get top(): number { return this.y; }
	get bottom(): number { return this.y + this.height; }
	get left(): number { return this.x; }
	get right(): number { return this.x + this.width; }

	get leftLine(): Line { return new Line(this.topleft, this.bottomleft); }
	get rightLine(): Line { return new Line(this.topright, this.bottomright); }
	get topLine(): Line { return new Line(this.topleft, this.topright); }
	get bottomLine(): Line { return new Line(this.bottomleft, this.bottomright); }

	get topleft(): Vec2 { return new Vec2(this.x, this.y); }
	get topright(): Vec2 { return new Vec2(this.x + this.width, this.y); }
	get bottomleft(): Vec2 { return new Vec2(this.x, this.y + this.height); }
	get bottomright(): Vec2 { return new Vec2(this.x + this.width, this.y + this.height); }

	get lines(): Line[] {
		return [
			new Line(this.topleft, this.topright),
			new Line(this.topright, this.bottomright),
			new Line(this.bottomright, this.bottomleft),
			new Line(this.bottomleft, this.topleft)
		];
	}

	get radius(): number { return this.width/2; }

	collide(other: Collider): boolean {
		if (this.type == 'rect' || other.type == 'circle') {
			console.log('Error: collision from rect or to circle not implemented');
			return false;
		}
		
		let closestPoint = new Vec2(
			Math.max(other.left, Math.min(this.center.x, other.right)),
			Math.max(other.top, Math.min(this.center.y, other.bottom))
		);
		return this.center.sub(closestPoint).length < this.radius;
	}

	collideWithArray(colliders: Collider[]): Collider | null {
		for (let collider of colliders) {
			if (this.collide(collider))
				return collider;
		}
		return null;
	}

	// returns the side of the other collider which is colliding with this collider
	findCollidingSide(other: Collider): string {
		// get the closest corner of this collider to the center of the other collider
		const corners = [this.topleft, this.topright, this.bottomleft, this.bottomright];
		corners.sort((a, b) => a.sub(other.center).length - b.sub(other.center).length);
		let closestCorner = corners[0];

		// get the closest point of the other collider to the closest corner of this collider
		let lines = other.lines;
		let projectedPoint = lines.map(line => line.project(closestCorner));
		projectedPoint.sort((a, b) => a.sub(closestCorner).length - b.sub(closestCorner).length);
		let closestPoint = projectedPoint[0];

		// get the side of the other collider which contains the closest point
		if (closestPoint.x == other.left)
			return "left";
		else if (closestPoint.x == other.right)
			return "right";
		else if (closestPoint.y == other.top)
			return "top";
		else
			return "bottom";
	}
}

class Ball extends Collider {

	initialPos: Vec2;
	initialSpeedNorme: number = 5;

	speed = new Vec2(0, 0);

	lastCollision: Collider | null = null;

	constructor(x: number, y: number, public size: number) {
		super(x, y, size, size, 'circle');
		this.initialPos = new Vec2(x, y);
		this.speed.set(this.initialSpeedNorme, this.newStartingOrientation());
	}

	get radius(): number { return this.size/2; }

	move() {
		this.x = this.x + this.speed.x / 50 * updateInterval;
		this.y = this.y + this.speed.y / 50 * updateInterval;
	}

	bounce(side: string) {
		// if (side == "left" || side == "right") {
		// 	this.speed.x = -this.speed.x;
		// } else if (side == "top" || side == "bottom") {
		// 	this.speed.y = -this.speed.y;
		// }
		if ((side == 'right' && this.speed.x < 0) || (side == 'left' && this.speed.x > 0))
			this.speed.x = -this.speed.x;
		if ((side == 'top' && this.speed.y > 0) || (side == 'bottom' && this.speed.y < 0))
			this.speed.y = -this.speed.y;
	}

	bounceOnPaddle(collider: Collider, side: string) {
		// project the ball's center on the paddle's line
		const line = collider[side + "Line"];
		const projectedPoint = line.project(this.center);

		// get the coordinates of the projected point relative to the paddle's center
		const Y = (projectedPoint.y - collider.center.y) / collider.height;

		// map the Y coordinate to an angle between -PI/4 and PI/4
		const angle = Y * Math.PI / 4;

		// set the ball's speed with the new angle
		this.speed.set(this.speed.length, angle);

		// reverse if bouncing on the left side
		if (side == "left")
			this.speed.x = -this.speed.x;

	}

	reset() {
		this.pos = this.initialPos.copy();
		this.speed.set(this.initialSpeedNorme, this.newStartingOrientation());
	}

	newStartingOrientation(): number {
		return (Math.random()<0.5?Math.PI:0) + ((Math.random()*2-1) * Math.PI/4);
	}

	increaseSpeed() {
		this.speed = this.speed.normed(this.speed.length + 1);
	}

}

class Paddle extends Collider {

	speed: number = 12;
	moving: string = "none";
	
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height, 'rect');
	}

	move() {
		if (this.moving == "up") {
			this.y = this.y - this.speed / 50 * updateInterval
		} else if (this.moving == "down") {
			this.y = this.y + this.speed / 50 * updateInterval
		}
	}
}
class Obstacle extends Collider {

	verticalSpeed: number = 0;
	
	constructor() {
		super(0, 0, 0, 0, 'rect');
		this.randomize();
	}

	update() {
		this.y += this.verticalSpeed / 50 * updateInterval;
		if (this.y < -this.height || this.y > 500) {
			this.randomize();
		}
	}

	randomize() {
		this.width = random(30, 100);
		this.height = random(30, 100);
		this.x = random(200, 600 - this.width);
		this.verticalSpeed = random(2, 5);

		if (random(0, 1) < 0.5) { // top
			this.y = -this.height;
		} else { // bottom
			this.y = 500;
			this.verticalSpeed = -this.verticalSpeed;
		}
	}

}

export class GameEntity {

	UID: string = uuid()

	arena = {
		width: 800,
		height: 500
	}

	side : {
		player: PlayerEntity,
		paddle: Paddle,
		moving: string,
		score: number
	}[]

	ball = new Ball(this.arena.width / 2, this.arena.height / 2, 30);

	obstacles: Obstacle[] = [];

	pause = {
		value: false,
		reason: 'start', // start, goal, end, player_disconnection
		startTime: Date.now(),
		totalTime: 3000,
		timeLeft: 3000
	}

	watchers = new Array<PlayerEntity>()

	updateIntervalId: NodeJS.Timer

	constructor(
		private readonly broadcastService: BroadcastService,
		player1: PlayerEntity, player2: PlayerEntity
	) {
		this.side = [
			{
				player: player1,
				paddle: new Paddle(player1_paddlePos_x * this.arena.width, this.arena.height / 2, 20, 100),
				moving: 'none',
				score: 0
			},
			{
				player: player2,
				paddle: new Paddle(player2_paddlePos_x * this.arena.width, this.arena.height / 2, 20, 100),
				moving: 'none',
				score: 0
			},
		]

		player1.joinGame(this);
		player2.joinGame(this);
		this.broadcastService.to(this.UID, 'start');

		for (let i = 0; i < 5; i++) {
			let obstacle = new Obstacle();
			obstacle.randomize();
			this.obstacles.push(obstacle);
		}

		this.updateIntervalId = setInterval(this.update.bind(this), updateInterval);
	}

	private currentState() {
		const data = {
			arena: this.arena,
			side: [
				...this.side.map(s => { return {
					paddle: {
						pos: s.paddle.pos,
						width: s.paddle.width,
						height: s.paddle.height
					},
					score: s.score
				}})
			],
			ball: {
				pos: this.ball.center,
				radius: this.ball.radius
			},
			obstacles: [
				...this.obstacles.map(o => { return { pos: o.pos, width: o.width, height: o.height }})
			],
			pause: this.pause,
			points: pointsArray,
			lines: linesArray
		};
		pointsArray = [];
		linesArray = [];
		return data;
	}

	private broadcastCurrentState() {
		this.broadcastService.to(this.UID, 'update', this.currentState());
	}

	private async update() {

		if (this.pause.value == false) {

			// update game physics
			this.updatePhysics();

			// reach left
			if (this.ball.left < 0)
				this.playerScorePoint(RIGHT);
			// reach right
			if (this.ball.right > this.arena.width)
				this.playerScorePoint(LEFT);

			this.broadcastCurrentState();
	
			// check for winner
			if (this.side[0].score >= maxScore)
				this.endGame(this.side[0].player);
			else if (this.side[1].score >= maxScore)
				this.endGame(this.side[1].player);

		} else {
			this.updatePause();
		}
		
	}

	private updatePhysics() {
		// update paddles
		this.side[LEFT].paddle.move();
		this.side[RIGHT].paddle.move();

		// update ball
		this.ball.move();
		let bounceOnPaddle = this.checkBallCollision();
		if (bounceOnPaddle) {
			this.ball.increaseSpeed();
		}

		// update obstacles
		this.obstacles.forEach(o => o.update());
		if (this.obstacles.length < 5) {
			let obstacle = new Obstacle();
			obstacle.randomize();
			this.obstacles.push(obstacle);
		}
	}

	private playerScorePoint(n: number) {
		this.side[n].score++;
		this.ball.reset();
	}

	// return if the ball has collided with a paddle
	private checkBallCollision(): boolean {
		// ball bounce up and down
		if (this.ball.top < 0)
			this.ball.bounce('bottom');
		else if (this.ball.bottom > this.arena.height)
			this.ball.bounce('top');
		
		// bounce on paddle
		let bounceOnPaddle = false;

		let collider = this.ball.collideWithArray([
			this.side[LEFT].paddle,
			this.side[RIGHT].paddle,
		]);

		if (collider && collider != this.ball.lastCollision) {
			this.ball.lastCollision = collider;
			const side = this.ball.findCollidingSide(collider);
			this.ball.bounceOnPaddle(collider, side);
			bounceOnPaddle = true;
		}

		// bounce on obstacle
		for (let obstacle of this.obstacles) {
			if (this.ball.collide(obstacle) && obstacle != this.ball.lastCollision) {
				this.ball.lastCollision = obstacle;
				const side = this.ball.findCollidingSide(obstacle);
				this.ball.bounce(side);
				
				// remove obstacle
				this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
			}
		}

		return bounceOnPaddle;
	}

	private updatePause() {
		this.pause.timeLeft = this.pause.totalTime - (Date.now() - this.pause.startTime);

		if (this.pause.timeLeft < 0)
			this.continue();
	}

	private stop(reason: string, time: number) {

		if (reason != 'start' && reason != 'goal' && reason != 'end' && reason != 'player_disconnection') {
			console.log(`game: stop: error: \"${reason}\" is not a valide reason`);
			return;
		}

		this.pause.value = true;
		this.pause.reason = reason;
		this.pause.startTime = Date.now();
		this.pause.totalTime = time;
		this.pause.timeLeft = time;
	}

	private continue() {
		this.pause.value = false;
		this.pause.reason = '';
		this.pause.startTime = 0;
		this.pause.totalTime = 0;
		this.pause.timeLeft = 0;
	}

	private endGame(winner: PlayerEntity) {
		clearInterval(this.updateIntervalId);
		this.broadcastService.to(this.UID, 'end', { winner: winner.id });
		this.side[0].player.leaveGame();
		this.side[1].player.leaveGame();
	}
	
	async playerInput(player: PlayerEntity, input: string) {
		let side = this.side.find(side => side.player.socket?.id == player.socket?.id);
		side.paddle.moving = input;
	}

	async playerSurrender(player: PlayerEntity) {
		let side = this.side.find(side => side.player.socket?.id != player.socket?.id);
		this.endGame(side.player);
		console.log('game: surrender');
	}

	async playerDisconnected(player: PlayerEntity) {
		this.stop('player_disconnection', 30 * 1000);
	}

	async playerReconnected(player: PlayerEntity) {
		player.socket.emit('start');
		this.continue();
	}

}