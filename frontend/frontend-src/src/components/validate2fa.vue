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
	
	<div style="align-items: center; justify-content: center;">
		<div class="centered-container">
			<input v-model="twoFactorAuthenticationCode" style="text-align: center; font-size: 2em;">
			<p v-if="errorMsg" class="error" style="text-align: center;">Wrong code</p>
			<div style="display: flex; flex-direction: row;">
				<button class="btn cancel" @click="cancel">CANCEL</button>
				<button class="btn validate" @click="validate2faCode">VALIDATE</button>
			</div>
		</div>
	</div>

</template>

<style lang="scss" scoped src="../styles/validate2fa.scss"></style>