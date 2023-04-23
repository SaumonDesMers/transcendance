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
import { CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto';
import { CreateMessageDto } from '../../../../backend/backend-src/src/chat/message.create.dto';
import store from "../scripts/chat"

export default {

	data() {
		return {
			messageInputBuffer: '',
			current_channelId: -1 as number,
			channelInputBuffer: '',
			keyInputBuffer: null,
			userNameInputBuffer: '',
			store,
		}
	},
	computed: {
	},
	renderTriggered(event) {
		console.log(event);
   		// debugger
  	},
	methods: {
		print() {
			console.log(store);
		},

		connectToServer() {
			store.connectToServer();
		},

		disconnectFromServer() {
			// this.socket.disconnect();
			store.disconnectFromServer();
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
				ownerId: store.user.userId,
				name: this.channelInputBuffer,
				privateChan: false,
				usersId: [],
				key: this.keyInputBuffer
			}

			store.createChannel(channel);
		},

		async joinChannel() {
			store.joinChannel({
				channelName: this.channelInputBuffer,
				key: this.keyInputBuffer});
			this.channelInputBuffer = "";
		},
		
		async leaveChannel() {
			store.leaveChannel(this.current_channelId);
			this.current_channelId = null;
		},

		async SendMessage() {
			const msg = {
				content: this.messageInputBuffer,
				ChannelId: this.current_channelId,
				authorId: store.user.userId
			};
			this.messageInputBuffer = "";
			store.sendMessage(msg);
		},

	},

	mounted() {

	},

	created() {
	},
}

</script>

<template>
	<div>
		<div>
			<button v-if="store.disconnected" @click="connectToServer">Connect To Chat</button>
			<button v-else @click="disconnectFromServer">Disconnect from Chat</button>
			<button @click="sendTest">Get chehd</button>
		</div>

	<div v-if="store.connected">
		<div>
			<input type='test' v-model="channelInputBuffer">
			<input type='test' v-model="keyInputBuffer">
			<button @click="createChannel">Create Channel</button>
			<button @click="joinChannel">Join Channel</button>
			<button @click="leaveChannel">Leave Channel</button>
		</div>
		<p>Invites:</p>
		<!-- Ici on affiche tout les channels pour lesquels on est invité -->
		<!-- en crééant un bouton qui permet de rejoindre le channel concerné -->
		<div v-for="[channelId, name] in store.channelInvites">
			<button @click="store.joinChannel({channelName:name, key: ''})">{{ name }}</button>
		</div>
		<!-- ici on affiche tout les channels actuellement rejoints -->
		<p>Joined Channels:</p>
		<div v-for="[channelId, channel] in store.groupChannels">
			<button @click="selectChannel(channelId)">{{channel.name}}</button>
		</div>

		<div>
			<input type="text" v-model="messageInputBuffer">
			<button @click="SendMessage">Send</button>
		</div>

		<div v-if="this.current_channelId != null">

			<div v-for="message in store.getGroupChannel(this.current_channelId)?.channel.messages">
				<p>
					{{ store.getUserName(message.author.userId) }} : {{ message.content }}
				</p>
			</div>
			<div v-for="user in store.getGroupChannel(this.current_channelId)?.channel.users">
				<!-- <button @click="">ban</button> -->
				<p>{{ store.getUserName(user.userId) }}</p>
				<button @click="store.kick_user(user.userId, this.current_channelId)">kick</button>
				<button @click="store.ban_user(user.userId, this.current_channelId, true)">ban</button>
			</div>
			<div v-if="store.getGroupChannel(this.current_channelId)?.privateChan == true">
				<input type="text" v-model="userNameInputBuffer">

				<!-- Exemple d'un appel a la fonction Pour Invite un user -->
				<button @click="store.invite_user(userNameInputBuffer, current_channelId, true)">Invite User</button>
				<button @click="store.invite_user(userNameInputBuffer, current_channelId, false)">Uninvite User</button>
			</div>
		</div>
	</div>
	<div v-if="store.error != ''">
		{{ store.error }}
		<button @click="store.error = ''">clear Error</button>
	</div>
	</div>
	<!-- <button @click="print()">click me</button> -->
</template>

<style scoped>

</style>
