<script>

import axios from 'axios'
import { State } from '../scripts/state';
import { User } from '../scripts/user';
import '../styles/buttons.scss'

export default {
	data: function () {
		return {
			State,
			status: false,
			user: new User(),
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
		<div v-if="user.darkMode == false">
			<div class="cloud large cloud-1">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud normal cloud-2">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud small cloud-3">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud tiny cloud-4">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud large cloud-5">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud normal cloud-6">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud small cloud-7">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud tiny cloud-8">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud small cloud-9">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud normal cloud-10">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud tiny cloud-11">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="cloud small cloud-12">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
		<div v-else>
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div class="friends-grid">
			<div v-for="n in 10">
				<div class="friend">
					<div class="avatar">
						<div class="avatar-style"></div>
						<div class="status"></div>
					</div>
					<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']" @click="switchPage(State.USER)">
						login</div>
					<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']">
						block</div>
					<div :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']" @click="switchPage(State.CHAT)">
						message</div>
					<p class="bio" :class="[user.darkMode ? 'text-color-dark' : 'text-color-light']">{{ user.bio }}</p>
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
	display: flex;
	grid-row: span 4;
	align-items: center;
	justify-content: center;
}

.avatar-style {
	border-radius: 50%;
	background: url("https://unsplash.it/100/100");
	width: 100px;
	height: 100px;
}

.bio {
	overflow-wrap: break-word;
	font-size: 15px;
}</style>