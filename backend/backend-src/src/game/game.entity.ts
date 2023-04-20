import { PlayerEntity } from "./player.entity"
import { v4 as uuid } from "uuid";
import { BroadcastService } from './broadcast.service'

// side
const LEFT = 0;
const RIGHT = 1;

const updateInterval = 10;

const maxScore = 10;

const player1_paddlePos_x = 0.05;
const player2_paddlePos_x = 0.95;

function rad(angle: number): number { return angle * Math.PI / 180; }
function deg(angle: number): number { return angle * 180 / Math.PI; }

class Vec2 {
	constructor(public x: number, public y: number) {}

	add(other: Vec2): Vec2 { return new Vec2(this.x + other.x, this.y + other.y); }
	sub(other: Vec2): Vec2 { return new Vec2(this.x - other.x, this.y - other.y); }
	mul(scalar: number): Vec2 { return new Vec2(this.x * scalar, this.y * scalar); }
	div(scalar: number): Vec2 { return new Vec2(this.x / scalar, this.y / scalar); }
	get length(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized(): Vec2 { return this.div(this.length); }
	get angle(): number { return Math.atan2(this.y, this.x); }
}

class Collider {

	// x and y are the center of the collider
	constructor(public x: number, public y: number, public width: number, public height: number, public type: 'rect' | 'circle') {
		// set x and y to the top left corner of the collider
		this.x = x - width/2;
		this.y = y - height/2;
	}

	get pos(): Vec2 { return new Vec2(this.x, this.y); }
	get center(): Vec2 { return new Vec2(this.x + this.width/2, this.y + this.height/2); }

	get top(): number { return this.y; }
	get bottom(): number { return this.y + this.height; }
	get left(): number { return this.x; }
	get right(): number { return this.x + this.width; }

	get topleft(): Vec2 { return new Vec2(this.x, this.y); }
	get topright(): Vec2 { return new Vec2(this.x + this.width, this.y); }
	get bottomleft(): Vec2 { return new Vec2(this.x, this.y + this.height); }
	get bottomright(): Vec2 { return new Vec2(this.x + this.width, this.y + this.height); }

	get radius(): number { return this.width/2; }

	collide(other: Collider): boolean {
		if (this.type == 'rect' && other.type == 'rect') {
			return this.collideRectRect(other);
		} else if (this.type == 'rect' && other.type == 'circle') {
			return this.collideRectCircle(other);
		} else if (this.type == 'circle' && other.type == 'rect') {
			return other.collideRectCircle(this);
		} else if (this.type == 'circle' && other.type == 'circle') {
			return this.collideCircleCircle(other);
		}
	}

	collideRectRect(other: Collider): boolean {
		return (this.right > other.left
			&& this.left < other.right
			&& this.bottom > other.top
			&& this.top < other.bottom);
	}

	// other is a circle
	collideRectCircle(other: Collider): boolean {
		let closestPoint = new Vec2(
			Math.max(this.left, Math.min(other.center.x, this.right)),
			Math.max(this.top, Math.min(other.center.y, this.bottom))
		);
		return other.center.sub(closestPoint).length < other.radius;
	}

	collideCircleCircle(other: Collider): boolean {
		return this.center.sub(other.center).length < this.radius + other.radius;
	}

	collideWithArray(colliders: Collider[]): Collider | null {
		for (let collider of colliders) {
			if (this.collide(collider)) {
				return collider;
			}
		}
		return null;
	}

	findCollidingSide(other: Collider): string {
		// retreive the side of collision by comparing the angle of the center of the other collider to the angle of the corners of the other collider
		let angle = this.center.sub(other.center).angle;
		let topleftAngle = other.topleft.sub(other.center).angle;
		let toprightAngle = other.topright.sub(other.center).angle;
		let bottomleftAngle = other.bottomleft.sub(other.center).angle;
		let bottomrightAngle = other.bottomright.sub(other.center).angle;

		if (angle > topleftAngle && angle < toprightAngle) {
			return "bottom";
		} else if (angle > toprightAngle && angle < bottomrightAngle) {
			return "left";
		} else if (angle > bottomrightAngle && angle < bottomleftAngle) {
			return "top";
		} else {
			return "right";
		}
	}
}

class Ball extends Collider {

	initialPos: Vec2;
	initialSpeed: number = 5;

	orientation: number;
	speed: number = this.initialSpeed;

	constructor(x: number, y: number, public size: number) {
		super(x, y, size, size, 'circle');
		this.initialPos = new Vec2(x, y);
		this.newStartingOrientation();
	}

	get radius(): number { return this.size/2; }

	move() {
		this.x = this.x + Math.cos(this.orientation) * this.speed / 50 * updateInterval;
		this.y = this.y + Math.sin(this.orientation) * this.speed / 50 * updateInterval;
	}

	bounce(side: string) {
		if (side == "left" || side == "right") {
			this.orientation = Math.PI - this.orientation;
		} else if (side == "top" || side == "bottom") {
			this.orientation = -this.orientation;
		}
	}

	reset() {
		this.x = this.initialPos.x;
		this.y = this.initialPos.y;
		this.speed = this.initialSpeed;
		this.newStartingOrientation();
	}

	newStartingOrientation() {
		// this.orientation = (Math.random()<0.5?Math.PI:0) + ((Math.random()*2-1) * Math.PI/4);
		this.orientation = 0;
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
		// this.speed += 2;
	}
}
class Obstacle extends Collider {
	
	constructor(public x: number, public y: number, public width: number, public height: number) {
		super(x, y, width, height, 'rect');
	}
}

export class GameEntity {

	UID: string = uuid()

	arena = {
		width: 800,
		height: 500
	}

	paddle = {
		width: 20,
		height: 100,
		speed: 12,
	}

	side : {
		player: PlayerEntity,
		paddle: Paddle,
		moving: string,
		score: number
	}[]

	ball = new Ball(this.arena.width / 2, this.arena.height / 2, 30);

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

		this.updateIntervalId = setInterval(this.update.bind(this), updateInterval);
	}

	private currentState() {
		return {
			arena: this.arena,
			paddle: this.paddle,
			side: [
				{ paddlePos: this.side[0].paddle.pos, score: this.side[0].score },
				{ paddlePos: this.side[1].paddle.pos, score: this.side[1].score },
			],
			ball: {
				pos: this.ball.center,
				radius: this.ball.radius
			},
			pause: this.pause,
			points: [
				this.ball.topleft, this.ball.topright, this.ball.bottomleft, this.ball.bottomright,
				this.side[0].paddle.topleft, this.side[0].paddle.topright, this.side[0].paddle.bottomleft, this.side[0].paddle.bottomright,
				this.side[1].paddle.topleft, this.side[1].paddle.topright, this.side[1].paddle.bottomleft, this.side[1].paddle.bottomright,
			],
			lines: [
				{ pos1: this.ball.topleft, pos2: this.ball.center },
				{ pos1: this.ball.topright, pos2: this.ball.center },
				{ pos1: this.ball.bottomleft, pos2: this.ball.center },
				{ pos1: this.ball.bottomright, pos2: this.ball.center },

				{ pos1: this.side[0].paddle.center, pos2: this.ball.center },
			]
		}
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
		this.side[LEFT].paddle.move();
		this.side[RIGHT].paddle.move();
		this.ball.move();
		this.checkBallCollision();
	}

	private playerScorePoint(n: number) {
		this.side[n].score++;
		this.ball.reset();
	}

	private checkBallCollision() {
		// ball bounce up and down
		if (this.ball.top < 0 || this.ball.bottom > this.arena.height)
			this.ball.orientation = -this.ball.orientation;

		// bounce on paddle
		const collider = this.ball.collideWithArray([
			this.side[LEFT].paddle,
			this.side[RIGHT].paddle,
		]);
		if (collider != null) {
			console.log('collide');
			const side = this.ball.findCollidingSide(collider);
			this.ball.bounce(side);
		}
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