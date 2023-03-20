<script>
export default {

	data() {
		return {
			canvas: null,
			arena: {
				width: 800,
				height: 500,
			},
			paddle: {
				width: 20,
				height: 100,
			}
		}
	},

	props: {
		game: null
	},

	methods: {
		draw() {
			// background
			this.canvas.fillStyle = "black";
			this.canvas.fillRect(0, 0, this.arena.width, this.arena.height);

			// paddle
			this.drawPaddle(this.game.side[0].paddlePos);
			this.drawPaddle(this.game.side[1].paddlePos);

			// ball
			this.canvas.arc(
				this.arena.width * this.game.ball.position.x,
				this.arena.height * this.game.ball.position.y,
				20, 0, 2 * Math.PI
			);
			this.canvas.fillStyle = "lightgrey";
			this.canvas.fill();
		},

		drawPaddle(paddle) {
			this.canvas.fillStyle = "lightgrey";
			this.canvas.fillRect(
				(this.arena.width * paddle.x) - this.paddle.width / 2,
				(this.arena.height * paddle.y) - this.paddle.height / 2,
				this.paddle.width,
				this.paddle.height,
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
