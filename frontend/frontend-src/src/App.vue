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
				.get('http://localhost:3001/user', this.config)
				.then(res => this.users = res.data)
		},
		sendMessage(message) {
			console.log(this.connection)
			this.connection.send(message)
		}
	},

	mounted: function() {
		this.getUsers()
	},

	created: function() {
		console.log("Starting connection to WebSocket Server")
		this.connection = new WebSocket('ws://localhost:3001')

		this.connection.onmessage = function(event) {
			console.log("Received message from server")
			console.log(event);
		}

		this.connection.onopen = function(event) {
			console.log(event)
			console.log("Successfully connected to the game websocket server...")
		}
	}
}
</script>

<template>

	<h1>Hello world !</h1>
	
	<!-- <button @click='getUsers'>Get users</button>

	<li v-for="user in users">
		{{ user }}
	</li> -->

	<input type="text" v-model="message">
	<button @click='sendMessage(message)'>Send message</button>

</template>

<style scoped>
</style>
