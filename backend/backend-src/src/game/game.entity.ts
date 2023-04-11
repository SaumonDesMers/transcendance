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
		paddlePos: {
			x: number,
			y: number,
		},
		moving: string,
		score: number
	}[]

	ball = {
		size: 20,
		pos: {
			x: this.arena.width / 2,
			y: this.arena.height / 2,
		},
		collidePoint(sideNb: number) {
			return {
				x: this.pos.x + (sideNb == 0 ? -this.size: this.size),
				y: this.pos.y
			};
		},
		newStartingOrientation() {
			this.orientation = (Math.random()<0.5?Math.PI:0) + ((Math.random()*2-1) * Math.PI/4);
		},
		orientation: Math.PI / 4, // in radian
		speed: 20,
		lastHit: -1
	}

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
				paddlePos: {
					x: player1_paddlePos_x * this.arena.width,
					y: this.arena.height / 2
				},
				moving: 'none',
				score: 0
			},
			{
				player: player2,
				paddlePos: {
					x: player2_paddlePos_x * this.arena.width,
					y: this.arena.height / 2
				},
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
				{ paddlePos: this.side[0].paddlePos, score: this.side[0].score },
				{ paddlePos: this.side[1].paddlePos, score: this.side[1].score },
			],
			ball: {
				pos: this.ball.pos,
				size: this.ball.size
			},
			pause: this.pause
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
			if (this.ball.pos.x - this.ball.size < 0)
				this.playerScorePoint(RIGHT);
			// reach right
			if (this.ball.pos.x + this.ball.size > this.arena.width)
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
		// update player position
		this.movePlayer(this.side[LEFT]);
		this.movePlayer(this.side[RIGHT]);
		// update ball position
		let ball = this.ball;
		ball.pos.x += ball.speed / 100 * updateInterval * Math.cos(ball.orientation);
		ball.pos.y -= ball.speed / 100 * updateInterval * Math.sin(ball.orientation);
		// bounce up and down
		if (ball.pos.y + ball.size > this.arena.height || ball.pos.y - ball.size < 0)
			ball.orientation = -ball.orientation;
		// bounce on paddle
		this.bounceOnPaddle(LEFT);
		this.bounceOnPaddle(RIGHT);
	}

	private movePlayer(side: any) {
		if (side.moving == "up") {
			side.paddlePos.y = Math.max(side.paddlePos.y - this.paddle.speed / 50 * updateInterval, 0);
		} else if (side.moving == "down") {
			side.paddlePos.y = Math.min(side.paddlePos.y + this.paddle.speed / 50 * updateInterval, this.arena.height);
		}
	}

	private playerScorePoint(n: number) {
		this.side[n].score++;
		this.resetBall();
	}

	private resetBall() {
		this.ball.pos.x = this.arena.width / 2;
		this.ball.pos.y = this.arena.height / 2;
		this.ball.newStartingOrientation();
		this.ball.speed = 20;
		this.ball.lastHit = -1;
	}

	private bounceOnPaddle(sideNb: number) {

		let paddle = this.side[sideNb].paddlePos;
		let ball = this.ball.collidePoint(sideNb);

		if (this.ball.lastHit != sideNb
			&& ball.x < paddle.x + this.paddle.width / 2
			&& ball.x > paddle.x - this.paddle.width / 2
			&& ball.y > paddle.y - this.paddle.height / 2
			&& ball.y < paddle.y + this.paddle.height / 2) {
			
			// compute new orientation with collide point
			let collidePointY = (ball.y - paddle.y) / (this.paddle.height / 2);
			if (sideNb == LEFT)
				this.ball.orientation = -collidePointY * Math.PI / 4;
			else
				this.ball.orientation = Math.PI + collidePointY * Math.PI / 4;

			this.ball.speed += 2;
			this.ball.lastHit = sideNb;
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
		let side = this.side.find(side => side.player.socket.id == player.socket.id);
		side.moving = input;
	}

	async playerSurrender(player: PlayerEntity) {
		let side = this.side.find(side => side.player.socket.id != player.socket.id);
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