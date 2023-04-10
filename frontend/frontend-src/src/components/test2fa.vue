<script>
import axios from 'axios'

export default {
	data() {
		return {
			errorMsg: '',
		}
	},

	methods: {
		turnOn2fa(jwt) {
			axios.post('http://localhost:3001/auth/2fa/turn-on', {
				twoFactorAuthenticationCode: 'je sais pas'
			}, {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
			.then(res => {
				console.log('2fa/turn-on: res:', res);
			})
			.catch(err => {
				console.log('2fa/turn-on: err:', err);
			})
		}
	},

	mounted() {	},

	created() { }
}
</script>

<template>
	<button @click="turnOn2fa"></button>
</template>

<style>

.error {
	color: red;
}
</style>

