<script lang="ts">
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import {
	GroupChannelDTO,
	ChannelDTO,
	ChatUserDTO,
	MessageDTO,
	joinRequestDTO,
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
import { defineComponent, reactive } from 'vue';
import mute from './mute.vue';
import Mute from './mute.vue';
import moment from 'moment';

export default defineComponent({
	data() {
		return {
			State,
			user,
			messageInputBuffer: "",
			channelInputBuffer: "",
			keyInputBuffer: "",
			setKeyInputBuffer: "",
			userNameInputBuffer: "",
			dmInputBuffer: "",
			customGameInvite: false,
			searchInput: "",
			searchArray: [] as {
				username: string;
				id: number;
			}[],
			store,
			onInvit: false,
			showMP: false,
			showChannel: false,
			yourChan: false,
			displayKey: false,
			tmpChannel: 0,
			KeyInputBuffer: "",
			moderationUser: false,
			tmpUser: "",
			showMute: false,
			selectedMute: 0 as number,
		};
	},
	mounted() {
	},
	computed: {
		currentChannel() {
			return store.getCurrentChannel();
		},
		currentGroupChannel() {
			return store.getCurrentGroupChannel();
		},
		currentDMChannel() {
			return store.getCurrentDM();
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
			store.connect(this.$cookie.getCookie("jwt"));
		},
		disconnectFromServer() {
			// this.socket.disconnect();
			store.disconnectFromServer();
		},
		selectChannel(id: number) {
			store.selectChannel(id, false);
		},
		clickInvite() {
			this.onInvit = !this.onInvit;
		},
		selectDMChannel(id: number) {
			store.selectChannel(id, true);
		},
		displayJoinChannel() {
			this.showChannel = !this.showChannel;
		},
		displayYourChan() {
			this.yourChan = !this.yourChan;
		},
		displayMP() {
			this.showMP = !this.showMP;
		},
		async createChannel() {
			console.log("creating channel:", user.id);
			console.log("creating channel:", store.user.userId);
			const channel: CreateGroupChannelDto = {
				ownerId: store.user.userId,
				name: this.channelInputBuffer,
				type: "PUBLIC",
				usersId: [],
				key: this.keyInputBuffer
			};
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
		async muteUser(targetId: number) {

			store.mute_user(targetId, this.selectedMute);
		}
	},
	watch: {
		searchInput() {
			store.search_user(this.searchInput).then((arr) => {
				this.searchArray = arr;
			});
		}
	},
	created() { },
	emits: ["logout"],
	components: { Mute }
})

</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

	
	<div class="error-box" v-if="store.error">
		<div :class="[user.darkMode == true ? 'dark' : 'light']" v-if="store.error != ''">
			{{ store.error }} </div>
		<button @click="store.error = ''">clear Error</button>
	</div>

	<div class="chat" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div v-if="user.darkMode == false">
			<div class="sun"></div>
			<!-- <div class="cloud cloud0"></div>
				<div class="cloud cloud1"></div>
				<div class="cloud cloud2"></div> -->
		</div>
		<div v-else="user.darkMode == true">
			<div style="width: 0;">
				<div class="moon" style="z-index: -1; position: fixed; top: 1rem;">
					<div class="dark">
					</div>
					<div class="dark">
					</div>
					<div class="dark">
					</div>
				</div>
			</div>
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
			<div class="shooting-stars"></div>
		</div>
		<div class="chat-container">
			<div class="chat-list" :class="[user.darkMode == true ? 'dark' : 'light']">
				<div style="height: 4vh;">
					<p style="position:relative; margin-left: 8.5rem; display:flex; justify-content: end; margin-top: 0.5rem; font-size: 2vw;"
						class="fa-solid fa-plus" @click="$router.push({ name: State.CREATECHAT })"></p>
					<!-- <p class="fa-solid fa-plus" style="position:fixed; font-size: 1.5vw; margin-top: 0.2rem; color:black"></p> -->
				</div>
				<div>
					<p class="grid-border" :class="[user.darkMode == true ? 'text-color-dark' : 'text-color-light']"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;" @click="displayYourChan()">Your
						channels </p>
					<div v-show="yourChan" class="chan-can-join">
						<div v-for="[channelId, channel] in store.groupChannels">
							<button @click="selectChannel(channelId)"
								style="color: white; font-size: 15px; border: none; background-color: transparent;">{{
									channel.name }}</button>
						</div>
					</div>
				</div>
				<div>
					<p class="grid-border" :class="[user.darkMode == true ? 'text-color-dark' : 'text-color-light']"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;" @click="displayMP()">Private
						message</p>
					<div v-show="showMP" class="chan-can-join">
						<input style="background-color: transparent; color:white" type='test' v-model="dmInputBuffer">
						<button class="nocolor-btn" style="color:white" @click="store.startDM(dmInputBuffer)">send
							message</button>
						<div v-for="[channelId, channel] in store.dmChannels">
							<button @click="selectDMChannel(channelId)"
								style="color: white; font-size: 15px; border: none; background-color: transparent;">{{
									store.getUserName(channel.channel.users[0].userId)
								}}</button>
						</div>
					</div>
				</div>
				<div>
					<p class="grid-border" :class="[user.darkMode == true ? 'text-color-dark' : 'text-color-light']"
						style="overflow:auto; padding-top: 0.5rem; padding-bottom: 0.5rem;" @click="displayJoinChannel()">
						Join channel</p>
					<div v-show="showChannel" class="chan-can-join">
						<div v-for="[channelId, channel] in store.publicChannels">
							<button @click="store.joinChannel({ channelId })"
								style="color: white; font-size: 15px; border: none; background-color: transparent;">{{
									channel.name }}</button>
						</div>
						<div v-for="[channelId, channel] in store.keyChannels">
							<p style="color: white; font-size: 15px; border: none; background-color: transparent;"
								@click="tmpChannel = channel.channelId; displayKey = !displayKey;">{{ channel.name }}
							<p class="fa-solid fa-lock"></p>
							</p>
							<div :style="[tmpChannel == channel.channelId && displayKey ? '' : 'display:none;']">
								<input
									style="width: 9%; position:absolute; left: 10px; display:flex; justify-content: end;  font-size: 1vw"
									type="text" v-model="KeyInputBuffer" />
								<button style="margin-top: 1rem;"
									@click="store.joinChannel({ channelId, key: KeyInputBuffer }); displayKey = false">Join
									channel</button>
							</div>
						</div>
					</div>
				</div>
				<div
					style="margin-top:45%; height: 5vh; margin-left: -5px; display: flex; align-items: center; padding-top: 0.5rem; padding-bottom: 0.5rem;">
					<div class="avatar" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']"></div>
					<router-link style="margin-left: 0.7rem;" :to="{ name: 'profile', params: { id: user.id } }"
						:class="[user.darkMode == true ? 'text-color-dark' : 'text-color-light']">{{ user.username
						}}</router-link>
				</div>
			</div>
			<div class="chat-box" :class="[user.darkMode == true ? 'dark' : 'light']">
				<div v-if="currentChannel != undefined">
					<div class="grid-border">
						<p v-if="currentGroupChannel != undefined" class="title-chat"
							:class="[user.darkMode == true ? 'text-color-dark' : 'text-color-light']">
							{{ currentGroupChannel.name }}
						</p>
						<p v-else-if="currentDMChannel != undefined" class="title-chat"
							:class="[user.darkMode == true ? 'text-color-dark' : 'text-color-light']"
							@click="$router.push({ name: State.USER, params: { id: currentDMChannel.channel.users[0].userId } })">
							{{ store.getUserName(currentDMChannel.channel.users[0].userId) }}
						</p>
					</div>
				</div>
				<div v-if="currentChannel != undefined">
					<!-- <p>Current Channel : {{ currentChannel.name }}</p>
						<p>Channel Owner: {{ store.getUserName(currentChannel.owner?.userId) }}</p> -->
					<div class="conversation" style="overflow: scroll; height: 80vh;">
						<div v-for="message in currentChannel?.channel.messages">
							<p v-if="!store.isBlocked(message.author.userId)">
								{{ store.getUserName(message.author.userId) }} : {{ message.content }}
							<p v-if="message.gameInvite != undefined">
								Game Invite status: {{ message.gameInvite.status }}
								<button v-if="message.gameInvite.status == 'PENDING'"
									@click="store.acceptGameInvite(message)">Join</button>
							</p>
							</p>
						</div>
						<!-- <div v-for="user in currentChannel?.channel.users"> -->
						<!-- <p>{{ store.getUserName(user.userId) }}</p>
									<button @click="store.kick_user(user.userId)">kick</button>
									<button @click="store.ban_user(user.userId, true)">ban</button>
								</div> -->
					</div>
				</div>

				<div v-if="currentChannel != undefined" class="send-message">
					<textarea class="input-message" type="text" v-model="messageInputBuffer"></textarea>
					<div style="display: flex; flex-direction: column; justify-content: space-between;">
						<button class="fa-solid fa-paper-plane text-color-dark"
							style="font-size: 1.5vw; color: white; padding: 0.5rem; background-color: transparent; border: none;"
							@click="SendMessage"></button>
						<button class="fa-solid fa-gamepad text-color-dark"
							style="font-size: 1.5vw; padding: 0.5rem; background-color: transparent; border: none;"
							:style="[customGameInvite ? 'background: -webkit-linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : 'background: transparent; color: white']"
							@click="sendInvite"></button>
						<input style="font-size:1.5vw; padding: 0.5rem;" type="checkbox" id="checkbox"
							v-model="customGameInvite">
						<label for="checkbox"></label>
					</div>
				</div>
			</div>
			<div class="users" :class="[user.darkMode == true ? 'dark' : 'light']">
				<div v-if="currentChannel != undefined">
					<div style="height: 2rem;">
						<input id="invite" type="radio" value="KEY" @click="clickInvite()" class="nodisplay visibility ">
						<label for="invite">
							<i class="fa-solid fa-user-plus"
								style="position:absolute; right: 10px; display:flex; justify-content: end; margin-top: 0.5rem; font-size: 1vw"></i>
						</label>
						<div :style="[onInvit ? '' : 'display:none']">
							<input
								style="width: 9%; position:absolute; right: 10px; display:flex; justify-content: end; margin-top: 2rem; font-size: 1vw"
								type="text" v-model="searchInput" />
							<div>
								<p v-for="user in searchArray">{{
									user.username }}
									<button @click="store.invite_user(user.id, true)">Invite
										User</button>
								</p>
							</div>
						</div>
						<p v-show="!onInvit"
							style="position:absolute; right: 10px; display:flex; justify-content: end; margin-top: 0.5rem; font-size: 1vw; margin-right: 2rem;"
							class="fa-solid fa-gear" @click="$router.push({ name: State.CHATSETTINGS })"></p>
						<p v-show="!onInvit"
							style="position:absolute; right: 40px; display:flex; justify-content: end; margin-top: 0.5rem; font-size: 1vw; margin-right: 2rem;"
							class="fa-solid fa-arrow-right-from-bracket" @click="leaveChannel()"></p>
					</div>
					<div v-show="!onInvit">
						<p v-if="currentGroupChannel != undefined">
							{{ store.getUserName(currentGroupChannel.ownerId) }}
						<p class="fa-solid fa-crown" style="padding:10px; color: gold"></p>
						</p>
						<div v-for="user in currentChannel?.channel.users">
							<p @click="moderationUser = !moderationUser; tmpUser = store.getUserName(user.userId)">
								{{ store.getUserName(user.userId) }}
							<p class="fa-solid fa-ellipsis-v" style="padding:10px; color: rgb(255, 255, 255)"></p>
							</p>
							<div
								:style="[tmpUser == store.getUserName(user.userId) && moderationUser ? '' : 'display:none;']">
								<p style="margin-top: 1rem;">
								<div v-if="currentGroupChannel != undefined">
									<button class="nocolor-btn" style="color:white"
										@click="showMute = !showMute">Mute</button>
									<!-- <mute v-if="showMute" :target-id="user.userId"></mute> -->





									<div v-if="showMute" class="main-page" :class="['dark']">
										<div style="width: 0; height: 0;">
											<div class="stars"></div>
											<div class="stars1"></div>
											<div class="stars2"></div>
										</div>

										<div
											style="display: flex; justify-content: center; align-items: center; align-content: center; position:absolute; top:10%; left:10%;">
											<div class="mute-chat-container">
												<h1 class="title">Mute {{ store.getUserName(user.userId) }} for : </h1>

												<select v-model="selectedMute">
													<option style="color: white" disabled>Please select one mute option
													</option>
													<option value="1">10 minutes</option>
													<option value="30">30 minutes</option>
													<option value="60">1 hour</option>
													<option value="180">3 hours</option>
													<option value="1440">24 hours</option>
												</select>
												<!-- enregistre avant de revenir a la page precedente -->
												<button class="chat-btn"
													@click="muteUser(user.userId); showMute = false">Save</button>
												<!-- ne change rien et fait revenir a la page precedente -->
												<button class="chat-btn" @click="showMute = false">Cancel</button>

											</div>
										</div>
									</div>







									<button class="nocolor-btn" style="color:white" v-if="!store.isBlocked(user.userId)"
										@click="store.startDM(store.getUserName(user.userId))">DM</button>
									<button class="nocolor-btn" style="color:white" v-if="store.isAdmin(store.user.userId)"
										@click="store.kick_user(user.userId)">kick</button><br>
									<button class="nocolor-btn" style="color:white"
										v-if="store.isAdmin(store.user.userId) && !store.isAdmin(user.userId)"
										@click="store.ban_user(user.userId, true)">ban</button>
									<button class="nocolor-btn" style="color:white"
										v-if="store.isAdmin(store.user.userId) && !store.isAdmin(user.userId)"
										@click="store.user_admin(user.userId, true)">Set Admin</button>
									<button class="nocolor-btn" style="color:white"
										v-if="store.isAdmin(store.user.userId) && store.isAdmin(user.userId) && !store.isOwner(user.userId)"
										@click="store.user_admin(user.userId, false)">Unset Admin</button>
								</div>

								<button class="nocolor-btn" style="color:white" v-if="!store.isBlocked(user.userId)"
									@click="store.block_user(user.userId, true)">Block</button>
								<button class="nocolor-btn" style="color:white" v-else
									@click="store.block_user(user.userId, false)">Unblock</button>

								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<input type='test' v-model="keyInputBuffer">
				<!-- <button @click="joinChannel">Join Channel</button>
					<button @click="leaveChannel">Leave Channel</button> -->
				<button @click="store.startDM(channelInputBuffer)">Start DM</button>
			</div>
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

			<!-- <div v-if="currentChannel != undefined"> -->
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
			<!-- <div v-if="currentChannel != undefined && store.isCurrentDM == false"> -->
			<!-- <p>Current Channel : {{ currentChannel.name }}</p>
								<p>Channel Owner: {{ store.getUserName(currentChannel.owner?.userId) }}</p>
				<div v-for="message in currentChannel?.channel.messages">
					<p>
						{{ store.getUserName(message.author.userId) }} : {{ message.content }}
						<p v-if="message.gameInvite != undefined">
							Game Invite status: {{ message.gameInvite.status }}
							<button v-if="message.gameInvite.status == 'PENDING'"
							@click="store.acceptGameInvite(message)">Join</button>
						</p>
					</p>
				</div> -->
			<!-- <div v-for="user in currentChannel?.channel.users"> -->
			<!-- <button @click="">ban</button> -->
			<!-- <p>{{ store.getUserName(user.userId) }}</p>
						<button @click="store.kick_user(user.userId)">kick</button>
						<button @click="store.ban_user(user.userId, true)">ban</button>
					</div> -->

			<!-- AFFICHAGE SPECIFIQUE A UN CHANNEL PRIVÉ -->
			<!-- <div v-if="currentChannel?.type == 'PRIV' || currentChannel?.type == 'PUBLIC'">
						<p>Invited Users:</p>
						<div v-for="user in currentChannel?.invited">
							<p> {{ store.getUserName(user.userId) }}</p>
						</div>
						<div v-for="user in currentChannel?.channel.users"> -->
			<!-- <button @click="">ban</button> -->
			<!-- <p>{{ store.getUserName(user.userId) }}</p>
								<button @click="store.kick_user(user.userId)">kick</button>
								<button @click="store.ban_user(user.userId, true)">ban</button>
							</div> -->

			<!-- AFFICHAGE SPECIFIQUE A UN CHANNEL PRIVÉ -->
			<!-- <div v-if="currentChannel?.type == 'PRIV' || currentChannel?.type == 'PUBLIC'">
								<p>Invited Users:</p>
								<div v-for="user in currentChannel?.invited">
									<p> {{ store.getUserName(user.userId) }}</p>
								</div>
								<input type="text" v-model="userNameInputBuffer"> -->
			<!-- Exemple d'un appel a la fonction Pour invite et uninvite un user -->
			<!-- <button @click="store.invite_user(userNameInputBuffer, true)">Invite User</button>
									<button @click="store.invite_user(userNameInputBuffer, false)">Uninvite User</button> -->
			<!-- </div> -->

			<!-- Exemple d'un appel a la fonction Pour invite et uninvite un user -->
			<!-- <button @click="store.invite_user(userNameInputBuffer, true)">Invite
										User</button>
										<button @click="store.invite_user(userNameInputBuffer, false)">Uninvite
											User</button>
				</div> -->

			<!-- AFFICHAGE SPECIFIQUE A UN CHANNEL PROTEGE PAR CLÉ -->
			<!-- <div v-if="currentChannel?.type == 'KEY'">
					<input type="text" v-model="setKeyInputBuffer">
					
					<button @click="store.setChanKey(setKeyInputBuffer)">Set Chan Key</button>
				</div> -->

			<!-- un exemple d'un ensemble de boutons pour changer le type du channel actuellement selectionné -->

			<!-- <button @click="store.setChanType('PUBLIC')">Set Channel Public</button> -->
			<!-- <button @click="store.setChanType('PRIV')">Set Channel Private</button> -->

			<!-- ça c'est à l'arrache faut pas faire ça ( j'ai la même var d'input que le champ du dessus) -->
			<!-- <input type="text" v-model="setKeyInputBuffer"> -->

			<!-- <button @click="store.setChanKey(setKeyInputBuffer)">Set Chan Key</button> -->
			<!-- </div> -->

			<!-- un exemple d'un ensemble de boutons pour changer le type du channel actuellement selectionné -->

			<!-- <button @click="store.setChanType('PUBLIC')">Set Channel Public</button> -->
			<!-- <button @click="store.setChanType('PRIV')">Set Channel Private</button> -->

			<!-- ça c'est à l'arrache faut pas faire ça ( j'ai la même var d'input que le champ du dessus) -->
			<!-- <input type="text" v-model="setKeyInputBuffer"> -->

			<!-- <button @click="store.setChanType('KEY', setKeyInputBuffer)">Set Channel KeyProtected</button> -->
			<!-- </div> -->

			<!-- <div v-if="currentChannel != undefined && store.isCurrentDM == true"> -->
			<!-- <p>Chat With -->
			<!-- <p v-for="user in currentChannel?.channel.users">{{ store.getUserName(user.userId) }}</p> -->
			<!-- </p> -->

			<!-- <div v-for="message in currentChannel?.channel.messages"> -->
			<!-- <p> -->
			<!-- {{ store.getUserName(message.author.userId) }} : {{ message.content }} -->
			<!-- <p v-if="message.gameInvite != undefined"> -->
			<!-- Game Invite status: {{ message.gameInvite.status }}
										<button v-if="message.gameInvite.status == 'PENDING'"
										@click="store.acceptGameInvite(message)">Join</button>
									</p>
								</p>
							</div>
						</div> -->

		</div>
		<!-- <button @click="">ban</button> -->


		<!-- affichage de la dernière erreur reçue -->
		<!-- avec un bouton pour reset -->
		<!-- pb : a decaler au centre de la page (mais je n'y arrive pas acyuellement deso) -->
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
	z-index: 3;
}

.text-color-light {
	color: white;
	font-size: 20px;
	text-transform: uppercase;
	text-align: center;

	&:hover,
	&:active {
		color: rgb(0, 0, 0, 1);
	}
}

.visibility {
	visibility: hidden;
}

.nodisplay {
	display: none;
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
}

.linear-text {
	background: -webkit-linear-gradient(#eee, #333);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.chan-can-join {
	padding: 1rem;
	overflow: scroll;
	max-height: 25vh;
}

.dark {
	background-color: rgba(0, 0, 0, 0.5);
}

.light {
	background-color: rgba(0, 0, 0, 0.5);
}

.chat-list {
	z-index: 5;
	color: white;
	border: 1px solid;
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow-wrap: break-word;
	align-items: center;
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
	z-index: 5;
	// height: 100%;
	width: 100%;
	overflow-wrap: break-word;
	background-color: rgba(0, 0, 0, 0.25);
	border-top: 1px solid;
	border-bottom: 1px solid;
	color: white;
	font-weight: bold;
	overflow: scroll;
}

.error-box {
	z-index: 100;
	position: relative;
	height: 150%;
	width: 150%;
	overflow-wrap: break-word;
	background-color: rgb(0, 0, 0, 0.25);
	border: 1px solid;
	color: white;
	font-weight: bold;
	text-align: center;
}

.send-message {
	z-index: 5;
	width: 100%;
	height: 14.6vh;
	display: flex;
	border-top: 1px solid;
	color: white;
	background-color: rgba(0, 0, 0, 0);
}

.input-message {
	padding: 0.5rem;
	width: 80vw;
	height: 14.6vh;
	background-color: rgba(0, 0, 0, 0);
	border: none;
	overflow-wrap: break-word;
	resize: none;
	color: white;
	border-color: transparent;
	outline: none;
	overflow: auto;
}

.users {
	z-index: 5;
	border: 1px solid;
	height: 100vh;
	width: 100%;
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
