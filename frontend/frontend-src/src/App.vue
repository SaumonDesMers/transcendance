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
import userLoader from './scripts/user.loader'
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
			chatGateway,
			userLoader,
		}
	},

	methods: {
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
			this.userLoader.connect(jwt);
		},
		logout() {
			gameGateway.disconnect();
			chatGateway.disconnectFromServer();
			statusGateway.disconnect();
			userLoader.disconnect();
			localStorage.removeItem('userId');
			this.$cookie.removeCookie('jwt');
			this.$router.push({ name: State.LOGIN });
		}
	},
	mounted() {

		const jwt = this.$cookie.getCookie('jwt');

		if (jwt && localStorage.userId) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
			this.user.get().catch(() => {
				this.logout();
			});
			this.connectToWebsocket();
		} else {
			this.$router.replace({ name: State.LOGIN });
		}
	},
	created() {

		const jwt = this.$cookie.getCookie('jwt');

		if (jwt && localStorage.userId) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
			this.user.get().catch(() => {
				this.logout();
			});
			this.connectToWebsocket();
		} else {
			this.$router.replace({ name: State.LOGIN });
		}

		onpopstate = (event) => {
			if (!this.user.isLoggedIn || !this.$cookie.getCookie('jwt'))
				this.$router.push({ name: State.LOGIN });
		};
	},

	watch: {
		$route(val, oldVal) {
			if (oldVal.name == State.LOGIN && val.name != State.LOGIN)
				this.connectToWebsocket();
		},
		'gameGateway.state.value'(val, oldVal) {
			if (oldVal != 'game' && val == 'game')
				this.$router.push({ name: State.GAME });
		},
	}
})

</script>

<template>
	<router-view @logout="logout"></router-view>
</template>

<style scoped></style>
