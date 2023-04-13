<script lang="ts">
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import {
	GroupChannelDTO,
	ChannelDTO,
	ChatUserDTO,
	MessageDTO,
	joinRequestDTO,
	adminRequestDTO,
	MuteDTO,
} from '../../../../backend/backend-src/src/chat/Chat.entities';
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '../../../../backend/backend-src/src/chat/Chat.events';


export default {

	data() {
		return {
			socket: Socket<ServerToClientEvents, ClientToServerEvents>,
			user : null,
			messageInputBuffer: '',
			channelInputBuffer: '',
			channels: [],
			receivedMessages: [],
			current_channelId: 0,
		}
	},

	methods: {
		connectToServer() {
			this.socket.io.opts.extraHeaders = {
				authorization: `Bearer ${localStorage.jwt}`
			};
			this.socket.connect();

			// this.user = await fetch()
			this.socket.emit("get_user", (user: ChatUserDTO) => {
				this.user = user;
				this.channels = user.joinedChannels;
			});
		},

		disconnectFromServer() {
			this.socket.disconnect();
		},

		selectChannel(id: number) {
			this.current_channelId = id;
		},

		async sendTest() {
			this.socket.emit('test_event', (answer) => {
				console.log(answer);
			});
		},

		async createChannel() {
			const channel = {
				ownerId: this.user.userId,
				name: this.channelInputBuffer,
				usersId: [],
			}

			this.socket.emit("create_channel", channel);
		},

		async joinChannel() {
			this.socket.emit("join_channel", this.channelInputBuffer,
			(channel: ChannelDTO) => {
				this.channels.push(channel);
			});
			this.channelInputBuffer = "";
		},
		
		async leaveChannel() {
			this.socket.emit("leave_channel", this.channelInputBuffer);

			for(var i = 0; i < this.channels.length(); i++) {
				if (this.channels[i].name == this.channelInputBuffer) {
					this.channels.splice(i, 1);
					i--;
				}
			}
			this.channelInputBuffer = "";
		},

		async SendMessage() {
			const msg = {
				content: this.messageInputBuffer,
				ChannelId: this.current_channelId,
				authorId: this.user.userId
			};
			console.log("sending mesage in channel:", this.current_channelId);
			this.messageInputBuffer = "";
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

			this.socket.on("join_room", (channel) => {
				console.log(channel)
				this.channels.push(channel);
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

	<div v-if="socket.connected">
		<div>
			<input type='test' v-model="channelInputBuffer">
			<button @click="createChannel">Create Channel</button>
			<button @click="joinChannel">Join Channel</button>
			<button @click="leaveChannel">Leave Channel</button>
		</div>
		<div v-for="channel in this.channels">
			<button @click="selectChannel(channel.id)">{{channel.name}}</button>
		</div>

		<div>
			<input type="text" v-model="messageInputBuffer">
			<button @click="SendMessage">Send</button>
		</div>

		<div v-for="message in receivedMessages">
			<p v-if="message.channel.id == this.current_channelId">
				{{message.channel.name }} {{ message.content }}
			</p>
		</div>
	</div>
	</div>
</template>

<style scoped>

</style>
