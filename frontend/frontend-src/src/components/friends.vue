<script lang="ts">

import axios from 'axios'
import chat from '../scripts/chat'
import { State } from '../scripts/state';
import usersStatus from '../scripts/status';
import SelfUser from '../scripts/user';
import { User } from '../scripts/user';
import { defineComponent } from 'vue';
import homepagebtn from './homepagebtn.vue';

export default defineComponent({
	component: {
		homepagebtn
	},
	data: function () {
		return {
			State,
			status: '',
			usersStatus,
			SelfUser,
			user: new User(),
			// chat
		}
	},
	methods: {
		// toggleDarkMode() {
		// 	this.user.set({ darkMode: !this.user.darkMode });
		// 	this.user.save();
		// },
		message(username: string) {
			chat.startDM(username);
			this.$router.push({ name: State.CHAT });
		},
		block(friend: User) {
			chat.block_user(friend.id, true);
		},
	},
	watch: {
		'$route.params'(oldVal, newVal) {
			this.user.loadUser(parseInt(newVal.id as string)).then(nothing => {
				this.user.loadFriends().then(value => {
					usersStatus.fetchUsers(this.user._friendsIdList);
				});
			})
		}
	},
	mounted() {
		if (parseInt(this.$route.params.id as string) == this.SelfUser.id)
			this.user = this.SelfUser;
		this.user.loadUser(parseInt(this.$route.params.id as string)).then(nothing => {
			this.user.loadFriends().then(value => {
				usersStatus.fetchUsers(this.user._friendsIdList);
			});
		})
	},
	emits: ['logout'],
})
</script>

<template>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	</head>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div v-show="user.darkMode == false">
				<div class="sun"></div>
			</div>
		<div v-show="user.darkMode == true">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div style="color: aliceblue;">
			<homepagebtn></homepagebtn>
		</div>
		<div style="height: 100vh; overflow: scroll;">

			<div class="friends-grid">
				<div class="friend" v-for="friend in user.friends">
					<div class="friend">
						<div class="avatar">
							<div class="avatar-style"
								:style="['background-image: url(\'' + friend.avatar.imageBase64 + '\')']">
								<div v-if="usersStatus.getUserStatus(friend.id) == 'ONLINE'" class="status-friend"
									style="background-color: green"></div>
								<div v-if="usersStatus.getUserStatus(friend.id) == 'OFFLINE'" class="status-friend"
									style="background-color: gray"></div>
								<div v-if="usersStatus.getUserStatus(friend.id) == 'IN GAME'" class="status-friend"
									style="background-color: red"></div>
							</div>
						</div>
						<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']"
							@click="$router.push({ name: State.USER, params: { id: friend.id } })">
							{{ friend.username }}</div>
						<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']"
							@click="message(friend.username)">
							message</div>
						<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']"
							v-if="SelfUser.id != friend.id"
							@click="block(friend)">
							block</div>
						<p class="bio" :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']">{{ friend.bio }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.friends-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	gap: 2rem;
	align-items: center;
	justify-content: center;
}

.friend {
	background-color: rgba(0, 0, 0, 0.5);
	display: grid;
	padding: 0.5rem;
	border-radius: 4px;
	grid-template-columns: 30% 70%;
	grid-template-rows: 1fr 1fr 1fr 2fr;
	width: 35rem;
	height: 15rem;
}

.text-color-dark {
	color: white;
	font-size: 20px;
	text-transform: uppercase;
	text-align: center;
	padding: 0.2rem;

	&:hover,
	&:active {
		text-shadow:
			0 0 10px #fff,
			0 0 15px #777777,
			0 0 25px #000000,
	}
}

.text-color-light {
	color: rgb(0, 0, 0, 0.6);

	&:hover,
	&:active {
		color: rgb(0, 0, 0, 1);
	}
}

@media screen and (min-width: 768px) {
	body {
		align-items: center;
		justify-content: center;
	}

	.friend {
		padding: 0.5rem;
		width: 35rem;
		height: 15rem;
	}

	.friends-grid {
		margin-top: 2rem;
		gap: 5rem;
	}
}

.avatar {
	grid-row: span 4;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.avatar-style {
	border-radius: 50%;
	width: 120px;
	height: 120px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-size: cover;
}

.bio {
	overflow-wrap: break-word;
	font-size: 15px;
	padding: 2rem;
	// color: white;
}

.status-friend {
	border-radius: 50%;
	position: relative;
	left: 35%;
	width: 20%;
	height: 20%;
	z-index: 10;
	top: 40%;
	display: flex;
}</style>
