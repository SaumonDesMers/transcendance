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
			loggedIn: false,
			user: null,
		}
	},

	methods: {
		onLogin(user) {
			this.loggedIn = true;
			this.user = user;
		}
	},

	mounted() { },

	created() { },
}
</script>

<template>
	<!-- <p v-if="user != null">You are logged as {{ user.username }}</p> -->

	<!-- <div v-if="!loggedIn">
		<loginPage @loggedIn="user => onLogin(user)"></loginPage>
	</div>
	<div v-else> -->
		<!-- <register></register> -->
		<mainPage></mainPage>
		<!-- <chat></chat> -->
		<!-- <game></game> -->
	<!-- </div> -->
</template>

<style scoped></style>
