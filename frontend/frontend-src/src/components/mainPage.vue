<script>

import { State } from '../scripts/state';
import user from '../scripts/user';
import '../styles/backgrounds.scss'

export default {
	data: function () {
		return {
			State,
			windowSize: { width: window.innerWidth, height: window.innerHeight },
			user,
		}
	},
	created() {
		window.addEventListener('resize', this.updateWindowSize);
	},
	destroyed() {
		window.removeEventListener('resize', this.updateWindowSize);
	},
	methods: {
		updateWindowSize() {
			this.windowSize = { width: window.innerWidth, height: window.innerHeight };
		},
		toggleDarkMode() {
			this.user.set({ darkMode: !this.user.darkMode });
			this.user.save();
		},
		switchPage(page) {
			this.$emit('switchPage', page);
		},
		logout() {
			this.$cookies.remove('jwt');
			this.switchPage(State.LOGIN);
		}
	},
	mounted() {
	},
	emits: ['switchPage'],
}
</script>

<template>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
		<title>SideBAr</title>
	</head>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div style="width: 100vw; height: 100vh; display: block; position:relative;">
			<div v-show ="user.darkMode == false">
			<div class="sun"></div>
				<div class="cloud large cloud-1"><div></div><div></div><div></div><div></div></div>
				<div class="cloud normal cloud-2"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-3"><div></div><div></div><div></div><div></div></div>
				<div class="cloud tiny cloud-4"><div></div><div></div><div></div><div></div></div>
				<div class="cloud large cloud-5"><div></div><div></div><div></div><div></div></div>
				<div class="cloud normal cloud-6"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-7"><div></div><div></div><div></div><div></div></div>
				<div class="cloud tiny cloud-8"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-9"><div></div><div></div><div></div><div></div></div>
				<div class="cloud normal cloud-10"><div></div><div></div><div></div><div></div></div>
				<div class="cloud tiny cloud-11"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-12"><div></div><div></div><div></div><div></div></div>
			</div>
			<div v-show ="user.darkMode == true">
				<div class="moon">
				<div class="dark">
				</div>
				<div class="dark">
				</div>
				<div class="dark">
				</div>
			</div>
				<div class="stars"></div>
				<div class="stars1"></div>
				<div class="stars2"></div>
				<div class="shooting-stars"></div>
			</div>
		</div>
	</div>
	<div :style="[windowSize.width < 620 ? 'display : none' : 'display : flex']">
		<div class="navigation">
			<ul>
				<li>
					<a href="#">
						<span class="avatar"></span>
						<span class="title" @click="switchPage(State.USER)">{{ user.username }}</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-comments"></i></span>
						<span class="title" @click="switchPage(State.CHAT)">Messages</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-trophy"></i></span>
						<span class="title" @click="switchPage(State.STATS)">Statistics</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-floppy-disk"></i></span>
						<span class="title" @click="switchPage(State.HISTORY)">Game history</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-users"></i></span>
						<span class="title" @click="switchPage(State.FRIENDS)">Friends</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon" @click="toggleDarkMode"><i
								:class="[user.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']"></i></span>
						<span class="title" @click="toggleDarkMode">Theme</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
						<span class="title" @click="logout">SignOut</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="main-container">
			<button class="main-button" @click="switchPage(State.GAME)">GAME</button>
		</div>
	</div>
	<div style="overflow: hidden;">
	<div :class="[user.darkMode ? 'ocean dark' : 'ocean', user.coa]">
		<div class="wave" :class="[user.darkMode ? 'dark' : '', user.coa]"></div>
		<div class="wave" :class="[user.darkMode ? 'dark' : '', user.coa]"></div>
	</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/mainPage.scss"></style>