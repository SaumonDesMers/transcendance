<script>
import axios from 'axios'

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
				this.$emit('validated');
			})
			.catch(err => {
				// console.log('2fa/authenticate: err:', err);
				this.errorMsg = err.message;
			})
		},

		cancel() {
			this.$emit('cancel');
		},
	},

	emits: ['validated', 'cancel'],

	mounted() {	},

	created() { }
}
</script>

<template>
	<input v-model="twoFactorAuthenticationCode">
	<p class="error">{{ errorMsg }}</p>
	<button @click="validate2faCode">Validate</button>
</template>

<style>

.error {
	color: red;
}
</style>

