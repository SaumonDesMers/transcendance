<script>
import axios from 'axios'
import io from "socket.io-client"
import loginPage from './components/login.vue'
import chat from './components/chat.vue'
import game from './components/game.vue'
import register from './components/register.vue'
import mainPage from './components/mainPage.vue'
import user from './components/profil.vue'
import edit from './components/edit.vue'

export default {

	components: {
		loginPage,
		chat,
		game,
		register,
		mainPage,
		user,
		edit,
	},

	data() {
		return {
			State: {
				LOGIN: 0,
				REGISTER: 1,
				MAIN: 2,
				GAME: 3,
				CHAT: 4,
				USER: 5,
				EDIT: 6,
				FRIENDS: 7,
				HISTORY: 8,
				STATISTICS: 9,
			},
			state: 0,
			previousPage: 10,
			loggedIn: false,
			user: null,
		}
	},

	methods: {
		onLogin(user) {
			this.state = this.State.MAIN;
			this.user = user;
		},
		onRegister() {
			this.state = this.State.REGISTER;
		},
		onGame() {
			this.state = this.State.GAME;
		},
		onProfil() {
			this.state = this.State.USER;
		},
		onChat() {
			this.state = this.State.CHAT;
		},
		onEdit(user) {
			this.state = this.State.EDIT;
			this.user = user;
		},
		updateUser() {
			this.state = this.State.USER;
		},
		onFriends() {
			this.state = this.State.FRIENDS;
		},
		onHistory() {
			this.state = this.State.HISTORY;
		},
		onStats() {
			this.state = this.State.STATISTICS;
		}
	},

	mounted() { 
		this.state = this.State.LOGIN;
	},

	created() { },
}
</script>

<template>
	<div v-if="state == State.LOGIN">
		<loginPage @onLogin="user => onLogin(user)" @onRegister="onRegister()"></loginPage>
	</div>
	<div v-else-if="state == State.REGISTER">
		<register @registered="user => onLogin(user)"></register>
	</div>
	<div v-else-if="state == State.MAIN">
		<mainPage @onGame="onGame()" @onProfil="onProfil()" @onChat="onChat()" @onStats="onStats()" @onHistory="onHistory()" @onFriends="onFriends()">
		</mainPage>
	</div>
	<div v-else-if="state == State.USER">
		<user @onEdit="user => onEdit(user)" @onChat="onChat()"></user>
	</div>
	<div v-else-if="state == State.GAME">
		<game></game>
	</div>
	<div v-else-if="state == State.CHAT">
		<chat></chat>
	</div>
	<div v-else-if="state == State.EDIT">
		<edit @updateUser="updateUser()"></edit>
	</div>
</template>

<style scoped></style>
