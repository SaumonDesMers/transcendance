<script lang="ts">

import axios from 'axios'
import chat from '../scripts/chat'
import { State } from '../scripts/state';
import usersStatus from '../scripts/status';
import SelfUser from '../scripts/user';
import userLoader from '@/scripts/user.loader';
import { User } from '../scripts/user';
import { defineComponent } from 'vue';
import homepagebtn from './homepagebtn.vue';

export default defineComponent({
	components: {
		homepagebtn
	},
	data: function () {
		return {
			State,
			status: '',
			usersStatus,
			SelfUser,
			userLoader,
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
		block(id: number) {
			chat.block_user(id, true);
		},
	},
	watch: {
		'$route.params'(oldVal, newVal) {
			this.user.loadUser(parseInt(newVal.id as string)).then(nothing => {
				usersStatus.fetchUsers(this.user._friendsIdList);
				userLoader.addUserIds(this.user._friendsIdList.map(o => o.id));
			})
		}
	},
	mounted() {
		if (parseInt(this.$route.params.id as string) == this.SelfUser.id)
			this.user = this.SelfUser;
		this.user.loadUser(parseInt(this.$route.params.id as string)).then(nothing => {
				usersStatus.fetchUsers(this.user._friendsIdList);
				userLoader.addUserIds(this.user._friendsIdList.map(o => o.id));
		})
	},
	emits: ['logout'],
})
</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div v-show="SelfUser.darkMode == false">
				<div class="sun"></div>
			</div>
		<div v-show="SelfUser.darkMode == true">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div style="color: aliceblue; z-index:10">
			<homepagebtn></homepagebtn>
		</div>
		<div style="height: 100vh; overflow: scroll;">

			<div class="friends-grid">
				<div class="friend" v-for="friend in user._friendsIdList">
					<div class="friend">
						<div class="avatar">
							<div class="avatar-style"
								:style="['background-image: url(\'' + userLoader.getUser(friend.id).avatar.imageBase64 + '\')']">
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
							{{ userLoader.getUserName(friend.id) }}</div>
						<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']"
							@click="message(userLoader.getUserName(friend.id))">
							message</div>
						<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']"
							v-if="SelfUser.id != friend.id"
							@click="block(friend.id)">
							block</div>
						<p class="bio" :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']">{{ userLoader.getUser(friend.id).bio }}
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
	background-color: rgba(255, 255, 255, 0.1);
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
	color: white;
	font-size: 20px;
	text-transform: uppercase;
	text-align: center;
	padding: 0.2rem;

	&:hover,
	&:active {
		color: white;
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
		margin-bottom: 2rem;
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
