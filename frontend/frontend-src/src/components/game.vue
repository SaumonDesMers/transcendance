<script>
import axios from 'axios'
import io from "socket.io-client"

export default {

	data() {
		return {
			socket: null,
			state: 'none',
			game: null
		}
	},

	methods: {

		connectToGameGateway() {
			this.socket.connect();
		},

		initSocket() {
			this.socket = io('http://localhost:3001/game', {
				autoConnect: false,
			});
			
			this.socket.on('connect', () => {
				console.log("Successfully connected to the game websocket server...")
			});
			
			this.socket.on('disconnect', function(reason) {
				console.log("Connection to the game websocket server closed: ", reason)
			});
			
			this.socket.on('connect_error', function(error) {
				console.log("Error connecting to the game websocket server: ", error)
			});

			this.socket.on('gameUpdate', this.onGameUpdate);

			this.socket.onAnyOutgoing((event, ...args) => {
				console.log(event, args)
			});
		},

		joinQueue() {
			this.socket.emit('queue', 'join');
			if (this.state == 'none')
				this.state = 'inQueue';
		},

		leaveQueue() {
			this.socket.emit('queue', 'leave');
			if (this.state == 'inQueue')
				this.state = 'none';
		},

		onGameUpdate(event) {
			console.log('game update');
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

	<h4>Game :</h4>

	<div v-if="socket.disconnected">
		<p class="error">You are disconnected !</p>
	</div>

	<div v-else>
		<div v-if="state == 'none'">
			<button @click="joinQueue">Play !</button>
		</div>
		<div v-else-if="state == 'inQueue'">
			<p>Waiting for another player...</p>
			<button @click="leaveQueue">Leave queue</button>
		</div>
		<div v-else>
			<p>You are in a game</p>
		</div>
	</div>


</template>

<style scoped>
.error {
	color: red;
}
</style>
