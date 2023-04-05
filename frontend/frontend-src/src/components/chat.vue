<script lang="ts">
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import { ChatUser } from './chatUser.interface.ts';


export default {

	data() {
		return {
			socket: Socket,
			user : ,
			chat: {
				receivedMessages[],
				channel: {
					channelId: number,

				},
				messageBuffer: '',
			}
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

		async joinChannel() {

		},

		async SendMessage() {
			const msg = {

			}
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
				console.log("received an error from server");
			});

			this.socket.on("exception", (reason) => {
				console.log("received an error from server");
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
			<input type="text" v-model="chat.messageBuffer">
			<button @click="sendMessage">Send</button>
		</div>

		<div v-for="message in chat.receivedMessages">
			{{ event }}
		</div>
	</div>
</template>

<style scoped>

</style>
