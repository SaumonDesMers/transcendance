<script>
import { GameData } from '../scripts/gameData';
import { computeShadowPolygone } from '../scripts/magic';
import { Vec2 } from '../scripts/utils';

export default {

	data() {
		return {
			canvas: null,
			arena: {
				width: 0,
				height: 0,
			},
		}
	},

	props: {
		game: GameData,
	},

	methods: {
		draw() {
			// background
			this.arena = this.game.arena;
			this.canvas.fillStyle = "black";
			this.canvas.fillRect(0, 0, this.game.arena.width, this.game.arena.height);

			// separator
			// this.canvas.strokeStyle = "grey";
			// this.canvas.lineWidth = 10;
			// this.canvas.beginPath();
			// const h = this.game.arena.height;
			// const n = 10;
			// const x = 35;
			// const y = ((-n - 1) * x + h) / n;
			// this.canvas.setLineDash([x, y]);
			// this.canvas.moveTo(this.game.arena.width / 2, 0);
			// this.canvas.lineTo(this.game.arena.width / 2, this.game.arena.height);
			// this.canvas.stroke();

			// score
			this.canvas.fillStyle = "lightgrey";
			this.canvas.font = "30px Arial";
			this.canvas.textAlign = "center";
			this.canvas.fillText(
				this.game.side[0].score.toString(),
				this.game.arena.width / 2 - 50,
				40
			);
			this.canvas.fillText(
				this.game.side[1].score.toString(),
				this.game.arena.width / 2 + 50,
				40
			);

			this.drawGradient(this.game.ball);
			this.drawBall(this.game.ball);

			this.drawObstaclesShadow(this.game.obstacles, this.game.ball.pos);
			this.drawObstacles(this.game.obstacles);

			this.drawPaddle(this.game.side[0].paddle);
			this.drawPaddle(this.game.side[1].paddle);

			// point
			for (let p of this.game.points) {
				this.point(p.x, p.y, 3, "red");
			}

			// line
			this.canvas.setLineDash([]);
			for (let l of this.game.lines) {
				this.line(l.start.x, l.start.y, l.end.x, l.end.y, "blue")
			}
		},

		drawGradient(ball) {
			const gradient = this.canvas.createRadialGradient(
				ball.pos.x, ball.pos.y, ball.radius,
				ball.pos.x, ball.pos.y, 500
			);
			gradient.addColorStop(0, "lightgrey");
			gradient.addColorStop(1, "black");
			this.canvas.fillStyle = gradient;
			this.canvas.fillRect(0, 0, this.game.arena.width, this.game.arena.height);
		},

		drawBall(ball) {
			this.canvas.beginPath();
			this.canvas.arc(
				ball.pos.x,
				ball.pos.y,
				ball.radius,
				0, 2 * Math.PI
			);
			this.canvas.fillStyle = "white";
			this.canvas.fill();
		},

		drawObstacles(obstacles) {
			for (let o of obstacles) {
				this.canvas.fillStyle = "black";
				this.canvas.fillRect(o.pos.x, o.pos.y, o.width, o.height);
			}
		},

		drawObstaclesShadow(obstacles, lightSouce) {
			const maxDist = 900;
			this.canvas.fillStyle = "black";
			for (let o of obstacles) {
				const shadowPoints = computeShadowPolygone(o, new Vec2(lightSouce.x, lightSouce.y));
				if (shadowPoints.length == 0) {
					continue;
				}
				this.canvas.beginPath();
				this.canvas.moveTo(shadowPoints[0].x, shadowPoints[0].y);
				for (let i = 1; i < shadowPoints.length; i++) {
					this.canvas.lineTo(shadowPoints[i].x, shadowPoints[i].y);
				}
				this.canvas.closePath();
				this.canvas.fill();
			}
		},

		drawPaddle(p) {
			this.canvas.fillStyle = "white";
			this.canvas.fillRect(p.pos.x, p.pos.y, p.width, p.height);
		},

		point(x, y, size, color) {
			this.canvas.fillStyle = color;
			this.canvas.beginPath();
			this.canvas.arc(x, y, size, 0, 2 * Math.PI);
			this.canvas.fill();
		},

		line(x1, y1, x2, y2, color) {
			this.canvas.strokeStyle = color;
			this.canvas.lineWidth = 2;
			this.canvas.beginPath();
			this.canvas.moveTo(x1, y1);
			this.canvas.lineTo(x2, y2);
			this.canvas.stroke();
		},
	},

	watch: {
		game: {
			handler() {
				this.draw();
			},
			deep: true,
		},
	},

	mounted() {
		this.canvas = document.getElementById("c").getContext("2d");
	},
	
	created() {
	}
}
</script>

<template>

	<canvas id="c" :width="arena.width" :height="arena.height"></canvas>
	
</template>

<style scoped>
</style>
