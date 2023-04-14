<script>
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import { GameGateway } from '../scripts/game'

export default {

	components: {
		gameCanvas
	},

	props: {
		gameGateway: GameGateway,
	},

	data() {
		return {
			// socket: null,
			// state: 'none',
			// game: null,
			// canvas: null,
		}
	},

	methods: {},

	mounted() {},
	
	created() {},
}
</script>

<template>

	<h4>Game (state: {{ gameGateway.state }}) :</h4>
	<!-- <p>{{ typeof gameGateway.game }}</p> -->

	<div v-if="gameGateway.socket.disconnected">
		<p class="error">You are disconnected !</p>
	</div>

	<div v-else>
		<div v-if="gameGateway.state == 'none'">
			<button @click="gameGateway.joinQueue">Play !</button>
		</div>
		<div v-else-if="gameGateway.state == 'queue'">
			<p>Waiting for another player...</p>
			<button @click="gameGateway.leaveQueue">Leave queue</button>
		</div>
		<div v-else>
			<gameCanvas :game="gameGateway.game"></gameCanvas>
			<button @click="gameGateway.surrender">Surrender</button>
		</div>
	</div>


</template>

<style scoped>
.error {
	color: red;
}
</style>
