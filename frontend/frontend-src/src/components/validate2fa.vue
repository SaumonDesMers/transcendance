<script lang="ts">
import axios from 'axios'
import { State } from '../scripts/state'
import user from '../scripts/user'
import { defineComponent } from 'vue'

export default defineComponent({
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
				this.$router.push({ name: State.MAIN });
			})
			.catch(err => {
				this.errorMsg = err.message;
			})
		},

		cancel() {
			this.$cookie.removeCookie('jwt');
			this.$router.back();
		},

		switchPage(page: State, id?: number) {
			this.$router.push({ name: page, params: { id: id } });
		},
	},

	mounted() {	},

	created() { }
})
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

