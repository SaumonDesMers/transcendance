<script>
import axios from 'axios'
import io from "socket.io-client"
import loginPage from './components/login.vue'
import chat from './components/chat.vue'
import game from './components/game.vue'
import register from './components/register.vue'
import mainPage from './components/mainPage.vue'

export default {

	components: {
		loginPage,
		chat,
		game,
		register,
		mainPage,
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

		}
	},

	mounted() { this.state = this.State.LOGIN },

	created() { },
}
</script>

<template>
	<!-- <p v-if="user != null">You are logged as {{ user.username }}</p> -->

	<div v-if="state == State.LOGIN">
		<loginPage @loggedIn="user => onLogin(user)" @toRegister="onRegister()"></loginPage>
	</div>
	<div v-else-if="state == State.REGISTER">
		<register></register>
	</div>
	<div v-else-if="state == State.MAIN">
		<mainPage></mainPage>
	</div>
	<!-- <chat></chat> -->
	<!-- <game></game> -->
</template>

<style scoped></style>
