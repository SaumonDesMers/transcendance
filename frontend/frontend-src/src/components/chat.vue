<script lang="ts">
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';


export default {

	data() {
		return {
			socket: Socket,
			user : null,
			inputBuffer: '',
			channels: undefined,
			receivedMessages: [],
		}
	},

	methods: {
		connectToServer() {
			this.socket.io.opts.extraHeaders = {
				authorization: `Bearer ${localStorage.jwt}`
			};
			this.socket.connect();
		},

		disconnectFromServer() {
			this.socket.disconnect();
		},

		async sendTest() {
			this.socket.emit('test_event', (answer) => {
				console.log(answer);
			});
		},

		async createChannel() {
		},

		async joinChannel() {

		},

		async leaveChannel() {

		},

		async SendMessage() {
			const msg = {
				content: this.inputBuffer,
				ChannelId: this.channels[0].id,
				authorId: this.user.userId
			};

		},

		initSocket() {
			this.socket = io('http://localhost:3001/chat', {
				autoConnect: false,
			});

			this.socket.on('connect', () => {
				console.log("Connected to chat");
			});

			this.socket.on('disconnect', () => {
				console.log("Connection to chat websocket closed");
			});

			this.socket.on('connect_error', () => {
				console.log("Error connecting to chat websocket");
			});

			this.socket.on("error", (reason) => {
				console.log("received an error from server :", reason);
			});

			this.socket.on("exception", (reason) => {
				console.log("received an error from server :", reason);
			});

			this.socket.onAnyOutgoing((event, ...args) => {
				// console.log(event, args);
			});

			this.socket.onAny((event, ...args) => {
				console.log(event);
			})
		}
	},

	mounted() {},

	created() {
		this.initSocket();
	},
}

</script>

<template>
	<div>
		<div>
			<button v-if="socket.disconnected" @click="connectToServer">Connect To Chat</button>
			<button v-else @click="disconnectFromServer">Disconnect from Chat</button>
			<button @click="sendTest">Get chehd</button>
		</div>

		<div>
			<input type="text" v-model="inputBuffer">
			<button @click="SendMessage">Send</button>
		</div>

		<div v-for="message in receivedMessages">
			{{ message }}
		</div>
	</div>
</template>

<style scoped>

</style>
