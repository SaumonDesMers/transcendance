<script>
import axios from 'axios'
import { State } from '../scripts/state'
import user from '../scripts/user'

export default {
	data() {
		return {
			State,
			errorMsg: '',
			twoFactorAuthenticationCode: '',
			user,
		}
	},

	methods: {
		validate2faCode() {
			axios.post('http://localhost:3001/auth/2fa/authenticate', {
				code: this.twoFactorAuthenticationCode
			})
			.then(res => {
				// console.log('2fa/authenticate: res:', res);
				this.user.set(res.data);
				this.switchPage(State.MAIN);
			})
			.catch(err => {
				this.errorMsg = err.message;
			})
		},

		cancel() {
			this.$cookies.remove('jwt');
			this.switchPage(State.LOGIN);
		},

		switchPage(page) {
			this.$emit('switchPage', page);
		},
	},

	emits: ['switchPage', 'user'],

	mounted() {	},

	created() { }
}
</script>

<template>
	<input v-model="twoFactorAuthenticationCode">
	<p class="error">{{ errorMsg }}</p>
	<button @click="validate2faCode">Validate</button>
	<button @click="cancel">Cancel</button>
</template>

<style>

.error {
	color: red;
}
</style>

