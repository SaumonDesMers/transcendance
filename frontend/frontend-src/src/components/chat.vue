<script lang="ts">
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';


export default {

	data() {
		return {
			socket: Socket,
			user : null,
			messageInputBuffer: '',
			channels: [],
			receivedMessages: [],
			current_channel: 0,
		}
	},

	methods: {
		connectToServer() {
			this.socket.io.opts.extraHeaders = {
				authorization: `Bearer ${localStorage.jwt}`
			};
			this.socket.connect();

			this.socket.emit("get_user", (user) => {
				this.user = user;
				this.channels = user.joinedChannels;
			});
		},

		disconnectFromServer() {
			this.socket.disconnect();
		},

		selectChannel(id: number) {
			this.current_channel = id;
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
				content: this.messageInputBuffer,
				ChannelId: this.current_channel,
				authorId: this.user.userId
			};

			this.socket.emit("send_message", msg);
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
			
			this.socket.on("message", (message) => {
				this.receivedMessages.push(message);
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

		<div v-for="channel in this.channels">
			<button @click="selectChannel(channel.id)">{{channel.name}}</button>
		</div>

		<div>
			<input type="text" v-model="messageInputBuffer">
			<button @click="SendMessage">Send</button>
		</div>

		<div v-for="message in receivedMessages">
			{{message.channel.name }} {{ message.content }} 
		</div>
	</div>
</template>

<style scoped>

</style>
