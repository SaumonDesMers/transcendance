<script>

import axios from 'axios'
import { State } from '../scripts/state';
import user from '../scripts/user';

export default {
	data: function () {
		return {
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
	},
	mounted() { },
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
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score <i class="fa-solid fa-skull"></i></p>
				<p class="login goldBG goldText">Login <br>Score <i class="fa-solid fa-trophy"></i></p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
			<div class="friend">
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<div class="avatar">
					<img src="https://unsplash.it/60/60" />
					<div class="status"></div>
				</div>
				<p class="login">Login <br>Score</p>
				<p class="login">Login <br>Score</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/all.scss"></style>

<style scoped>

.friends-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
	align-items: center;
	justify-content: center;
}

.friend {
	background-color: brown;
	display: grid;
	padding: 0.5rem;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	width: 35rem;
	height: 15rem;
}

.avatar {
	grid-row: span 1;
	display: flex;
	justify-content: center;
}

.login {
	background-color: cadetblue;
	text-align: center;
	padding: 0.5rem;
	margin: 0.5rem;
}

:root {
	--goldBackground: linear-gradient(45deg, #AE8625, #F7EF8A, #D2AC47, #EDC967);
}

.goldBG {
	background: linear-gradient(45deg, #AE8625, #F7EF8A, #D2AC47, #EDC967, #AE8625, #F7EF8A, #D2AC47, #EDC967, #AE8625, #F7EF8A);
	background-position: 0 0;
}

@keyframes AnimationName {
	0% {
		background-position: 0% 0%
	}

	100% {
		background-position: 100% 0%
	}
}
.goldText {
	animation: AnimationName 10s linear infinite;
}


</style>