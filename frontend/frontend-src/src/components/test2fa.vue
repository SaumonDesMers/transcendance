<script>
import axios from 'axios'

export default {
	data() {
		return {
			errorMsg: '',
			qrcodeBase64: '',
			twoFactorAuthenticationCode: ''
		}
	},

	methods: {
		turnOn2fa() {
			axios.post('http://localhost:3001/auth/2fa/turn-on', {
				twoFactorAuthenticationCode: localStorage.jwt
			})
			.then(res => {
				// console.log('2fa/turn-on: res:', res);
				this.qrcodeBase64 = res.data;
			})
			.catch(err => {
				// console.log('2fa/turn-on: err:', err);
			})
		},
		
		validate2faCode() {
			axios.post('http://localhost:3001/auth/2fa/authenticate', {
				twoFactorAuthenticationCode: this.twoFactorAuthenticationCode
			})
			.then(res => {
				console.log('2fa/authenticate: res:', res);
			})
			.catch(err => {
				// console.log('2fa/authenticate: err:', err);
			})
		}
	},

	mounted() {	},

	created() { }
}
</script>

<template>
	<button @click="turnOn2fa">Turn on 2fa</button>
	<img v-bind:src="qrcodeBase64" />
	<input v-model="twoFactorAuthenticationCode">
	<button @click="validate2faCode">Validate</button>
</template>

<style>

.error {
	color: red;
}
</style>

