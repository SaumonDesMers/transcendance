import { PlayerEntity } from "./player.entity"
import { v4 as uuid } from "uuid";
import { BroadcastService } from './broadcast.service'

const LEFT = 0;
const RIGHT = 1;

const updateInterval = 10;

const maxScore = 10;

const player1_paddlePos_x = 0.05;
const player2_paddlePos_x = 0.95;

function degrees_to_radians(degrees: number)
{
	return degrees * Math.PI / 180;
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
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
		speed: 10,
	}

	side : {
		player: PlayerEntity,
		paddlePos: {
			x: number,
			y: number,
		},
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
				score: 0
			},
			{
				player: player2,
				paddlePos: {
					x: player2_paddlePos_x * this.arena.width,
					y: this.arena.height / 2
				},
				score: 0
			},
		]

		player1.joinGame(this);
		player2.joinGame(this);
		this.broadcastService.to(this.UID, 'start');

		this.updateIntervalId = setInterval(this.update, updateInterval, this);
	}

	currentState() {
		return {
			arena: this.arena,
			paddle: this.paddle,
			side: [
				{ paddlePos: this.side[0].paddlePos, score: this.side[0].score },
				{ paddlePos: this.side[1].paddlePos, score: this.side[1].score },
			],
			ball: this.ball
		}
	}

	broadcastCurrentState() {
		this.broadcastService.to(this.UID, 'update', this.currentState());
	}

	async update(game: GameEntity) {
		// update ball position
		let ball = game.ball;
		ball.pos.x += ball.speed / 100 * updateInterval * Math.cos(ball.orientation);
		ball.pos.y -= ball.speed / 100 * updateInterval * Math.sin(ball.orientation);
		// bounce up and down
		if (ball.pos.y + ball.size > game.arena.height || ball.pos.y - ball.size < 0)
			ball.orientation = -ball.orientation;
		// reach left
		if (ball.pos.x - ball.size < 0)
			game.playerScorePoint(RIGHT);
		// reach right
		if (ball.pos.x + ball.size > game.arena.width)
			game.playerScorePoint(LEFT);
		// bounce on paddle
		game.bounceOnPaddle(LEFT);
		game.bounceOnPaddle(RIGHT);

		game.broadcastCurrentState();

		// check for winner
		if (game.side[0].score >= maxScore)
			game.endGame(game.side[0].player);
		else if (game.side[1].score >= maxScore)
			game.endGame(game.side[1].player);
	}

	playerScorePoint(n: number) {
		this.side[n].score++;
		this.resetBall();
	}

	resetBall() {
		this.ball.pos.x = this.arena.width / 2;
		this.ball.pos.y = this.arena.height / 2;
		this.ball.newStartingOrientation();
		this.ball.speed = 20;
		this.ball.lastHit = -1;
	}

	bounceOnPaddle(sideNb: number) {

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

			this.ball.speed++;
			this.ball.lastHit = sideNb;
		}
	}

	async playerInput(player: PlayerEntity, input: string) {
		let side = this.side.find(side => side.player.socket.id == player.socket.id);
		if (input == "up") {
			side.paddlePos.y = Math.max(side.paddlePos.y - this.paddle.speed, 0);
		} else if (input == "down") {
			side.paddlePos.y = Math.min(side.paddlePos.y + this.paddle.speed, this.arena.height);
		}
	}

	async playerSurrender(player: PlayerEntity) {
		let side = this.side.find(side => side.player.socket.id != player.socket.id);
		this.endGame(side.player);
		console.log('game: surrender');
	}

	async endGame(winner: PlayerEntity) {
		clearInterval(this.updateIntervalId);
		this.broadcastService.to(this.UID, 'end', { winner: winner.id });
		this.side[0].player.leaveGame();
		this.side[1].player.leaveGame();
	}

}