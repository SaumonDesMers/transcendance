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
	},
	mounted() {
	},
	emits: ['logout']
})
</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div style="width: 100vw; height: 100vh; display: block; position:relative;">
			<!-- <div v-show="user.darkMode == false">
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
			</div> -->
		</div>
	</div>
	<nav class="navigation">
		<ul>
			<li>
				<router-link :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']" class="title" :to="{ name: 'profile', params: { id: user.id } }">
					<span class="avatar" :style="['background-image: url(\'' + user.avatar.imageBase64 + '\')']"></span>
					{{ user.username }}
				</router-link>
			</li>
			<li>
				<router-link :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']" class="title" :to="{ name: 'chat' }">
					<span class="icon"><i class="fa-solid fa-comments"></i></span>
					Messages
				</router-link>
			</li>
			<li>
				<router-link :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']" class="title" :to="{ name: 'edit' }">
					<span class="icon"><i class="fa-solid fa-edit"></i></span>
					Edit
				</router-link>
			</li>
			<li >
				<router-link :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']"  class="title" :to="{ name: 'history', params: { id: user.id } }">
					<span class="icon"><i class="fa-solid fa-floppy-disk"></i></span>
					Game history
				</router-link>
			</li>
			<li>
				<router-link class="title" :to="{ name: 'friends', params: { id: user.id } }" :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']">
					<span class="icon"><i class="fa-solid fa-users"></i></span>
					Friends
				</router-link>
			</li>
			<li>
				<a  @click="toggleDarkMode" class="title" :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']">
					<span class="icon">
						<i :class="[user.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']"></i>
					</span>
					<span>Theme</span>
				</a>
			</li>
			<li v-if="windowSize.width < 768">
				<router-link :to="{ name: 'game' }" :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']">
					<span class="icon"><i class="fa-solid fa-gamepad"></i></span>
					Game
				</router-link>
			</li>
			<li>
				<a class="title" @click="$emit('logout')" :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']">
					<span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
					<span>SignOut</span>
				</a>
			</li>
		</ul>
	</nav>
	<div v-if="windowSize.width > 768" class="main-container">
		<router-link class="main-button" :class="[user.darkMode ? 'dark' : '', user.coa + '-ornot-btn']" :to="{ name: 'game' }">GAME</router-link>
	</div>
	<!-- <div style="overflow: hidden;">
		<div :class="[user.darkMode ? 'ocean dark' : 'ocean', user.coa]">
			<div class="wave" :class="[user.darkMode ? 'dark' : '', user.coa]"></div>
			<div class="wave" :class="[user.darkMode ? 'dark' : '', user.coa]"></div>
		</div>
	</div> -->
</template>

<style lang="scss" scoped src="../styles/mainPage.scss"></style>
