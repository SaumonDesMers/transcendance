<script>
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'

export default {

	components: {
		gameCanvas
	},

	data() {
		return {
			socket: null,
			state: 'none',
			game: null,
			canvas: null,
		}
	},

	methods: {

		connectToGameGateway() {
			this.socket.io.opts.extraHeaders = {
				authorization: `Bearer ${localStorage.jwt}`
			};
			console.log(this.socket.io.opts.extraHeaders);
			this.socket.connect();
		},

		initSocket() {
			this.socket = io('http://localhost:3001/game', {
				autoConnect: false
			});
			
			this.socket.on('connect', () => {
				console.log("Successfully connected to the game websocket server...")
				this.state = 'none';
			});
			
			this.socket.on('disconnect', function(reason) {
				console.log("Connection to the game websocket server closed: ", reason)
			});
			
			this.socket.on('connect_error', function(error) {
				console.log("Error connecting to the game websocket server: ", error)
			});

			this.socket.on('start', this.onGameStart);
			this.socket.on('update', this.onGameUpdate);
			this.socket.on('end', this.onGameEnd);
		},

		joinQueue() {
			this.socket.emit('queue', 'join', res => {
				if (res == 'join') {
					this.state = 'queue';
				}
			});
		},

		leaveQueue() {
			this.socket.emit('queue', 'leave', res => {
				if (res == 'leave') {
					this.state = 'none';
				}
			});
		},
		
		onGameStart(event) {
			console.log('game start');
			this.state = 'game';
			window.addEventListener('keydown', this.handleKeydownEvent);
			window.addEventListener('keyup', this.handleKeyupEvent);
		},

		onGameUpdate(event) {
			console.log('game update');
			this.game = event;
		},
		
		onGameEnd(event) {
			console.log('game end');
			this.state = 'none';
			window.removeEventListener('keydown', this.handleKeydownEvent);
			window.removeEventListener('keyup', this.handleKeyupEvent);
		},

		surrender() {
			this.socket.emit('surrender');
		},

		handleKeydownEvent(e) {
			// console.log('key:', e.key);
			if (e.key == 'ArrowUp') {
				this.socket.emit('input', 'up');
			} else if (e.key == 'ArrowDown') {
				this.socket.emit('input', 'down');
			}
		},

		handleKeyupEvent(e) {
			// console.log('key:', e.key);
			if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
				this.socket.emit('input', 'none');
			}
		},


	},

	mounted() {},
	
	created() {
		this.initSocket();
		this.connectToGameGateway();
	}
}
</script>

<template>

	<h4>Game (state: {{ state }}) :</h4>

	<div v-if="socket.disconnected">
		<p class="error">You are disconnected !</p>
	</div>

	<div v-else>
		<div v-if="state == 'none'">
			<button @click="joinQueue">Play !</button>
		</div>
		<div v-else-if="state == 'queue'">
			<p>Waiting for another player...</p>
			<button @click="leaveQueue">Leave queue</button>
		</div>
		<div v-else>
			<!-- <p>{{ game }}</p> -->
			<gameCanvas :game="game"></gameCanvas>
			<button @click="surrender">Surrender</button>
		</div>
	</div>


</template>

<style scoped>
.error {
	color: red;
}
</style>
