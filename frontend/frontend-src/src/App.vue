<script>
import axios from 'axios'

export default {
	data: function() {
		return {
			connection: null,
			users: [],
			message: '',
		}
	},

	methods: {
		getUsers() {
			console.log('getUsers')
			axios
				.get('http://localhost:3001/user')
				.then(res => this.users = res.data)
		},
		sendMessage(message) {
			console.log(this.connection)
			this.connection.send(message)
		},
		connectToServer() {
			console.log("Starting connection to WebSocket Server")
			this.connection = new WebSocket('ws://localhost:3001/game')

			this.connection.onmessage = function(event) {
				console.log("Received message from server")
				console.log(event);
			}

			this.connection.onopen = function(event) {
				console.log("Successfully connected to the game websocket server...")
				console.log(event)
			}

			this.connection.onclose = function(event) {
				console.log("Connection to the game websocket server closed...")
				console.log(event)
			}

			this.connection.onerror = function(event) {
				console.log("Error connecting to the game websocket server...")
				console.log(event)
			}
		}
	},

	mounted: function() {
		this.getUsers()
	},

	created: function() {
		this.connectToServer()
	}
}
</script>

<template>

	<h1>Hello world !</h1>
	
	<div>
		<button @click='getUsers'>Get users</button>
	
		<li v-for="user in users">
			{{ user }}
		</li>
	</div>

	<div>
		<div>
			<button @click='connectToServer'>Connect to server</button>
		</div>
		<input type="text" v-model="message">
		<button @click='sendMessage(message)'>Send message</button>
	</div>

</template>

<style scoped>
</style>
