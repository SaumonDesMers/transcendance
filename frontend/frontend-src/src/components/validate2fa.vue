<script>
import axios from 'axios'
import { State } from '../scripts/state'

export default {
	data() {
		return {
			errorMsg: '',
			twoFactorAuthenticationCode: ''
		}
	},

	methods: {
		validate2faCode() {
			axios.post('http://localhost:3001/auth/2fa/authenticate', {
				twoFactorAuthenticationCode: this.twoFactorAuthenticationCode
			})
			.then(res => {
				console.log('2fa/authenticate: res:', res);
				this.switchPage(State.MAIN);
			})
			.catch(err => {
				this.errorMsg = err.message;
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
	<input v-model="twoFactorAuthenticationCode">
	<p class="error">{{ errorMsg }}</p>
	<button @click="validate2faCode">Validate</button>
	<button @click="switchPage(State.LOGIN)">Cancel</button>
</template>

<style>

.error {
	color: red;
}
</style>

