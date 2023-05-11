<script lang="ts">

import axios from 'axios'
import { State } from '../scripts/state';
import SelfUser from '../scripts/user';
import gameGateway from '../scripts/game';
import chatGateway from '../scripts/chat';
import usersStatus from '../scripts/status';
import { defineComponent } from 'vue';
import { User } from '../scripts/user';
import userLoader from '@/scripts/user.loader';
import searchUser from './searchUser.vue';
import chat from '../scripts/chat';
import homepagebtn from './homepagebtn.vue';

export default defineComponent({

	components: {
		searchUser,
		homepagebtn
	},

	data: function () {
		return {
			matches: [
			],
			State,
			status: false,
			SelfUser,
			usersStatus,
			user: new User(),
			userLoader,
			searchUserShow: false as boolean
		}
	},
	methods: {
		toggleDarkMode() {
			this.SelfUser.set({ darkMode: !this.SelfUser.darkMode });
			this.SelfUser.save();
		},
		message(username: string) {
			chat.startDM(username);
			this.$router.push({ name: State.CHAT });
		},
		blockUser(userId: number, action: boolean) {
			chat.block_user(userId, action);
		},
		fetchUser(userId: number)
		{
			this.userLoader.clear();
			this.user.loadUser(userId).then(() => {
				this.user.downloadAvatar().then(value => { this.$forceUpdate() });
				this.user.loadHistory();
				this.user.loadStats();
				this.usersStatus.fetchUsers([this.user]);
				this.userLoader.addUser(this.user);
				this.userLoader.addUserIds(this.user._friendsIdList.map(o => o.id))
			})
		}
	},
	watch: {
		'$route.params'(newVal, oldVal) {
			this.searchUserShow = false;
			this.fetchUser(parseInt(newVal.id as string));
		}
	},
	computed: {
		isBlocked() {
			return chat.isBlocked(this.user.id);
		},
	},
	mounted() {
		this.userLoader.clear();
		this.fetchUser(parseInt(this.$route.params.id as string));
	},
	emits: ['logout']
})
</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	<div v-if="searchUserShow">
		<searchUser></searchUser>
	</div>
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div style="width: 100vw; height: 100vh;">
			<div
				:class="[SelfUser.darkMode == true ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="banner-profile" :class=user.coa>
					<div style="display:flex; flex-direction: column; justify-content: space-between; width: 1rem;">
						<div style="color:aliceblue;">
							<homepagebtn></homepagebtn>
						</div>
						<div style="">
							{{ user.username }} <br>
							{{ user.coa }}
						</div>
					</div>
					<div class="avatar-profile" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']">
						<div v-if="usersStatus.getUserStatus(user.id) == 'ONLINE'" class="status-profile"
							style="background-color: green"></div>
						<div v-else-if="usersStatus.getUserStatus(user.id) == 'OFFLINE'" class="status-profile"
							style="background-color: gray"></div>
						<div v-else-if="usersStatus.getUserStatus(user.id) == 'IN GAME'" class="status-profile"
							style="background-color: red"></div>
					</div>
					<span class="profile-toggle" @click="toggleDarkMode" style="display: flex;">
						<div :class="[SelfUser.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']" style="font-size: 1.5vw">
						</div>
					</span>
				</div>
				<div class="profile-grid" style="overflow: scroll;">
					<div class="information-profile-container">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-gamepad' : 'text-nav text-color-light fa-solid fa-gamepad']"
							@click="$router.push({ name: State.GAME })"></div>
						<div v-if="SelfUser.id == user.id"
							:class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-comments' : 'text-nav text-color-light fa-solid fa-comments']"
							@click="$router.push({ name: State.CHAT })"></div>
						<div v-else :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-comments' : 'text-nav text-color-light fa-solid fa-comments']"
							@click="message(user.username)"></div>
						<!-- <div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.username }} </div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.coa }} </div> -->
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-magnifying-glass' : 'text-nav text-color-light fa-solid fa-magnifying-glass']"
							@click="searchUserShow = !searchUserShow"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-edit' : 'text-nav text-color-light fa-solid fa-edit']"
							v-if="SelfUser.id == user.id" @click="$router.push({ name: State.EDIT })"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-right-from-bracket' : 'text-nav text-color-light fa-solid fa-right-from-bracket']"
							v-if="SelfUser.id == user.id" @click="$emit('logout')"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light', SelfUser.isFriend(user.id) ? 'fa-solid fa-user-slash' : 'fa-solid fa-user-plus']"
							v-if="SelfUser.id != user.id && !isBlocked"
							@click="SelfUser.isFriend(user.id) ? SelfUser.removeFriend(user.id) : SelfUser.addFriend(user.username)"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							v-if="SelfUser.id != user.id" @click="blockUser(user.id, !isBlocked)">{{ isBlocked ? 'Unblock' :
								'Block' }}</div>
					</div>
					<div class="bio-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">Bio
						</div>
						<div class="child-container"> {{ user.bio }}</div>
					</div>
					<div class="friend-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="$router.push({ name: State.FRIENDS, params: { id: user.id } })">friends</div>
						<div class="grid-friend" style="overflow: scroll;">
							<div class="friend" v-for="friend in user._friendsIdList">
								<div :style="['background-image: url(\'' + userLoader.getUser(friend.id).avatar.imageBase64 + '\'); background-size: cover; background-position: center center; background-opacity: 0.8']"
									@click="$router.push({ name: State.USER, params: { id: friend.id } })">{{
										userLoader.getUserName(friend.id) }}</div>
								<!-- <router-link :to="{ name: 'profile', params: { id: friend.id } }">{{ friend.username }}</router-link> -->
							</div>
						</div>
					</div>
					<div class="stats-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">stats
						</div>
						<div class="child-container">
							<div class="bar-container">
								<div class="bar bar-green" :style="{ width: (user.stats.GamesWon / 17) * 100 + '%' }">
								</div>
								<div class="bar bar-red" :style="{ width: (user.stats.GamesLost / 17) * 100 + '%' }"></div>
							</div>
							<div class="stats-text">
								<div style="text-align: center;">
									<p style="text-align: center; width: 100;" class="fa-solid fa-ranking-star"> :: {{ user.stats.rank }} :: <p class="fa-solid fa-ranking-star"></p> </p>
								</div>
								<div class="main-stat">
									<div>Games played {{ user.stats.GamesWon + user.stats.GamesLost }}</div>
									<div>Win ratio : {{ Math.trunc(user.stats.GamesWon / (user.stats.GamesLost + user.stats.GamesWon) * 100) }}</div>
									<div>Games won : {{ user.stats.GamesWon }}</div>
									<div>Games lost : {{ user.stats.GamesLost }}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="history-container grid-border" style="overflow-y: auto;">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="$router.push({ name: State.HISTORY, params: { id: user.id } })">history
						</div>
						<div class="child-container">
							<table class="history-table">
								<tbody>
									<tr v-for="game in user.history">
										<div class="row-tab">
											<div> {{ userLoader.getUser(game.winnerId).username }} </div>
											<div> {{ game.winnerScore }} </div>
											<div> {{ userLoader.getUser(game.loserId).username }} </div>
											<div> {{ game.LoserScore }} </div>
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
			</div>
			<div v-show="SelfUser.darkMode == true">
				<div class="stars"></div>
				<div class="stars1"></div>
				<div class="stars2"></div>
				<div class="shooting-stars"></div>
			</div>
		</div>
	</div></template>

<style lang="scss" scoped src="../styles/profil.scss"></style>
