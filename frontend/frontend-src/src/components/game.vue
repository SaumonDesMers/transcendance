<script>
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import { Game } from '../scripts/game'

export default {

	components: {
		gameCanvas
	},

	computed: {
		game() {
			return this.globalGame;
		}
	},

	data() {
		return {}
	},

	methods: {},

	mounted() {},
	
	created() {},

	watch: {
		'globalGame': {
			handler: function (val, oldVal) {
				console.log('globalGame changed !');
			},
			deep: true
		}
	}
}
</script>

<template>

	<h4>Game (state: {{ game.state }}) :</h4>
	<!-- <p>{{ typeof game.game }}</p> -->

	<button @click="game.inc" >inc</button>
	<p>{{ game.test }}</p>

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
			<gameCanvas :game="game.game"></gameCanvas>
			<button @click="game.surrender">Surrender</button>
		</div>
	</div>


</template>

<style scoped>
.error {
	color: red;
}
</style>
