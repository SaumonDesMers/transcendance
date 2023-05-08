<script>

import axios from 'axios'
import { State } from '../scripts/state';
import user from '../scripts/user';
import gameGateway from '../scripts/game';
import chatGateway from '../scripts/chat';
import statusGateway from '../scripts/status';

export default {
	data: function () {
		return {
			matches: [
			],
			State,
			status: false,
			user,
		}
	},
	methods: {
		toggleDarkMode() {
			this.user.set({ darkMode: !this.user.darkMode });
			this.user.save();
		},
		switchPage(page) {
			this.$emit('switchPage', page);
		},
		logout() {
			gameGateway.disconnect();
			chatGateway.disconnectFromServer();
			statusGateway.disconnect();
			localStorage.removeItem('userId');
			this.$cookies.remove('jwt');
			this.switchPage(State.LOGIN);
		},
	},
	mounted() { },
	emits: ['switchPage']
}
</script>

<template>
	<head>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	</head>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div style="width: 100vw; height: 100vh;">
			<div
				:class="[user.darkMode == true ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="banner-profile" :class=user.coa>
					<div class="avatar-profile" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']">
						<div class="status-profile"
							:style="[user.id ? 'background-color: green' : 'background-color: gray']"></div>
					</div>
					<span class="profile-toggle" @click="toggleDarkMode" style="display: flex;">
						<div :class="[user.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']" style="font-size: 1.5vw">
						</div>
					</span>
				</div>
				<div class="profile-grid" style="overflow: scroll;">
					<div class="information-profile-container">
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="switchPage(State.GAME)">play</div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="switchPage(State.CHAT)">chat</div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.username }} </div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.coa }} </div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark fa-solid fa-edit' : 'text-nav text-color-light fa-solid fa-edit']"
							@click="switchPage(State.EDIT)"></div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark fa-solid fa-right-from-bracket' : 'text-nav text-color-light fa-solid fa-right-from-bracket']"
							@click="logout"></div>
					</div>
					<div class="bio-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">Bio</div>
						<div class="child-container"> {{ user.bio }}</div>
					</div>
					<div class="friend-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="switchPage(State.FRIENDS)">friends</div>
						<div class="grid-friend" style="overflow: scroll;">
							<div class="friend">
								<div>PixelPaddle</div>
							</div>
							<div class="friend">
								<div>BallBattler</div>
							</div>
							<div class="friend">
								<div>RetroRacket</div>
							</div>
							<div class="friend">
								<div>ScoreSmasher</div>
							</div>
							<div class="friend">
								<div>PongProphet</div>
							</div>
							<div class="friend">
								<div>ArcadeAce</div>
							</div>
							<div class="friend">
								<div>VirtualVolley</div>
							</div>
							<div class="friend">
								<div>GameGuru</div>
							</div>
							<div class="friend">
								<div>SpinMaster</div>
							</div>
							<div class="friend">
								<div>PaddlePal</div>
							</div>
							<div class="friend">
								<div>BlockBuster</div>
							</div>
							<div class="friend">
								<div>NetNinja</div>
							</div>
						</div>
					</div>
					<div class="stats-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">stats
						</div>
						<div class="child-container">
							<div class="bar-container">
								<div class="bar bar-green" :style="{ width: (10 / 17) * 100 + '%' }"></div>
								<div class="bar bar-red" :style="{ width: (7 / 17) * 100 + '%' }"></div>
							</div>
							<!-- <div class="stats-text">
								<div>Parties gagnées : 10</div>
								<div>Parties perdues : 7</div>
								<div>Moyenne : 58.8%</div>
							</div> -->
						</div>
					</div>
					<div class="history-container grid-border" style="overflow-y: auto;">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="switchPage(State.HISTORY)">history
						</div>
						<div class="child-container">
							<table class="history-table">
								<thead>
									<tr>
										<th>Joueur 1</th>
										<th>Score</th>
										<th>Joueur 2</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="n in 20">
										<td>{{ user.username }}</td>
										<td> 5 </td>
										<td>Random </td>
										<td>10</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div v-show="user.darkMode == false">
				<div class="sun"></div>
				<!-- <div class="cloud cloud0"></div>
				<div class="cloud cloud1"></div>
				<div class="cloud cloud2"></div> -->
			</div>
			<div v-show="user.darkMode == true">
				<div class="stars"></div>
				<div class="stars1"></div>
				<div class="stars2"></div>
				<div class="shooting-stars"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/profil.scss">
.history-table {
	width: 100%;
	max-height: 100%;
	overflow-y: auto;
	overflow: scroll;
}

.history-table th,
.history-table td {
	padding: 10px;
	text-align: center;
}

.history-table tr:nth-child(even) {
	background-color: #f2f2f2;
}

.history-table tr.winner {
	background-color: gold;
}

.bar-container {
  display: flex;
  flex-direction: row;
  height: 200px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background-color: #ddd;
}

.bar {
	height: 20px;
}

.bar-green {
	background-color: #4CAF50;
}

.bar-red {
	background-color: #f44336;
}
</style>