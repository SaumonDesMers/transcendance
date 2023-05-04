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
import gameGateway from './scripts/game'
import friends from './components/friends.vue'
import history from './components/history.vue'

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
	},

	data() {
		return {
			State,
			state: {
				page: State,
				// uid: 0,
			},
			previousPage: 10,
			user,
			gameGateway,
		}
	},

	methods: {
		setState(page) {
			console.log('setState', page);
			console.log();
			this.state.page = page;
		},
		switchPage(page) {
			window.history.pushState({ current: page }, "", page);
			// this.$router.push({ path: page });
			console.log('switchPage', page);
			console.log('history.state', window.history.state);
			console.log('router', this.$router.currentRoute.value.path);
			console.log();
			this.setState(page);
		},
	},

	mounted() {},

	created() {

		console.log('created');
		console.log('history.state', window.history.state);
		console.log();

		const jwt = this.$cookies.get('jwt');

		if (jwt && localStorage.userId) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
			this.user.get();
			this.setState(window.history.state.current, 0);
		} else {
			this.setState(State.LOGIN, 0);
		}
		
		// window.addEventListener('popstate', (event) => {
		// 	console.log('popstate event');
		// 	console.log('event.state', event.state);
		// 	console.log('history.state', window.history.state);
		// 	console.log('router', this.$router.currentRoute.value.path);
		// 	console.log();
		// 	if (!!event.state) {
		// 		// this.setState(event.state.page, 0);
		// 		this.setState(window.history.state.current, 0);
		// 	}
		// });

		onpopstate = (event) => {
			console.log('onpopstate event');
			console.log('event.state', event.state);
			console.log('history.state', window.history.state);
			console.log('router', this.$router.currentRoute.value.path);
			console.log();
			if (!!event.state) {
				// this.setState(event.state.page, 0);
				this.setState(window.history.state.current, 0);
			}
		};
	},

	watch: {
		'state.page'(newValue, oldValue) {
			console.log('state changed from', oldValue, 'to', newValue);
			console.log();
			if (this.user.isLoggedIn && this.$cookies.get('jwt') && this.gameGateway.socket.disconnected) {
				this.gameGateway.connect(this.$cookies.get('jwt'));
			}
		}
	}
}
</script>

<template>
	<div v-if="state.page == State.LOGIN">
		<loginPage @switchPage="switchPage"></loginPage>
	</div>
	<div v-if="state.page == State.VALIDATE_2FA">
		<validate2fa @switchPage="switchPage"></validate2fa>
	</div>
	<div v-else-if="state.page == State.REGISTER">
		<register @switchPage="switchPage"></register>
	</div>
	<div v-else-if="state.page == State.MAIN">
		<mainPage @switchPage="switchPage"></mainPage>

	</div>
	<div v-else-if="state.page == State.USER">
		<profil @switchPage="switchPage"></profil>
	</div>
	<div v-else-if="state.page == State.FRIENDS">
		<friends @switchPage="switchPage"></friends>
	</div>
	<div v-else-if="state.page == State.GAME">
		<game></game>
	</div>
	<div v-else-if="state.page == State.CHAT">
		<chat></chat>
	</div>
	<div v-else-if="state.page == State.EDIT">
		<edit @switchPage="switchPage"></edit>
	</div>
	<div v-else-if="state.page == State.HISTORY">
		<history @switchPage="switchPage"></history>
	</div>
</template>

<style scoped></style>
