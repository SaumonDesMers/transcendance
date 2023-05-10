<script lang="ts">

import axios from 'axios'
import { State } from '../scripts/state';
import SelfUser from '../scripts/user';
import gameGateway from '../scripts/game';
import chatGateway from '../scripts/chat';
import usersStatus from '../scripts/status';
import { defineComponent } from 'vue';
import { User, UserPrison } from '../scripts/user';
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
			chat,
			status: false,
			SelfUser,
			usersStatus,
			user: new User(),
			userFactory: new UserPrison(),
			searchUserShow: false as boolean
		}
	},
	methods: {
		toggleDarkMode() {
			this.SelfUser.set({ darkMode: !this.SelfUser.darkMode });
			this.SelfUser.save();
		},
		message(username: string) {
			this.chat.startDM(username);
			this.$router.push({ name: State.CHAT });
		},
	},
	watch: {
		'$route.params'(newVal, oldVal) {
			this.searchUserShow = false;
			this.user.loadUser(parseInt(newVal.id as string)).then(nothing => {
				this.user.downloadAvatar().then(value => {this.$forceUpdate()});
				this.user.loadFriends();
				this.user.loadHistory();
				this.user.loadStats();
				this.usersStatus.fetchUsers([this.user]);
			})

			this.userFactory.addUser(this.user);
		}
	},
	computed: {
		isBlocked() {
			return chat.isBlocked(this.user.id);
		},
	},
	mounted() {
		this.user.loadUser(parseInt(this.$route.params.id as string)).then(nothing => {
			this.user.downloadAvatar();
			this.user.loadFriends();
			this.user.loadHistory();
			this.user.loadStats();
			this.usersStatus.fetchUsers([this.user]);
		})
		this.SelfUser.loadFriends();
		this.userFactory.addUser(this.user);
	},
	emits: ['logout']
})
</script>

<template>
	<head>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	</head>
	<div v-if="searchUserShow">
		<searchUser></searchUser>
	</div>
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div style="width: 100vw; height: 100vh;">
			<div
			:class="[SelfUser.darkMode == true ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="banner-profile" :class=user.coa>
					<div style="color:aliceblue">
						<homepagebtn></homepagebtn>
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
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="$router.push({ name: State.GAME })">play</div>
						<div v-if="SelfUser.id == user.id" :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="$router.push({ name: State.CHAT })">chat</div>
						<div v-else :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="message(user.username)">chat</div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.username }} </div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.coa }} </div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="searchUserShow = !searchUserShow">search</div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-edit' : 'text-nav text-color-light fa-solid fa-edit']"
							v-if="SelfUser.id == user.id"
							@click="$router.push({ name: State.EDIT })"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark fa-solid fa-right-from-bracket' : 'text-nav text-color-light fa-solid fa-right-from-bracket']"
							v-if="SelfUser.id == user.id"
							@click="$emit('logout')"></div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							v-if="SelfUser.id != user.id && !isBlocked"
							@click="SelfUser.isFriend(user.id) ? SelfUser.removeFriend(user.id) : SelfUser.addFriend(user.username)">{{ SelfUser.isFriend(user.id) ? 'Unfollow' : 'Follow' }}</div>
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							v-if="SelfUser.id != user.id"
							@click="chat.block_user(user.id, !isBlocked)">{{ isBlocked ? 'Unblock' : 'Block' }}</div>
					</div>
					<div class="bio-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">Bio</div>
						<div class="child-container"> {{ user.bio }}</div>
					</div>
					<div class="friend-container grid-border">
						<div :class="[SelfUser.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="$router.push({ name: State.FRIENDS, params: { id: user.id } })">friends</div>
						<div class="grid-friend" style="overflow: scroll;">
							<div class="friend" v-for="friend in user.friends">
								<div :style="['background-image: url(\'' + friend.avatar.imageBase64 + '\'); background-size: cover; background-position: center center; background-opacity: 0.8']"
								@click="$router.push({ name: State.USER, params: { id: friend.id } })">{{ friend.username }}</div>
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
								<div>Rank : {{ user.stats.rank }}</div>
								<div>Games played : {{  user.stats.GamesWon + user.stats.GamesLost }}</div>
								<div>Games won : {{  user.stats.GamesWon }}</div>
								<div>Games lost : {{ user.stats.GamesLost }}</div>
								<div>Win ratio : {{ user.stats.GamesWon / (user.stats.GamesLost + user.stats.GamesWon) * 100 }}</div>
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
