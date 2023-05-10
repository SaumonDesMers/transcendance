<script lang="ts">
import axios from 'axios'
import io from "socket.io-client"
import gameCanvas from './gameCanvas.vue'
import game from '../scripts/game'
import user, { User } from '../scripts/user';
import { State } from '../scripts/state';
import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		gameCanvas
	},

	data() {
		return {
			game,
			shadow: false,
			user,
			leftPlayer: new User(),
			rightPlayer: new User(),
		}
	},

	methods: {
		loadPlayers() {
			console.log('loading players');
			console.log(this.game.data.side[0].playerId);
			console.log(this.game.data.side[1].playerId);
			this.leftPlayer.loadUser(this.game.data.side[0].playerId);
			this.rightPlayer.loadUser(this.game.data.side[1].playerId);
		}
	},

	mounted() {
		if (this.game.data.loaded) {
			this.loadPlayers();
		}
	},

	watch: {
		'game.data.loaded': {
				handler: function (loaded) {
				if (loaded) {
					this.loadPlayers();
				}
			},
			deep: true
		}
	},

	emits: ['logout']
})
</script>

<template>
	<!-- class="main-page" :class="[user.darkMode == true ? '' : 'light ', user.coa]" -->
	<div  
		:style="[user.darkMode == true ? 'background-color: black' : 'background-color: whitesmoke']" style="justify-content: center;">
		<!-- <div v-show="user.darkMode == true">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div> -->
		<div
			style="width: 100vw; height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;">
			<!-- <h4>Game (state: {{ game.state.value }}) :</h4> -->
			<!-- <p>{{ game.data }}</p> -->

			<div v-if="game.socket.disconnected">
				<p class="error">You are disconnected !</p>
			</div>
			<div v-else>
				<div style="display: flex;" v-if="game.state.value == 'none'">
					<div class="button-container">
						<div class="classic-block" :class="[user.darkMode ? 'dark' : '']">
							<button class="classic-button" @click="game.joinQueue('NORMAL')">CLASSIC</button>
						</div>
					</div>
					<div class="button-container">
						<div class="custom-block" :class="[user.darkMode ? 'dark' : '']">
							<button class="custom-button" :class="[user.darkMode ? '' : 'light-cu']"
								@click="game.joinQueue('CUSTOM')">CUSTOM</button>
						</div>
					</div>

				</div>
				<div v-else-if="game.state.value == 'queue'">
					<div style="display: flex; align-items: baseline;"
						:style="[!user.darkMode ? 'color: black' : 'color: white']">
						<p style="font-size: 4vw;">Waiting for another player</p>
						<div :class="[!user.darkMode ? 'dots dark' : 'dots']">
							<div></div>
							<div></div>
							<div></div>
						</div>
						<button :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']" class="ornot-btn" @click="game.leaveQueue">OR NOT</button>
					</div>
				</div>
				<div v-else>
					<div class="player">
						<div class="player-info">
							<div class="avatar" :style="['background-image: url(\'' + leftPlayer.avatar.imageBase64 + '\')']">
							</div>
							<div class="login-player">{{ leftPlayer.username }}</div>
						</div>
						<div class="player-info">
							<div class="login-player">{{ rightPlayer.username }}</div>
							<div class="avatar" :style="['background-image: url(\'' + rightPlayer.avatar.imageBase64 + '\')']">
							</div>
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

<style lang="scss" src="../styles/profil.scss"></style>
<style lang="scss" scoped>

$alliance: #5F8D4E;
$order: #911F27;
$assembly: #674188;
$federation: #205295;

.ornot-btn {
    margin-left: 1rem;
    padding: 0 1rem 0 1rem;
	color: white;
    background-color: black;
    border: none;
    font-size: 3vw;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2%;
    margin-top: 2%;
    z-index: 10;
    text-decoration: none;
}

.ornot-btn.dark {
    background-color: rgba(125, 125, 125, 0.5);
}

.ALLIANCE-ornot-btn {
	&:hover, &:active {
		background-color: $alliance;
	}
}

.ASSEMBLY-ornot-btn {
	&:hover, &:active {
		background-color: $assembly;
	}
}

.FEDERATION-ornot-btn {
	&:hover, &:active {
		background-color: $federation;
	}
}

.ORDER-ornot-btn {
	&:hover, &:active {
		background-color: $order;
	}
}

@keyframes fx {
	50% {
		transform: scale(1);
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}

@mixin animation($delay: 0ms) {
	$animation-speed: 1000ms;
	animation: fx $animation-speed ease infinite $delay;
}

.dots>* {
	$animation-speed: 1000ms;
	$dot-size: 0.8vw;
	width: $dot-size;
	height: $dot-size;
	border: ($dot-size / 5) solid white;
	border-radius: 50%;
	float: left;
	margin: 0 ($dot-size / 5);
	transform: scale(0);
	@include animation;

	&:nth-child(2) {
		@include animation($animation-speed * 0.33);
	}

	&:nth-child(3) {
		@include animation($animation-speed * 0.66);
	}
}

.dots.dark>* {
	$dot-size: 0.8vw;
	border: ($dot-size / 5) solid black;
}

.classic-button {
	font-size: 2rem;
	position: relative;
	width: 30vh;
	height: 3rem;
	transform: rotate(-90deg);
	z-index: 1;
	border: none;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 200px;
	color: white;
	overflow-wrap: break-word;
}

.custom-button {
	font-size: 2rem;
	position: relative;
	width: 30vh;
	height: 3rem;
	transform: rotate(90deg);
	z-index: 1;
	border: none;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 200px;
	color: white;
	overflow-wrap: break-word;
}

.light-cu {
	background-color: rgba(200, 200, 200, 0.5);
}

.custom-block,
.classic-block {
	position: relative;
}

.classic-block:before,
.classic-block:after {
	border-radius: 300px;
	transform: rotate(-90deg);
	content: '';
	position: absolute;
	left: -2px;
	top: -2px;
	background: linear-gradient(45deg,
			rgba(255, 255, 255, 1), rgba(0, 0, 0, 1),
			rgba(255, 255, 255, 1), rgba(0, 0, 0, 1),
			rgba(255, 255, 255, 1), rgba(0, 0, 0, 1),
			rgba(255, 255, 255, 1));
	background-size: 400%;
	width: calc(100% + 4px);
	height: calc(100% + 4px);
	animation: steam 20s linear infinite;
}

.custom-block:before,
.custom-block:after {
	border-radius: 300px;
	transform: rotate(90deg);
	content: '';
	position: absolute;
	left: -2px;
	top: -2px;
	background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094,
			#0000ff, #00ff00, #ffff00, #ff0000);
	background-size: 400%;
	width: calc(100% + 4px);
	height: calc(100% + 4px);
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

.custom-block:after,
.classic-block:after {
	filter: blur(0px);
}

.dark.custom-block:after,
.dark.classic-block:after {
	filter: blur(20px);
}

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

.button-container {
	display: flex;
	width: 50vw;
	height: 100vh;
	justify-content: center;
	align-items: center;
}

.avatar {
	display: flex;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background-size: cover;
	border: 1px solid;
	color: white;
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

.avatar:before,
.avatar:after {
	content: '';
	position: absolute;
	left: -2px;
	top: -2px;
	background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094,
			#0000ff, #00ff00, #ffff00, #ff0000);
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

</style>
