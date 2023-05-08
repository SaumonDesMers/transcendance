<script lang="ts">

import axios from 'axios'
import { State } from '../scripts/state';
import SelfUser from '../scripts/user';
import gameGateway from '../scripts/game';
import chatGateway from '../scripts/chat';
import statusGateway from '../scripts/status';
import { defineComponent } from 'vue';
import { User, UserPrison } from '../scripts/user';

export default defineComponent({
	data: function () {
		return {
			matches: [
			],
			State,
			status: false,
			SelfUser,
			user: new User(),
			userFactory: new UserPrison()
		}
	},
	methods: {
		toggleDarkMode() {
			this.SelfUser.set({ darkMode: !this.SelfUser.darkMode });
			this.SelfUser.save();
		},
		switchPage(page: State, id?: number) {
			this.$router.push({ name: page, params: { id: id } });
		},
		logout() {
			gameGateway.disconnect();
			chatGateway.disconnectFromServer();
			statusGateway.disconnect();
			localStorage.removeItem('userId');
			this.$cookie.removeCookie('jwt');
			this.$router.push({ name: 'login' });
		},
	},
	watch: {
		'$route.params'(oldVal, newVal) {
			this.user.loadUser(parseInt(newVal.id as string)).then(nothing => {
				this.user.loadFriends();
				this.user.loadHistory();
				this.user.loadStats();
			})

			this.userFactory.addUser(this.user);
		}
	},
	computed: {
	},
	mounted() {
		this.user.loadUser(parseInt(this.$route.params.id as string)).then(nothing => {
			this.user.loadFriends();
			this.user.loadHistory();
			this.user.loadStats();
		})

		this.userFactory.addUser(this.user);
	},
})
</script>

<template>
	<head>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	</head>
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', SelfUser.coa]">
		<div style="width: 100vw; height: 100vh;">
			<div
				:class="[SelfUser.darkMode == true ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="banner-profile" :class=SelfUser.coa>
					<div class="avatar-profile" :style="['background-image: url(\'' + SelfUser.avatar.imageBase64 + '\')']">
						<div class="status-profile"
							:style="[SelfUser.id ? 'background-color: green' : 'background-color: gray']"></div>
					</div>
					<span class="profile-toggle" @click="toggleDarkMode" style="display: flex;">
						<div :class="[SelfUser.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']" style="font-size: 1.5vw">
						</div>
					</span>
				</div>
				<div class="profile-grid" style="overflow: scroll;">
					<div class="information-profile-container">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="switchPage(State.GAME)">play</div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="switchPage(State.CHAT)">chat</div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							SelfUser.username }} </div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							SelfUser.coa }} </div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-edit' : 'text-nav text-color-light fa-solid fa-edit']"
							@click="switchPage(State.EDIT)"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-right-from-bracket' : 'text-nav text-color-light fa-solid fa-right-from-bracket']"
							@click="logout"></div>
					</div>
					<div class="bio-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">Bio</div>
						<div class="child-container"> {{ SelfUser.bio }}</div>
					</div>
					<div class="friend-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="switchPage(State.FRIENDS, user.id)">friends</div>
						<div class="grid-friend" style="overflow: scroll;">
							<div class="friend" v-for="friend in user.friends">
								<div @click="switchPage(State.USER, friend.id)">{{ friend.username }}</div>
								<!-- <router-link :to="{ name: 'profile', params: { id: friend.id } }">{{ friend.username }}</router-link> -->
							</div>
						</div>
					</div>
					<div class="stats-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">stats
						</div>
						<div class="child-container">
							<div class="bar-container">
								<div class="bar bar-green" :style="{ width: ( user.stats.GamesWon / 17) * 100 + '%' }"></div>
								<div class="bar bar-red" :style="{ width: ( user.stats.GamesLost / 17) * 100 + '%' }"></div>
							</div>
							<div class="stats-text">
								<div>You played : </div>
								<div>Parties gagnées : {{  user.stats.GamesWon }}</div>
								<div>Parties perdues : {{ user.stats.GamesLost }}</div>
								<div>Moyenne : {{ user.stats.GamesWon / (user.stats.GamesLost + user.stats.GamesWon) * 100 }}</div>
							</div>
						</div>
					</div>
					<div class="history-container grid-border" style="overflow-y: auto;">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="switchPage(State.HISTORY, user.id)">history
						</div>
						<div class="child-container">
							<table class="history-table">
								<tbody>
									<tr v-for="game in user.history">
										<div class="row-tab">
											<p>{{ userFactory.getUser(game.winnerId).username }} | {{ game.winnerScore }} | {{ userFactory.getUser(game.loserId).username }} | {{ game.LoserScore }}</p>
										</div>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div v-show="SelfUser.darkMode == false">
				<div class="sun"></div>
				<!-- <div class="cloud cloud0"></div>
				<div class="cloud cloud1"></div>
				<div class="cloud cloud2"></div> -->
			</div>
			<div v-show="SelfUser.darkMode == true">
				<div class="stars"></div>
				<div class="stars1"></div>
				<div class="stars2"></div>
				<div class="shooting-stars"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/profil.scss"></style>
