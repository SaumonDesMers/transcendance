<script lang="ts">
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
import statusGateway from './scripts/status'
import gameGateway from './scripts/game'
import chatGateway from './scripts/chat'
import friends from './components/friends.vue'
import history from './components/history.vue'
import createChat from './components/createChat.vue'
import chatSettings from './components/chatSettings.vue'
import { defineComponent } from 'vue'

export default defineComponent({

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
			state: State.MAIN,
			previousPage: 10,
			user,
			statusGateway,
			gameGateway,
			chatGateway
		}
	},

	methods: {
		// switchPage(state: {page: State, id?: number}) {
		// 	this.$router.push({ path: state.page, query: { id:state.id } });
		// 	this.state = state.page;
		// },
		makeid(length: number) {
			let result = '';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for (let i = 0; i < length; i++)
				result += characters.charAt(Math.floor(Math.random() * 62));
			return result;
		},
		connectToWebsocket() {
			if (!localStorage.sessionId)
				localStorage.sessionId = this.makeid(10);
			
			const jwt = this.$cookie.getCookie('jwt');
			this.gameGateway.connect(jwt);
			this.statusGateway.connect(jwt);
			this.chatGateway.connect(jwt);
		},
		logout() {
			gameGateway.disconnect();
			chatGateway.disconnectFromServer();
			statusGateway.disconnect();
			localStorage.removeItem('userId');
			this.$cookie.removeCookie('jwt');
			this.$router.push({ name: 'login' });
		}
	},

	mounted() {},

	created() {

		const jwt = this.$cookie.getCookie('jwt');

		if (jwt && localStorage.userId) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
			this.user.get();
			// this.state = window.history.state.current;
			this.connectToWebsocket();
		} else {
			// this.state = State.LOGIN;
			this.$router.replace({ name: 'login' });
		}

		// onpopstate = (event) => {
		// 	if (this.user.isLoggedIn && this.$cookie.getCookie('jwt'))
		// 		this.state = this.$route.path as State;
		// 	else
		// 		this.switchPage({ page: State.LOGIN });
		// };
	},

	watch: {
		$route(val, oldVal) {
			// this.state = this.$route.path as State;
		},
		state(val, oldVal) {
			if (oldVal == State.LOGIN && val != State.LOGIN)
				this.connectToWebsocket();
		},
		'gameGateway.state.value'(val, oldVal) {
			if (oldVal != 'game' && val == 'game')
				this.$router.push({ path: State.GAME });
				// this.switchPage({ page: State.GAME });
		},
	}
})

</script>

<template>
	<!-- <div v-if="state == State.LOGIN">
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
		<history @switchPage="switchPage" :display-user-id="user.id"></history>
	</div>
	<div v-else-if="state == State.CREATECHAT">
		<createChat @switchPage="switchPage"></createChat>
	</div>
	<div v-else-if="state == State.CHATSETTINGS">
		<chatSettings @switchPage="switchPage"></chatSettings>
	</div> -->
	<router-view @logout="logout"></router-view>
</template>

<style scoped></style>
