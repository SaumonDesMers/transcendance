<script>
import axios from 'axios'
import io from "socket.io-client"
import loginPage from './components/login.vue'
import chat from './components/chat.vue'
import game from './components/game.vue'
import register from './components/register.vue'
import mainPage from './components/mainPage.vue'
import user from './components/profil.vue'


export default {

	components: {
		loginPage,
		chat,
		game,
		register,
		mainPage,
		user,
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
			},
			state: 0,
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
		<mainPage @onGame ="user => onGame()"></mainPage>
	</div>
	<div v-else-if="state == State.USER">
		<user></user>
	</div>
	<div v-else-if="state == State.GAME">
		<game></game>
	</div>
	<!-- <chat></chat> -->
</template>

<style scoped></style>
