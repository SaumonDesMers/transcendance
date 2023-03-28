<script>
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
		game: null
	},

	methods: {
		draw() {
			// background
			this.arena = this.game.arena;
			this.canvas.fillStyle = "black";
			this.canvas.fillRect(0, 0, this.game.arena.width, this.game.arena.height);

			// separator
			this.canvas.strokeStyle = "grey";
			this.canvas.lineWidth = 10;
			this.canvas.beginPath();
			const h = this.game.arena.height;
			const n = 10;
			const x = 35;
			const y = ((-n - 1) * x + h) / n;
			this.canvas.setLineDash([x, y]);
			this.canvas.moveTo(this.game.arena.width / 2, 0);
			this.canvas.lineTo(this.game.arena.width / 2, this.game.arena.height);
			this.canvas.stroke();

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
			this.drawPaddle(this.game.side[0].paddlePos);
			this.drawPaddle(this.game.side[1].paddlePos);

			// ball
			this.canvas.beginPath();
			this.canvas.arc(
				this.game.ball.pos.x,
				this.game.ball.pos.y,
				this.game.ball.size,
				0, 2 * Math.PI
			);
			this.canvas.fillStyle = "lightgrey";
			this.canvas.fill();
		},

		drawPaddle(paddle) {
			this.canvas.fillStyle = "lightgrey";
			this.canvas.fillRect(
				paddle.x - this.game.paddle.width / 2,
				paddle.y - this.game.paddle.height / 2,
				this.game.paddle.width,
				this.game.paddle.height,
			);
		}
	},

	watch: {
		game() {
			this.draw();
		}
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
