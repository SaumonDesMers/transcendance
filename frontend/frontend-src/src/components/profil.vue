<script>

import axios from 'axios'
import { State } from '../scripts/state';
import { User } from '../scripts/user';

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
	emits: [/*'onEdit', 'onChat', */'switchPage']
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
		<div style="width: 100vw; height: 100vh;">
			<div
				:class="[user.darkMode == true ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="banner-profile" :class=user.coa>
					<div class="avatar-profile">
						<div class="status-profile"
							:style="[status ? 'background-color: green' : 'background-color: gray']"></div>
					</div>
					<span class="profile-toggle" @click="toggleDarkMode" style="display: flex;">
						<div :class="[user.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']" style="font-size: 1.5vw">
						</div>
					</span>
				</div>
				<div class="profile-grid">
					<div class="information-profile-container">
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="switchPage(State.GAME)">play</div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"
							@click="switchPage(State.CHAT)">chat</div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.username }} </div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{
							user.coa }} </div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark fa-solid fa-edit' : 'text-nav text-color-light fa-solid fa-edit']"
							@click="switchPage(State.EDIT)"></div>
					</div>
					<div class="bio-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">Bio</div>
						<div class="child-container"> {{ user.bio }}</div>
					</div>
					<div class="friend-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']"
							@click="switchPage(State.FRIENDS)">friends</div>
						<div class="grid-friend">
							<div class="friend">
								<div>PixelPaddle</div>
							</div>
							<div class="friend">
								<div>BallBattler</div>
							</div>
							<div class="friend">
								<div>RetroRacket</div>
							</div>
							<div class="friend">
								<div>ScoreSmasher</div>
							</div>
							<div class="friend">
								<div>PongProphet</div>
							</div>
							<div class="friend">
								<div>ArcadeAce</div>
							</div>
							<div class="friend">
								<div>VirtualVolley</div>
							</div>
							<div class="friend">
								<div>GameGuru</div>
							</div>
							<div class="friend">
								<div>SpinMaster</div>
							</div>
							<div class="friend">
								<div>PaddlePal</div>
							</div>
							<div class="friend">
								<div>BlockBuster</div>
							</div>
							<div class="friend">
								<div>NetNinja</div>
							</div>
						</div>
					</div>
					<div class="stats-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">stats
						</div>
						<div class="child-container">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non
							porttitor sem. Vestibulum ac massa tempus, auctor ex ut, lobortis tellus. Phasellus id tortor
							viverra, dictum diam nec, efficitur dui. Nullam placerat viverra tortor in ultricies. Quisque
						pellentesque hendrerit vulputate. Aenean dapibus dui lectus, nec dapibus arcu aliquam eget.
						Aenean dignissim arcu quis iaculis auctor.</div>
				</div>
				<div class="history-container grid-border">
					<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']" @click="switchPage(State.HISTORY)">history
					</div>
					<div class="child-container">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non
						porttitor sem. Vestibulum ac massa tempus, auctor ex ut, lobortis tellus. Phasellus id tortor
						viverra, dictum diam nec, efficitur dui. Nullam placerat viverra tortor in ultricies. Quisque
						pellentesque hendrerit vulputate. Aenean dapibus dui lectus, nec dapibus arcu aliquam eget.
						Aenean dignissim arcu quis iaculis auctor.</div>
				</div>
			</div>
		</div>
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
	</div>
</div></template>

<style lang="scss" scoped src="../styles/profil.scss"></style>