<script lang="ts">

import { State } from '../scripts/state';
import user from '../scripts/user';
import '../styles/backgrounds.scss'
import gameGateway from '../scripts/game';
import chatGateway from '../scripts/chat';
import statusGateway from '../scripts/status';
import { defineComponent } from 'vue';

export default defineComponent({
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
		switchPage(page: State, id?: number) {
			this.$router.push({ name: page, params: { id: id } });
		},
	},
	mounted() {
	},
	emits: ['logout']
})
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
			<div v-show="user.darkMode == false">
				<div class="sun"></div>
				<div class="cloud cloud0"></div>
				<div class="cloud cloud1"></div>
				<div class="cloud cloud2"></div>
			</div>
			<div v-show="user.darkMode == true">
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
	<div class="navigation">
		<ul>
			<li>
				<a>
					<span class="avatar" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']"></span>
					<!-- <span class="title" @click="switchPage(State.USER)">{{ user.username }}</span> -->
					<router-link class="title" :to="{name: 'profile', params: {id: user.id}}">{{  user.username }}</router-link>
				</a>
			</li>
			<li>

			</li>
			<li>
				<a>
					<span class="icon"><i class="fa-solid fa-comments"></i></span>
					<!-- <span class="title" @click="switchPage(State.CHAT)">Messages</span> -->
					<router-link class="title" :to="{name: 'chat'}">Messages</router-link>
				</a>
			</li>
			<li>
				<a>
					<span class="icon"><i class="fa-solid fa-edit"></i></span>
					<!-- <span class="title" @click="switchPage(State.EDIT)">Edit</span> -->
					<router-link class="title" :to="{name: 'edit'}">Edit</router-link>
				</a>
			</li>
			<li>
				<a>
					<span class="icon"><i class="fa-solid fa-floppy-disk"></i></span>
					<!-- <span class="title" @click="switchPage(State.HISTORY)">Game history</span> -->
					<router-link class="title" :to="{name: 'history', params: {id: user.id}}">Game history</router-link>
				</a>
			</li>
			<li>
				<a>
					<span class="icon"><i class="fa-solid fa-users"></i></span>
					<!-- <span class="title" @click="switchPage(State.FRIENDS, user.id)">Friends</span> -->
					<router-link class="title" :to="{name: 'friends', params: {id: user.id}}">Friends</router-link>
				</a>
			</li>
			<li>
				<a>
					<span class="icon" @click="toggleDarkMode"><i
							:class="[user.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']"></i></span>
					<span class="title" @click="toggleDarkMode">Theme</span>
				</a>
			</li>
			<li>
				<a>
					<span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
					<span class="title" @click="$emit('logout')">SignOut</span>
				</a>
			</li>
		</ul>
	</div>
	<div class="main-container">
		<!-- <button class="main-button" @click="switchPage(State.GAME)">GAME</button> -->
		<router-link class="main-button" :to="{name: 'game'}">GAME</router-link>
	</div>
	<div style="overflow: hidden;">
		<div :class="[user.darkMode ? 'ocean dark' : 'ocean', user.coa]">
			<div class="wave" :class="[user.darkMode ? 'dark' : '', user.coa]"></div>
			<div class="wave" :class="[user.darkMode ? 'dark' : '', user.coa]"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/mainPage.scss"></style>
