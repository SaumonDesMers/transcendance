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
	gameInviteArgs,
	gameType,
} from '../../../../backend/backend-src/src/chat/Chat.entities';
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '../../../../backend/backend-src/src/chat/Chat.events';
import { CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto';
import store from "../scripts/chat"
import user from '../scripts/user';
import { State } from '../scripts/state';
import { reactive } from 'vue';

export default {

	data() {
		return {
			State,
			user,
			messageInputBuffer: '',
			channelInputBuffer: '',
			keyInputBuffer: '',
			setKeyInputBuffer: '',
			userNameInputBuffer: '',
			customGameInvite: false,
			searchInput: '',
			searchArray: [],
			store,
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
		switchPage(page) {
			this.$emit('switchPage', page);
		},
		print() {
			console.log(store);
		},

		connectToServer() {
			store.connect(this.$cookies.get('jwt'));
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
				gameType: this.customGameInvite ? gameType.CUSTOM : gameType.NORMAL
			};
			store.sendGameInvite(invite, this.messageInputBuffer);
			this.messageInputBuffer = "";
		},

	},
	watch: {
		searchInput()
		{
			store.search_user(this.searchInput).then((arr) => {
				this.searchArray = arr;
			});
		}
	},
	mounted() {
	},

	created() {
	},
	emits: ['switchPage'],
}

</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	<div class="chat" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div v-if="user.darkMode == true" style="width: 0; height: 0;">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div class="chat-container">
			<!-- <div style="justify-content: center; align-items: center;">
				<button class="nocolor-btn text-color-dark" style="width: 100%; height: 5rem;" v-if="store.disconnected"
					@click="connectToServer">Connect To Chat</button>
				<button class="nocolor-btn" v-else @click="disconnectFromServer">Disconnect from Chat</button>
			</div> -->
			<!-- <div v-if="store.connected"> -->
			<div class="chat-list">
				<div style="height: 4vh;">
					<button style="color: red" @click="this.switchPage(State.CREATECHAT)">Create Channel</button>
				</div>
				<div>
					<input type="text" v-model="searchInput"/>
					<p v-for="username in this.searchArray">{{ username }}</p>
				</div>
				<div>
					<p class="text-color-dark grid-border"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;">Public Channels </p>
					<div class="chan-can-join">
						<div v-for="[channelId, channel] in store.publicChannels">
							<button @click="store.joinChannel({ channelId })"
								style="color: white; font-size: 15px; border: none; background-color: transparent;">{{
									channel.name }}</button>
						</div>
					</div>
				</div>
				<div>
					<p class="text-color-dark grid-border"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;">Protected CHAN </p>
					<div class="chan-can-join">
						<!-- TODO: RAJOUTER LE POP UP AVEC L'INPUT DE TEXTE POUR JOIN -->
						<div v-for="[channelId, channel] in store.keyChannels">
							<p style="color: white; font-size: 15px; border: none; background-color: transparent;">
								{{ channel.name }}</p>
						</div>
						<!-- <div v-for="n in 10">
							<p style="color: white; font-size: 15px; border: none; background-color: transparent;">Channels
								random<br></p>
						</div> -->
					</div>
				</div>
				<div>
					<p class="text-color-dark grid-border"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;">Your channels </p>
					<div class="chan-can-join">
						<div v-for="[channelId, channel] in store.groupChannels">
							<button @click="selectChannel(channelId)"
								style="color: white; font-size: 15px; border: none; background-color: transparent;">{{
									channel.name }}</button>
						</div>
					</div>
				</div>
				<div>
					<p class="text-color-dark grid-border"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;">Private message</p>
					<div class="chan-can-join">
						<div v-for="n in 10">
							<p style="color: white; font-size: 15px; border: none; background-color: transparent;">Channels
								random<br></p>
						</div>
						<div v-for="[channelId, channel] in store.dmChannels">
							<button @click="selectDMChannel(channelId)"
								style="color: white; font-size: 15px; border: none; background-color: transparent;">{{
									channel.channel.users.map(a =>
										store.getUserName(a.userId))
								}}</button>
						</div>
					</div>
				</div>
				<div
					style="height: 5vh; margin-left: -5px; display: flex; align-items: center; margin-top: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem;">
					<div class="avatar" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']"></div>
					<p style="margin-left: 0.7rem;" class="text-color-dark">{{ user.username }}</p>
				</div>
			</div>
			<div class="chat-box">
				<div v-if="this.currentChannel != undefined">
					<p class="title-chat grid-border">
						{{ this.currentChannel.name }}
					</p>
				</div>
				<div v-if="this.currentChannel != undefined && store.isCurrentDM == false">
					<!-- <p>Current Channel : {{ this.currentChannel.name }}</p>
				<p>Channel Owner: {{ store.getUserName(this.currentChannel.owner?.userId) }}</p> -->
					<div class="conversation" style="overflow: scroll; height: 80vh;">
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
						<!-- <div v-for="user in this.currentChannel?.channel.users"> -->
						<!-- <button @click="">ban</button> -->
						<!-- <p>{{ store.getUserName(user.userId) }}</p>
					<button @click="store.kick_user(user.userId)">kick</button>
					<button @click="store.ban_user(user.userId, true)">ban</button>
				</div> -->
					</div>
				</div>
				<div class="send-message">
					<div v-if="this.currentChannel != undefined">
						<!-- <div> -->
						<input type="text" v-model="messageInputBuffer">
						<button @click="SendMessage">Send</button>
						<button @click="sendInvite">Send Game Invite</button>
						<input type="checkbox" id="checkbox" v-model="customGameInvite">
						<label for="checkbox">Custom Game</label>
					</div>
				</div>
			</div>
			<div class="users">
				<div v-if="this.currentChannel != undefined && store.isCurrentDM == false">
					<p>{{ store.getUserName(this.currentChannel.owner?.userId) }}<p class="fa-solid fa-crown" style="padding:10px; color: gold"></p></p>
					<div v-for="n in 100">
						<p v-for="user in this.currentChannel?.channel.users">{{ store.getUserName(user.userId) }}</p>
					</div>
				</div>
			</div>
			<!-- <div>
				<input type='test' v-model="keyInputBuffer">
				<button @click="joinChannel">Join Channel</button>
				<button @click="leaveChannel">Leave Channel</button>
				<button @click="store.startDM(channelInputBuffer)">Start DM</button>
			</div> -->
			<!-- <p class="text-color-dark">Invites:</p> -->
			<!-- Ici on affiche tout les channels pour lesquels on est invité -->
			<!-- en crééant un bouton qui permet de rejoindre le channel concerné -->
			<div v-for="[channelId, name] in store.channelInvites">
				<button @click="store.acceptInvite(channelId)">{{ name }}</button>
			</div>
			<!-- Ici on affiche tout les channels publics que l'ont peu rejoindre en cliquant -->


			<!-- ici on affiche tout les channels actuellement rejoints -->
			<!-- <p class="text-color-dark">Joined Channels:</p>
			<div v-for="[channelId, channel] in store.groupChannels">
				<button @click="selectChannel(channelId)">{{ channel.name }}</button>
			</div> -->

			<!-- <div v-if="this.currentChannel != undefined"> -->
			<!-- <div> -->
			<!-- <input type="text" v-model="messageInputBuffer">
				<button @click="SendMessage">Send</button>
				<button @click="sendInvite">Send Game Invite</button>
				<input type="checkbox" id="checkbox" v-model="customGameInvite">
				<label for="checkbox">Custom Game</label>
			</div> -->

			<!-- ici on affiche tout les DM ouverts -->
			<!-- <div v-for="[channelId, channel] in store.dmChannels">
				<button @click="selectDMChannel(channelId)">{{ channel.channel.users.map(a =>
					store.getUserName(a.userId))
				}}</button>
			</div> -->

			<!-- Ici on affiche un channel de groupe avec les messages et les options... -->
			<div v-if="this.currentChannel != undefined && store.isCurrentDM == false">
				<!-- <p>Current Channel : {{ this.currentChannel.name }}</p>
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
				</div> -->
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
		<!-- <div v-if="store.error != ''">
			{{ store.error }}
			<button @click="store.error = ''">clear Error</button>
		</div> -->
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
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 1fr 8fr 1fr;
	// grid-template-rows: 1fr;
	// background-color: rgba(0, 0, 0, 0.5);
}

.chan-can-join {
	padding: 1rem;
	overflow: scroll;
	max-height: 14vh;
}

.chat-list {
	// padding-left: 10px;
	color: white;
	border: 1px solid;
	height: 100vh;
	width: 100%;
	background-color: rgba(0, 0, 0, 1);
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow-wrap: break-word;
	align-items: center;
	// border-radius: 2%;
	// margin-top: 1rem;
	// grid-template-rows: 5vh 20vh 20vh 20vh 20vh 5vh;
}

.title-chat {
	color: white;
	font-size: 40px;
	text-transform: uppercase;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
}

.chat-box {
	height: 100%;
	width: 100%;
	overflow-wrap: break-word;
	// margin: 1rem;
	background-color: rgba(0, 0, 0, 0.5);
	// border-radius: 2%;
	border: 1px solid;
	color: white;
	font-weight: bold;
	overflow: scroll;
}

.send-message {
	width: 100%;
	height: 5vh;
	display: flex;
	border: 1px solid;
	color: white;
	border-radius: 2%;
}

.users {
	border: 1px solid;
	height: 100vh;
	width: 100%;
	background-color: rgba(0, 0, 0, 1);
	display: flex;
	flex-direction: column;
	color: white;
	overflow-wrap: break-word;
	overflow: scroll;
	align-items: center;
}

.avatar {
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	background-color: white;
	background-size: cover;
}

.grid-border {
	$border: 5px;
	color: #FFF;
	border-bottom: 1px solid;
	border-image: linear-gradient(0.25turn, rgb(66, 66, 66, 0), rgb(158, 158, 158, 10), rgb(255, 255, 255), rgb(158, 158, 158, 10), rgb(66, 66, 66, 0));
	border-image-slice: 1;
}</style>
