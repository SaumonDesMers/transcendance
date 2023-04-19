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
import { State } from './scripts/state'
import validate2fa from './components/validate2fa.vue'
import toggle2fa from './components/toggle2fa.vue'
import { User } from './scripts/user'
import gameGateway from './scripts/game'

export default {

	components: {
		loginPage,
		chat,
		game,
		register,
		mainPage,
		user,
		edit,
		validate2fa,
	},

	computed: {
		game() {
			return this.globalGame;
		}
	},

	data() {
		return {
			State,
			state: State.LOGIN,
			previousPage: 10,
			// loggedIn: false,
			user: new User(),
			gameGateway,
		}
	},

	methods: {
		switchPage(arg) {
			this.state = arg;
		},
	},

	mounted() {
		if (this.user.isLog())
			this.state = State.MAIN;
		else
			this.state = State.LOGIN;
	},

	created() { },

	watch: {
		state() {
			if (this.user.isLog() && this.gameGateway.socket.disconnected) {
				this.gameGateway.connect(this.$cookies.get('jwt'));
			}
		}
	}
}
</script>

<template>
	<div v-if="state == State.LOGIN">
		<loginPage @switchPage="switchPage"></loginPage>
	</div>
	<div v-if="state == State.VALIDATE_2FA">
		<validate2fa @switchPage="switchPage"></validate2fa>
	</div>
	<div v-else-if="state == State.REGISTER">
		<register @switchPage="switchPage"></register>
	</div>
	<div v-else-if="state == State.MAIN">
		<mainPage @switchPage="switchPage"></mainPage>

	</div>
	<div v-else-if="state == State.USER">
		<user @switchPage="switchPage"></user>
	</div>
	<div v-else-if="state == State.GAME">
		<game></game>
	</div>
	<div v-else-if="state == State.CHAT">
		<chat></chat>
	</div>
	<div v-else-if="state == State.EDIT">
		<edit @switchPage="switchPage"></edit>
	</div>
</template>

<style scoped></style>
