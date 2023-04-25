<script>
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import game from '../scripts/game'

export default {

	components: {
		gameCanvas
	},

	data() {
		return {
			game,
			shadow: false,
		}
	},

	methods: {},

	mounted() {},
	
	created() {},

}
</script>

<template>

	<h4>Game (state: {{ game.state.value }}) :</h4>
	<!-- <p>{{ game.data }}</p> -->

	<div v-if="game.socket.disconnected">
		<p class="error">You are disconnected !</p>
	</div>

	<div v-else>
		<div v-if="game.state.value == 'none'">
			<button @click="game.joinQueue('classic')">Play classic game !</button>
			<button @click="game.joinQueue('custom')">Play custom game !</button>
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


</template>

<style scoped>
.error {
	color: red;
}
</style>
