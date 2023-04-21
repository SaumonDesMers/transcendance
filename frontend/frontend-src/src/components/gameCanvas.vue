<script>
import { GameData } from '../scripts/gameData';

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

			// paddle
			this.drawPaddle(this.game.side[0].paddle);
			this.drawPaddle(this.game.side[1].paddle);

			// obstacle
			console.log(this.game.obstacles);
			for (let o of this.game.obstacles) {
				this.canvas.fillStyle = "grey";
				if (o.enabled)
					this.canvas.fillStyle = "lightgrey";
				this.canvas.fillRect(o.pos.x, o.pos.y, o.width, o.height);
			}

			// ball
			this.canvas.beginPath();
			this.canvas.arc(
				this.game.ball.pos.x,
				this.game.ball.pos.y,
				this.game.ball.radius,
				0, 2 * Math.PI
			);
			this.canvas.fillStyle = "yellow";
			this.canvas.fill();

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

		drawPaddle(paddle) {
			this.canvas.fillStyle = "lightgrey";
			this.canvas.fillRect(
				paddle.pos.x,
				paddle.pos.y,
				paddle.width,
				paddle.height,
			);
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
