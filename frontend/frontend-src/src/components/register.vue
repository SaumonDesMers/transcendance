<script lang="ts">
import axios from 'axios'
import { State } from '../scripts/state'
import user from '../scripts/user'
import { registerRuntimeHelpers } from '@vue/compiler-core'
import { defineComponent } from 'vue'

export default defineComponent({
	data: function () {
		return {
			coalition: '',
			isDark: false,
			username: 'USERNAME',
			avatar: 'AVATAR',
			user,
		};
	},
	mounted() {
	},
	methods: {
		applyTheme(themeClass: string) {
			if (themeClass == this.coalition)
				this.coalition = '';
			else
				this.coalition = themeClass;
		},
		setTheme(themeClass: string) {
			var theme = themeClass;
			const b = document.querySelector('body');

			b?.classList.remove('ALLIANCE', 'ORDER', 'FEDERATION', 'ASSEMBLY', 'dark');
			// console.log('setting theme (' + themeClass + ') computed as ' + theme + ' dark == ' + this.isDark);
			if (theme)
				b?.classList.add(theme);
			if (this.isDark)
				b?.classList.add('dark');
		},
		applyPreviousThemeOnMouseOut() {
			this.setTheme(this.coalition);
		},
		toggleDarkMode() {
			this.isDark = !this.isDark;
			this.setTheme(this.coalition);
		},
		async requestUploadFile() {
			var imageFile = this.$el.querySelector('#uploadmyfile').files[0];
			if (imageFile.type.indexOf('image/') < 0) {
				return;
			}
			this.user.avatar.setFile(imageFile);
		},
		async saveAndSubmit() {
			if (!this.username || this.username == 'USERNAME') {
				alert("Please select a username.")
				return;
			}
			if (!this.coalition) {
				alert("Please select a coalition.")
				return;
			}
			// if (!this.user.avatar.imageBase64) {
			// 	alert("Please upload an avatar.")
			// 	return;
			// }
			axios
			.post('http://localhost:3001/users',
			{
				"username": this.username,
				"darkMode": this.isDark,
				"coa": this.coalition,
				"bio": 'Praise the ' + this.coalition + '!'
			})
			.then((res) => {
					this.user.set(res.data);
					this.user.isLoggedIn = true;
					this.user.uploadAvatar().then(() => {
						this.user.downloadAvatar();
					})
					this.$router.push({ name: State.MAIN });
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
	emits: ['logout']
})
</script>

<template>
	<div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw;">
		<div :class="[isDark ? 'centered-container dark' : 'centered-container']">
			<div style="display: flex; align-content: flex-end; flex-flow: column wrap;">
				<input class="input" type="checkbox" id="toggle">
				<label class="register-dark-toggle" for="toggle" @click="toggleDarkMode"></label>
			</div>
			<div class="actions">
				<div class="actions-content">
					<form :class="[isDark ? 'btn dark' : 'btn brown']">
						<span>
							<input class="input" v-model='username' @click="username = ''" />
						</span>
					</form>
					<div :class="[isDark ? 'btn dark' : 'btn blue']">
						<span><img v-bind:src="user.avatar.imageBase64"/></span>
						<label for="uploadmyfile"><span>SELECT AN AVATAR</span></label>
						<input type="file" id="uploadmyfile" @change="requestUploadFile" style="display: none;"/>
					</div>
				</div>
				<div style="display: flex; justify-content: space-between; gap: 4px">
					<button class="btn-coa alliance-btn" :class="[isDark ? 'dark' : '']" @mouseover="setTheme('ALLIANCE')"
						@mouseout="applyPreviousThemeOnMouseOut()" @click="applyTheme('ALLIANCE')">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
							id="Calque_1" x="0px" y="0px" viewBox="0 0 612 612"
							style="enable-background:new 0 0 612 612;position: initial" xml:space="preserve"
							class="coalition-flag--icon mx-auto">
							<path class="st0"
								d="M353.2,241.3c-12.8,4.3-25.6,10-37,17.1c35.6,28.5,59.8,69.7,62.6,116.7c0,5.7,0,10,0,15.7  c0,14.2-1.4,28.5-5.7,41.3c-10,38.4-34.2,72.6-65.5,95.4c-15.7,11.4-32.7,19.9-51.2,24.2c-15.7,4.3-29.9,7.1-45.5,7.1  c-92.5,0-167.9-75.4-167.9-166.5c0-44.1,17.1-85.4,48.4-116.7c-1.4-17.1-2.8-32.7-2.8-47v-1.4C37.2,265.5,7.3,325.3,7.3,389.3  c0,112.4,92.5,204.9,204.9,204.9c31.3,0,62.6-7.1,91.1-21.3c17.1-8.5,34.2-19.9,48.4-32.7c39.9-35.6,62.6-84,65.5-136.6  c0-5.7,0-8.5,0-14.2c0-15.7-1.4-29.9-5.7-44.1C403,305.4,383.1,269.8,353.2,241.3L353.2,241.3z M522.5,227.1  c0,15.7-1.4,31.3-4.3,45.5c31.3,31.3,48.4,72.6,48.4,116.7c0,92.5-75.4,166.5-167.9,166.5c-14.2,0-28.5-1.4-42.7-5.7  c-11.4,10-24.2,18.5-37,27c25.6,10,51.2,15.7,79.7,15.7c112.4,0,204.9-91.1,204.9-204.9C603.7,325.3,573.8,265.5,522.5,227.1  L522.5,227.1z M398.7,184.4c-31.3,0-62.6,7.1-91.1,21.3c-17.1,8.5-34.2,19.9-48.4,32.7c-31.3,28.5-52.7,65.5-61.2,106.7  c-2.8,14.2-4.3,28.5-4.3,44.1c0,4.3,0,8.5,0,14.2c2.8,51.2,25.6,99.6,64,135.2c12.8-4.3,25.6-10,37-17.1  c-28.5-22.8-49.8-54.1-58.4-89.7c-2.8-14.2-5.7-28.5-5.7-42.7c0-5.7,0-10,0-15.7c5.7-48.4,31.3-92.5,71.2-121  c15.7-11.4,32.7-19.9,51.2-24.2c15.7-4.3,29.9-7.1,45.5-7.1c21.3,0,42.7,4.3,61.2,11.4v-5.7c0-11.4-1.4-24.2-4.3-34.2  C438.6,187.2,418.6,184.4,398.7,184.4L398.7,184.4z M306.2,396.5c-21.3,0-42.7-4.3-61.2-11.4v5.7c0,11.4,1.4,24.2,4.3,34.2  c17.1,5.7,37,8.5,56.9,8.5c19.9,0,39.9-2.8,58.4-8.5c2.8-11.4,4.3-22.8,4.3-34.2v-7.1C347.5,392.2,327.6,396.5,306.2,396.5z   M306.2,23.6c-108.2,0-197.8,84-204.9,192.1c0,5.7,0,8.5,0,12.8c0,15.7,1.4,29.9,5.7,44.1c10,47,37,88.2,74,118.1v-1.4  c0-14.2,1.4-29.9,4.3-44.1c-25.6-27-42.7-64-47-101.1c0-5.7,0-10,0-15.7c0-14.2,1.4-28.5,5.7-41.3C162.5,113.2,229.4,62,306.2,62  S450,113.2,468.5,187.2c2.8,14.2,5.7,27,5.7,41.3c0,5.7,0,10,0,15.7c-2.8,38.4-19.9,74-47,101.1c2.8,14.2,4.3,29.9,4.3,44.1v1.4  c38.4-29.9,65.5-71.2,75.4-118.1c2.8-15.7,5.7-29.9,5.7-44.1c0-4.3,0-8.5,0-14.2C504,107.5,413,23.6,306.2,23.6L306.2,23.6z   M212.3,184.4c-19.9,0-39.9,2.8-58.4,8.5c-2.8,11.4-4.3,22.8-4.3,34.2v7.1c19.9-8.5,41.3-11.4,61.2-11.4c14.2,0,28.5,1.4,42.7,5.7  c11.4-10,24.2-18.5,37-27C266.4,190.1,239.3,184.4,212.3,184.4L212.3,184.4z">
							</path>
						</svg>
					</button>
					<button class="btn-coa order-btn" :class="isDark ? 'dark' : ''" @mouseover="setTheme('ORDER')"
						@mouseout="applyPreviousThemeOnMouseOut()" @click="applyTheme('ORDER')">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
							id="Calque_1" x="0px" y="0px" viewBox="0 0 612 612"
							style="enable-background:new 0 0 612 612;position: initial" xml:space="preserve"
							class="coalition-flag--icon mx-auto">
							<path id="Fill-2" class="st0"
								d="M305.5,568.6L181.7,496v-86.8l123.8,72.6l152.3-88.2l74-42.7v85.4L305.5,568.6L305.5,568.6z   M79.2,172.9l125.2-72.6l72.6,44.1l-123.8,71.2l-1.4,263.3l-72.6-42.7C79.2,436.3,79.2,172.9,79.2,172.9z M305.5,163l89.7,52.7  l32.7,18.5v140.9l-123.8,71.2l-121-71.2V232.7L305.5,163L305.5,163z M530.4,172.9v143.7l-74,42.7V215.6l-47-27L314,131.7l-81.1-49.8  l71.2-41.3L530.4,172.9z M305.5,6.4L49.3,155.9v298.9l256.2,149.4l256.2-149.4V155.9L305.5,6.4L305.5,6.4z">
							</path>
						</svg>
					</button>
					<button class="btn-coa federation-btn" :class="isDark ? 'dark' : ''" @mouseover="setTheme('FEDERATION')"
						@mouseout="applyPreviousThemeOnMouseOut()" @click="applyTheme('FEDERATION')">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
							id="Calque_1" x="0px" y="0px" viewBox="0 0 612 612"
							style="enable-background:new 0 0 612 612;position: initial" xml:space="preserve"
							class="coalition-flag--icon mx-auto">
							<path class="st0"
								d="M323.8,497.3l-12.4,21l-5,7.4l-4.9-7.4l-14.8-23.5l-29.6-48.2L121.2,220.6c-2.5,12.4-3.7,24.7-3.7,35.8  c0,7.4,0,16.1,1.2,24.7l77.8,127.3l42,70.4L306.5,590l60.5-98.9C352.2,493.6,337.4,496.1,323.8,497.3L323.8,497.3z M320.1,487.4  h-24.7l-21-35.8c11.1,1.2,21,2.5,32.1,2.5c14.8,0,29.7-1.2,44.5-4.9c25.9-6.2,50.7-17.3,72.9-33.4c43.2-32.1,72.9-79.1,80.3-131  l34.6-53.1c1.2,8.6,1.2,18.5,1.2,27.2c0,100.1-65.5,187.8-163.1,218.7C358.4,482.5,339.9,486.2,320.1,487.4L320.1,487.4z   M148.4,136.5c-16.1,19.8-27.2,43.2-34.6,68c-4.9,16.1-7.4,34.6-7.4,51.9c0,8.7,0,18.5,1.2,27.2c7.4,51.9,35.8,100.1,79.1,131  l34.6,56.8C132.3,436.8,73,352.8,73,257.6c0-14.8,1.2-29.7,3.7-43.3c3.7-18.5,8.7-37.1,17.3-54.4c5-7.4,8.7-16.1,13.6-23.5H148.4  L148.4,136.5z M606.8,92.1l-71.7,118.6l-42,69.2l-77.8,127.3c-17.3,12.4-35.8,21-55.6,27.2L498,210.7l29.6-48.2l16.1-27.2l4.9-8.7  h-38.3c-7.4-12.4-16.1-23.5-25.9-33.4v-1.2H606.8L606.8,92.1z M4.2,92l391.2,0.1c16.1,9.9,30.9,19.8,44.5,33.4H64.3l4.9,8.6  l14.8,24.7C77.9,172.4,73,186,69.3,199.5L4.2,92z M213.8,80.9h-59.3c42-34.6,95.1-54.4,150.8-54.4c60.5,0,118.6,22.2,161.9,64.3  c13.6,13.6,25.9,28.4,35.8,43.2c4.9,7.4,9.9,16.1,12.4,21l-21,35.8c-8.7-23.5-21-45.7-38.3-65.5C440,108.1,420.2,92.1,398,80.9  c-28.4-14.8-60.5-22.2-92.7-22.2C274.4,58.7,242.3,67.3,213.8,80.9z">
							</path>
						</svg>
					</button>
					<button class="btn-coa assembly-btn" :class="isDark ? 'dark' : ''" @mouseover="setTheme('ASSEMBLY')"
						@mouseout="applyPreviousThemeOnMouseOut()" @click="applyTheme('ASSEMBLY')">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
							id="Calque_1" x="0px" y="0px" viewBox="0 0 612 612"
							style="enable-background:new 0 0 612 612;position: initial" xml:space="preserve"
							class="coalition-flag--icon mx-auto">
							<path class="st0"
								d="M532.8,531.5c61.2-61.2,65.5-156.6,12.8-223.5c-4.3-4.3-7.1-8.5-12.8-14.2l-14.2-14.2L334.9,97.4  c-4.3,2.8-7.1,7.1-11.4,10l-10,10l199.3,199.3c4.3,4.3,8.5,10,14.2,15.7c39.9,54.1,34.2,132.4-14.2,179.3  c-25.6,25.6-61.2,39.9-96.8,39.9c-28.5,0-55.5-8.5-78.3-24.2L325,540c-2.8,2.8-7.1,5.7-10,8.5c28.5,21.3,64,32.7,99.6,32.7  C458.7,581.3,501.4,564.2,532.8,531.5L532.8,531.5z M494.3,313.7l-185,185L295.1,513c-4.3,2.8-10,8.5-15.7,12.8  c-24.2,17.1-52.7,27-82.5,27c-37,0-71.2-14.2-96.8-39.9c-47-47-54.1-122.4-15.7-176.5l-12.8-12.8c-2.8-2.8-5.7-7.1-8.5-10  c-49.8,66.9-42.7,159.4,15.7,217.8c31.3,31.3,74,48.4,118.1,48.4c38.4,0,75.4-12.8,103.9-37c4.3-4.3,8.5-7.1,14.2-12.8l14.2-14.2  L512.8,335c-2.8-4.3-7.1-7.1-10-11.4L494.3,313.7L494.3,313.7z M101.5,295.2c-4.3-4.3-8.5-10-14.2-15.7  c-39.9-54.1-34.2-132.4,14.2-179.3c25.6-25.6,59.8-39.9,96.8-39.9c28.5,0,55.5,8.5,78.3,24.2l12.8-12.8c2.8-2.8,7.1-5.7,10-8.5  c-28.5-21.3-64-32.7-99.6-32.7c-44.1,0-86.8,17.1-118.1,48.4c-61.2,61.2-65.5,156.6-12.8,223.5c4.3,4.3,7.1,8.5,12.8,14.2  l197.8,197.8c4.3-2.8,7.1-7.1,11.4-10l10-10l-185-185L101.5,295.2L101.5,295.2z M296.5,80.3c5.7-5.7,10-8.5,14.2-12.8  c28.5-24.2,65.5-37,103.9-37c44.1,0,86.8,17.1,118.1,48.4c58.4,59.8,65.5,152.3,15.7,219.2c-2.8-2.8-5.7-7.1-8.5-10l-12.8-14.2  c38.4-54.1,31.3-129.5-15.7-176.5c-25.6-25.6-59.8-39.9-96.8-39.9c-29.9,0-58.4,10-82.5,27c-5.7,5.7-11.4,10-15.7,14.2L117.2,298  l-10-10c-2.8-2.8-5.7-7.1-8.5-10L296.5,80.3L296.5,80.3z">
							</path>
						</svg>
					</button>
				</div>
				<div class="actions-content">
					<button :class="[isDark ? 'btn dark' : 'btn dark']" @click="saveAndSubmit()"><span>SAVE AND
							SUBMIT</span></button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/login.scss"></style>
