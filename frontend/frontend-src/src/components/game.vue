<script>
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import game from '../scripts/game'
import { User } from '../scripts/user';

export default {

	components: {
		gameCanvas
	},

	data() {
		return {
			game,
			user : new User(),
		}
	},

	methods: {},

	mounted() { },

	created() { },

	watch: {
		'game.state': {
			handler: function (val, oldVal) {
				// console.log('game state changed !');
			},
			deep: true
		}
	}
}
</script>

<template>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]" style="justify-content: center;">
		<div style="width: 80vw; height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;">
			<h4>Game (state: {{ game.state }}) :</h4>
			<!-- <p>{{ game.data }}</p> -->

			<div v-if="game.socket.disconnected">
				<p class="error">You are disconnected !</p>
			</div>

			<div v-else>
				<div v-if="game.state == 'none'">
					<button @click="game.joinQueue">Play !</button>
				</div>
				<div v-else-if="game.state == 'queue'">
					<p>Waiting for another player...</p>
					<button @click="game.leaveQueue">Leave queue</button>
				</div>
				<div v-else>
					<gameCanvas :game="game.data"></gameCanvas>
					<button @click="game.surrender">Surrender</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.error {
	color: red;
}
</style>
