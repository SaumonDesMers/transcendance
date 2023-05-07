<script>
import axios from 'axios'
import io from "socket.io-client"
import loginPage from './components/login.vue'
import chat from './components/chat.vue'
import game from './components/game.vue'
import register from './components/register.vue'
import mainPage from './components/mainPage.vue'
import profil from './components/profil.vue'
import edit from './components/edit.vue'
import { State } from './scripts/state'
import validate2fa from './components/validate2fa.vue'
import toggle2fa from './components/toggle2fa.vue'
import user from './scripts/user'
import usersStatus from './scripts/status'
import gameGateway from './scripts/game'
import chatGateway from './scripts/chat'
import friends from './components/friends.vue'
import history from './components/history.vue'
import createChat from './components/createChat.vue'
import chatSettings from './components/chatSettings.vue'

export default {

	components: {
		loginPage,
		chat,
		game,
		register,
		mainPage,
		profil,
		edit,
		validate2fa,
		friends,
		history,
		createChat,
		chatSettings,
	},

	data() {
		return {
			State,
			state: State,
			previousPage: 10,
			user,
			usersStatus,
			gameGateway,
			chatGateway
		}
	},

	methods: {
		switchPage(page) {
			this.$router.push({ path: page });
			this.state = page;
			console.log('switchPage', page);
		},
		connectToWebsocket() {
			const jwt = this.$cookies.get('jwt');
			this.gameGateway.connect(jwt);
			this.usersStatus.connect(jwt);
			this.chatGateway.connect(jwt);
		}
	},

	mounted() {},

	created() {

		const jwt = this.$cookies.get('jwt');

		if (jwt && localStorage.userId) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
			this.user.get();
			this.state = window.history.state.current;
			this.connectToWebsocket();
		} else {
			this.state = State.LOGIN;
		}

		onpopstate = (event) => {
			if (this.user.isLoggedIn && this.$cookies.get('jwt'))
				this.state = this.$route.fullPath;
			else
				this.switchPage(State.LOGIN);
		};
	},

	watch: {
		state() {
			this.connectToWebsocket();
		},
		'gameGateway.state.value'(val, oldVal) {
			if (oldVal != 'game' && val == 'game')
				this.switchPage(State.GAME);
		},
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
		<profil @switchPage="switchPage"></profil>
	</div>
	<div v-else-if="state == State.FRIENDS">
		<friends @switchPage="switchPage" :user="user"></friends>
	</div>
	<div v-else-if="state == State.GAME">
		<game @switchPage="switchPage"></game>
	</div>
	<div v-else-if="state == State.CHAT">
		<chat @switchPage="switchPage"></chat>
	</div>
	<div v-else-if="state == State.EDIT">
		<edit @switchPage="switchPage"></edit>
	</div>
	<div v-else-if="state == State.HISTORY">
		<history @switchPage="switchPage"></history>
	</div>
	<div v-else-if="state == State.CREATECHAT">
		<createChat @switchPage="switchPage"></createChat>
	</div>
	<div v-else-if="state == State.CHATSETTINGS">
		<chatSettings @switchPage="switchPage"></chatSettings>
	</div>
</template>

<style scoped></style>
