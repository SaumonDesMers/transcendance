import { PlayerEntity } from "./player.entity"
import { v4 as uuid } from "uuid";
import { BroadcastService } from './broadcast.service'

const updateInterval = 10;

const maxScore = 10;

const player1_paddlePos_x = 0.05;
const player2_paddlePos_x = 0.95;

function degrees_to_radians(degrees: number)
{
	return degrees * Math.PI / 180;
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
		orientation: Math.PI / 4, // in radian
		speed: 20
	}

	watchers = new Array<PlayerEntity>()

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

		setInterval(this.update, updateInterval, this);
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
		// update ball orientation
		// bounce up and down
		if (ball.pos.y + ball.size > game.arena.height || ball.pos.y - ball.size < 0)
			ball.orientation = -ball.orientation;
		// bounce left and right
		if (ball.pos.x + ball.size > game.arena.width || ball.pos.x - ball.size < 0)
			ball.orientation = Math.PI - ball.orientation;
		if (
			// bounce on left paddle
			game.collideWithPaddle(game.side[0].paddlePos, game.ball.pos.x - game.ball.size)
			// or bounce on right paddle
			|| game.collideWithPaddle(game.side[1].paddlePos, game.ball.pos.x + game.ball.size)
			)
			ball.orientation = Math.PI - ball.orientation;
		

		game.broadcastCurrentState();
	}

	collideWithPaddle(paddle: any, ballCollidePointX: any): boolean {
		return (
			ballCollidePointX < paddle.x + this.paddle.width / 2
			&& ballCollidePointX > paddle.x - this.paddle.width / 2
			&& this.ball.pos.y > paddle.y - this.paddle.height / 2
			&& this.ball.pos.y < paddle.y + this.paddle.height / 2
		)
	}

	async playerInput(player: PlayerEntity, input: string) {
		let side = this.side.find(side => side.player.socket.id == player.socket.id);
		if (input == "up") {
			side.paddlePos.y = Math.max(side.paddlePos.y - this.paddle.speed, 0);
		} else if (input == "down") {
			side.paddlePos.y = Math.min(side.paddlePos.y + this.paddle.speed, this.arena.height);
		}
	}

	async playerSurrende(player: PlayerEntity) {
		let side = this.side.find(side => side.player.socket.id != player.socket.id);
		this.endGame(side.player);
		console.log('game: surrende');
	}

	async endGame(winner: PlayerEntity) {
		this.broadcastService.to(this.UID, 'end');
		this.side[0].player.leaveGame();
		this.side[1].player.leaveGame();
	}

	async addWatcher(watcher: PlayerEntity) {

	}
}