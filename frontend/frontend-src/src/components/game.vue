<script lang="ts">
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import game from '../scripts/game'
import user from '../scripts/user';
import { State } from '../scripts/state';
import { defineComponent } from 'vue';
import "../styles/profil.scss";

export default defineComponent({

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

	emits: ['logout']
})
</script>

<template>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]" style="justify-content: center;">
			<div v-show="user.darkMode == true">
				<div class="stars"></div>
				<div class="stars1"></div>
				<div class="stars2"></div>
			</div>
		<div style="width: 100vw; height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;">
			<!-- <h4>Game (state: {{ game.state.value }}) :</h4> -->
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
					<div class="player">
						<div class="player-info">
							<div class="avatar" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']"></div>
							<div class="login-player">LOGIN 1</div>
						</div>
						<div class="player-info">
							<div class="login-player">LOGIN 2</div>
							<div class="avatar" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']"></div>
						</div>
					</div>
					<gameCanvas :game="game.data" :shadow="shadow"></gameCanvas>
					<button style="z-index: 2;" @click="shadow = !shadow">shadows {{ shadow ? "off" : "on" }}</button>
					<button style="z-index: 2;" @click="game.surrender">Surrender</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.player {
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	height: 10vh;
	width: 100%;
	margin-bottom: 30px;
}

.player-info {
	display: flex;
}

.avatar {
	display: flex;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background-size: cover;
	border: 1px solid;
    color:white;
}

.login-player {
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;
	padding: 10px;
}

@media screen and (max-height: 300px) {
	.player {
		display: none;
	}
}

@media screen and (max-height: 500px) {
	.avatar {
		display: none;
	}
}

@media screen and (max-width: 400px) {
	.player {
		display: none;
	}
}

.avatar:before, .avatar:after {
	content: '';
	position: absolute;
	left: -2px;
	top: -2px;
	background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000, #fb0094, 
		#0000ff, #00ff00,#ffff00, #ff0000);
	background-size: 400%;
	width: calc(100% + 4px);
	height: calc(100% + 4px);
	z-index: -1;
	animation: steam 20s linear infinite;
}

@keyframes steam {
	0% {
		background-position: 0 0;
	}
	50% {
		background-position: 400% 0;
	}
	100% {
		background-position: 0 0;
	}
}

.block:after {
	filter: blur(50px);
}
</style>
