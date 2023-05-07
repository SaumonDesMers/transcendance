<script>
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import game from '../scripts/game'
import user from '../scripts/user';
import { State } from '../scripts/state';

export default {

	components: {
		gameCanvas
	},

	data() {
		return {
			game,
			shadow: false,
			user,
		}
	},

	methods: {},

	mounted() {},

	created() {},

}
</script>

<template>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]" style="justify-content: center;">
		<div style="width: 100vw; height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;">
			<h4>Game (state: {{ game.state.value }}) :</h4>
			<!-- <p>{{ game.data }}</p> -->
			
			<div v-if="game.socket.disconnected">
				<p class="error">You are disconnected !</p>
			</div>
			<div v-else>
				<div v-if="game.state.value == 'none'">
					<button @click="game.joinQueue('NORMAL')">Play classic game !</button>
					<button @click="game.joinQueue('CUSTOM')">Play custom game !</button>
				</div>
				<div v-else-if="game.state.value == 'queue'">
					<p>Waiting for another player...</p>
					<button @click="game.leaveQueue">Leave queue</button>
				</div>
				<div v-else>
					<button @click="shadow = !shadow">shadows {{ shadow ? "off":"on" }}</button>
					<gameCanvas :game="game.data" :shadow="shadow"></gameCanvas>
					<button @click="game.surrender">Surrender</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/profil.scss">
</style>
