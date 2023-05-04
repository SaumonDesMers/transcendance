<script>

import axios from 'axios'
import { State } from '../scripts/state';
import usersStatus from '../scripts/status';
import user from '../scripts/user';

export default {
	data: function () {
		return {
			State,
			status: false,
			user,
			usersStatus,
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
	},
	mounted() {
		user.loadFriends(),
		usersStatus.fetchUsers(user._friendsIdList);
	},
	emits: ['switchPage']
}
</script>

<template>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	</head>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div class="friends-grid">
			<div class="friend" v-for="friend in user.friends">
				<div class="avatar">
					<!-- <img src="https://unsplash.it/80/80" /> -->
					<img v-bind:src="friend.avatar.imageBase64" />
					<div class="status">
						<p>{{ usersStatus.getUserStatus(friend.id) }}</p>
					</div>
				</div>
				<button class="login">{{ friend.username }}</button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio">{{  friend.bio }}</p>
			</div>
			<!-- <div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/80/80" />
					<div class="status"></div>
				</div>
				<button class="login"></button>
				<button class="block"></button>
				<button class="msg"></button>
				<p class="bio"></p>
			</div> -->
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/all.scss"></style>

<style scoped>
.friends-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: 4rem;
	gap: 2rem;
	align-items: center;
	justify-content: center;
}

.friend {
	background-color: brown;
	display: grid;
	padding: 0.5rem;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: 1fr 1fr 1fr 2fr;
	width: 35rem;
	height: 15rem;
}

.avatar {
	grid-row: span 4;
}

.bio {
	background-color: cadetblue;
}
</style>
