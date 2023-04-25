<script>
import axios from 'axios'
import io from "socket.io-client"

export default {


	data() {
		return {
			socket: null,
			chat: {
				events: [],
				messageBuffer: '',
			}
		}
	},

	methods: {

		sendMessage(event, message = this.chat.messageBuffer) {
			console.log(this.socket)
			this.socket.emit('message', message)
		},

		handleEvent(event) {
			this.chat.events.push(event)
		},

		connectToServer() {
			this.socket.connect()
		},

		initSocket() {
			this.socket = io('http://localhost:3001', {
				autoConnect: false,
			})
			
			this.socket.on('connect', () => {
				console.log("Successfully connected to the game websocket server...")
			})
			
			this.socket.on('disconnect', function(reason) {
				console.log("Connection to the game websocket server closed: ", reason)
			})
			
			this.socket.on('connect_error', function(error) {
				console.log("Error connecting to the game websocket server: ", error)
			})

			this.socket.on('event', this.handleEvent)

			this.socket.onAnyOutgoing((event, ...args) => {
				console.log(event, args)
			})
		}
	},

	mounted() {},

	created() {
		this.initSocket()
	}
}
</script>

<template>

	<div>
		<div>
			<button v-if="socket.disconnected" @click="socket.connect">Connect to webSocket</button>
			<button v-else @click="socket.disconnect">Disconnect from webSocket</button>
		</div>
		<input type="text" v-model="chat.messageBuffer">
		<button @click="sendMessage">Send</button>

		<div v-for="event in chat.events">
			{{ event }}
		</div>
	</div>

</template>

<style scoped>
</style>
