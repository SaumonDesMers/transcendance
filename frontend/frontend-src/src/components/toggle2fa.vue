<script>
import axios from 'axios'
import { User } from '../scripts/user'
import { State } from '../scripts/state'

export default {
	data() {
		return {
			State,
			errorMsg: '',
			qrcodeBase64: '',
			twoFactorAuthenticationCode: '',
			// twoFactorAuthenticationEnable: false,
			user: new User(),
		}
	},

	methods: {
		turnOn2fa() {
			axios.post('http://localhost:3001/auth/2fa/turn-on')
				.then(res => {
					// console.log('2fa/turn-on: res:', res);
					this.qrcodeBase64 = res.data.qrcode;
					localStorage.jwt = res.data.jwt;
					this.user.isTwoFactorAuthenticationEnabled = true;
					this.user.localSave();
				})
				.catch(err => {
					// console.log('2fa/turn-on: err:', err);
				})
		},

		turnOff2fa() {
			axios.post('http://localhost:3001/auth/2fa/turn-off')
				.then(res => {
					// console.log('2fa/turn-on: res:', res);
					this.qrcodeBase64 = '';
					this.user.isTwoFactorAuthenticationEnabled = false;
					this.user.localSave();
				})
				.catch(err => {
					// console.log('2fa/turn-on: err:', err);
				})
		},

		switchPage(page) {
			this.$emit('switchPage', page);
		},
	},

	emits: ['switchPage'],

	mounted() {	},

	created() { }
}
</script>

<template>
	<button v-if="!user.isTwoFactorAuthenticationEnabled" @click="turnOn2fa">Turn on 2fa</button>
	<button v-else @click="turnOff2fa">Turn off 2fa</button>
	<img v-bind:src="qrcodeBase64" />
</template>

<style>

.error {
	color: red;
}
</style>

