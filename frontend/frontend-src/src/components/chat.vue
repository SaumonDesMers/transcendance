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
	CreateMessageDto,
	gameInviteArgs
} from '../../../../backend/backend-src/src/chat/Chat.entities';
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '../../../../backend/backend-src/src/chat/Chat.events';
import { CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto';
import store from "../scripts/chat";
import user from '../scripts/user';

export default {

	data() {
		return {
			messageInputBuffer: '',
			channelInputBuffer: '',
			keyInputBuffer: '',
			setKeyInputBuffer: '',
			userNameInputBuffer: '',
			customGameInvite: false,
			store,
			user,
		}
	},
	computed: {
		currentChannel() {
			return store.getCurrentChannel();
		}
	},
	// renderTriggered(event) {
	// 	// console.log(event);
	// 	// debugger
	// },
	methods: {
		print() {
			console.log(store);
		},

		connectToServer() {
			store.connectToServer(this.$cookies.get('jwt'));
		},

		disconnectFromServer() {
			// this.socket.disconnect();
			store.disconnectFromServer();
		},

		selectChannel(id: number) {
			store.selectChannel(id, false);
		},

		selectDMChannel(id: number) {
			store.selectChannel(id, true);
		},

		async createChannel() {
			console.log("creating channel:", user.id);
			console.log("creating channel:", store.user.userId);
			const channel: CreateGroupChannelDto = {
				ownerId: store.user.userId,
				name: this.channelInputBuffer,
				type: 'PUBLIC',
				usersId: [],
				key: this.keyInputBuffer
			}

			store.createChannel(channel);
		},

		async joinChannel() {
			store.joinChannel({
				channelName: this.channelInputBuffer,
				key: this.keyInputBuffer
			});
			this.channelInputBuffer = "";
		},

		async leaveChannel() {
			store.leaveChannel();
		},

		async SendMessage() {
			store.sendMessage(this.messageInputBuffer);
			this.messageInputBuffer = "";
		},

		async sendInvite() {
			const invite: gameInviteArgs = {
				gameType: this.customGameInvite ? 'CUSTOM' : 'NORMAL'
			};
			store.sendGameInvite(invite, this.messageInputBuffer);
			this.messageInputBuffer = "";
		},

	},

	mounted() {

	},

	created() {
	},
}

</script>

<template>
	<div class="chat" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div v-if="user.darkMode == true">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<!-- <div style="justify-content: center; align-items: center;">
			<button class="nocolor-btn text-color-dark" style="width: 100%; height: 5rem;" v-if="store.disconnected"
				@click="connectToServer">Connect To Chat</button>
			<button class="nocolor-btn" v-else @click="disconnectFromServer">Disconnect from Chat</button>
		</div> -->

		<div class="chat-container">
			<!-- <div v-if="store.connected"> -->
				<div>
					<input type='test' v-model="channelInputBuffer">
					<input type='test' v-model="keyInputBuffer">
					<button style="color: red" @click="createChannel">Create Channel</button>
					<button @click="joinChannel">Join Channel</button>
					<button @click="leaveChannel">Leave Channel</button>
					<button @click="store.startDM(channelInputBuffer)">Start DM</button>
				</div>
				<p class="text-color-dark">Invites:</p>
				<!-- Ici on affiche tout les channels pour lesquels on est invité -->
				<!-- en crééant un bouton qui permet de rejoindre le channel concerné -->
				<div v-for="[channelId, name] in store.channelInvites">
					<button @click="store.acceptInvite(channelId)">{{ name }}</button>
				</div>
				<!-- Ici on affiche tout les channels publics que l'ont peu rejoindre en cliquant -->
				<p class="text-color-dark">Public Channels:</p>
				<div v-for="[channelId, channel] in store.publicChannels">
					<button @click="store.joinChannel({ channelName: channel.name, key: '' })">{{ channel.name }}</button>
				</div>

				<!-- ici on affiche tout les channels actuellement rejoints -->
				<p class="text-color-dark">Joined Channels:</p>
				<div v-for="[channelId, channel] in store.groupChannels">
					<button @click="selectChannel(channelId)">{{ channel.name }}</button>
				</div>

				<div v-if="this.currentChannel != undefined">
					<!-- <div> -->
					<input type="text" v-model="messageInputBuffer">
					<button @click="SendMessage">Send</button>
					<button @click="sendInvite">Send Game Invite</button>
					<input type="checkbox" id="checkbox" v-model="customGameInvite">
					<label for="checkbox">Custom Game</label>
				</div>

				<!-- ici on affiche tout les DM ouverts -->
				<div v-for="[channelId, channel] in store.dmChannels">
					<button @click="selectDMChannel(channelId)">{{ channel.channel.users.map(a =>
						store.getUserName(a.userId))
					}}</button>
				</div>

				<!-- Ici on affiche un channel de groupe avec les messages et les options... -->
				<div v-if="this.currentChannel != undefined && store.isCurrentDM == false">
					<p>Current Channel : {{ this.currentChannel.name }}</p>
					<p>Channel Owner: {{ store.getUserName(this.currentChannel.owner?.userId) }}</p>
					<div v-for="message in this.currentChannel?.channel.messages">
						<p>
							{{ store.getUserName(message.author.userId) }} : {{ message.content }}
						<p v-if="message.gameInvite != undefined">
							Game Invite status: {{ message.gameInvite.status }}
							<button v-if="message.gameInvite.status == 'PENDING'"
								@click="store.acceptGameInvite(message)">Join</button>
						</p>
						</p>
					</div>
					<div v-for="user in this.currentChannel?.channel.users">
						<!-- <button @click="">ban</button> -->
						<p>{{ store.getUserName(user.userId) }}</p>
						<button @click="store.kick_user(user.userId)">kick</button>
						<button @click="store.ban_user(user.userId, true)">ban</button>
					</div>

					<!-- AFFICHAGE SPECIFIQUE A UN CHANNEL PRIVÉ -->
					<div v-if="this.currentChannel?.type == 'PRIV' || this.currentChannel?.type == 'PUBLIC'">
						<p>Invited Users:</p>
						<div v-for="user in this.currentChannel?.invited">
							<p> {{ store.getUserName(user.userId) }}</p>
						</div>
						<div v-for="user in this.currentChannel?.channel.users">
							<!-- <button @click="">ban</button> -->
							<p>{{ store.getUserName(user.userId) }}</p>
							<button @click="store.kick_user(user.userId, this.current_channelId)">kick</button>
							<button @click="store.ban_user(user.userId, this.current_channelId, true)">ban</button>
						</div>

						<!-- AFFICHAGE SPECIFIQUE A UN CHANNEL PRIVÉ -->
						<div v-if="this.currentChannel?.type == 'PRIV' || this.currentChannel?.type == 'PUBLIC'">
							<p>Invited Users:</p>
							<div v-for="user in this.currentChannel?.invited">
								<p> {{ store.getUserName(user.userId) }}</p>
							</div>
							<input type="text" v-model="userNameInputBuffer">
							<!-- Exemple d'un appel a la fonction Pour invite et uninvite un user -->
							<button @click="store.invite_user(userNameInputBuffer, true)">Invite User</button>
							<button @click="store.invite_user(userNameInputBuffer, false)">Uninvite User</button>
						</div>

						<!-- Exemple d'un appel a la fonction Pour invite et uninvite un user -->
						<button @click="store.invite_user(userNameInputBuffer, current_channelId, true)">Invite
							User</button>
						<button @click="store.invite_user(userNameInputBuffer, current_channelId, false)">Uninvite
							User</button>
					</div>

					<!-- AFFICHAGE SPECIFIQUE A UN CHANNEL PROTEGE PAR CLÉ -->
					<div v-if="this.currentChannel?.type == 'KEY'">
						<input type="text" v-model="setKeyInputBuffer">

						<button @click="store.setChanKey(current_channelId, setKeyInputBuffer)">Set Chan Key</button>
					</div>

					<!-- un exemple d'un ensemble de boutons pour changer le type du channel actuellement selectionné -->

					<button @click="store.setChanType(current_channelId, 'PUBLIC')">Set Channel Public</button>
					<button @click="store.setChanType(current_channelId, 'PRIV')">Set Channel Private</button>

					<!-- ça c'est à l'arrache faut pas faire ça ( j'ai la même var d'input que le champ du dessus) -->
					<input type="text" v-model="setKeyInputBuffer">

					<button @click="store.setChanKey(setKeyInputBuffer)">Set Chan Key</button>
				</div>

				<!-- un exemple d'un ensemble de boutons pour changer le type du channel actuellement selectionné -->

				<button @click="store.setChanType('PUBLIC')">Set Channel Public</button>
				<button @click="store.setChanType('PRIV')">Set Channel Private</button>

				<!-- ça c'est à l'arrache faut pas faire ça ( j'ai la même var d'input que le champ du dessus) -->
				<input type="text" v-model="setKeyInputBuffer">

				<button @click="store.setChanType('KEY', setKeyInputBuffer)">Set Channel KeyProtected</button>
			<!-- </div> -->

			<div v-if="this.currentChannel != undefined && store.isCurrentDM == true">
				<p>Chat With
				<p v-for="user in this.currentChannel?.channel.users">{{ store.getUserName(user.userId) }}</p>
				</p>

				<div v-for="message in this.currentChannel?.channel.messages">
					<p>
						{{ store.getUserName(message.author.userId) }} : {{ message.content }}
					<p v-if="message.gameInvite != undefined">
						Game Invite status: {{ message.gameInvite.status }}
						<button v-if="message.gameInvite.status == 'PENDING'"
							@click="store.acceptGameInvite(message)">Join</button>
					</p>
					</p>
				</div>
			</div>

		</div>

		<!-- exemple d'un affichage de la dernière erreur reçue -->
		<!-- avec un bouton pour reset -->
		<div v-if="store.error != ''">
			{{ store.error }}
			<button @click="store.error = ''">clear Error</button>
		</div>
	</div>
	<!-- <button @click="print()">click me</button> -->
</template>

<style lang="scss" scoped>

.chat {
	display: flex;
	top: 0;
	left: 0;
	position: absolute;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
.text-color-dark {
	color: white;
	font-size: 20px;
	text-transform: uppercase;
	text-align: center;

	&:hover,
	&:active {
		text-shadow:
			0 0 10px #fff,
			0 0 15px #777777,
			0 0 25px #000000,
	}
}

.chat-container {
	width: 99%;
	height: 99%;
	// display: flex;
	// align-items: center;
	// justify-content: center;
	// align-content: center;
	background-color: rgba(0, 0, 0, 0.5);
}

</style>
