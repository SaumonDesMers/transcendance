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

	data() {
		return {
			State,
			state: State.LOGIN,
			previousPage: 10,
			loggedIn: false,
			user: new User(),
		}
	},

	methods: {
		switchPage(arg) {
			this.state = arg;
		},
		setUser(user) {
			this.user.set(user);
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
		<loginPage @switchPage="page => switchPage(page)" @user="user => setUser(user)"></loginPage>
	</div>
	<div v-if="state == State.VALIDATE_2FA">
		<validate2fa @switchPage="page => switchPage(page)" @user="user => setUser(user)"></validate2fa>
	</div>
	<div v-else-if="state == State.REGISTER">
		<register @switchPage="page => switchPage(page)" @user="user => setUser(user)"></register>
	</div>
	<div v-else-if="state == State.MAIN">
		<mainPage @switchPage="page => switchPage(page)"></mainPage>

	</div>
	<div v-else-if="state == State.USER">
		<user @switchPage="page => switchPage(page)"></user>
	</div>
	<div v-else-if="state == State.GAME">
		<game></game>
	</div>
	<div v-else-if="state == State.CHAT">
		<chat></chat>
	</div>
	<div v-else-if="state == State.EDIT">
		<edit @switchPage="page => switchPage(page)"></edit>
	</div>
</template>

<style scoped></style>
