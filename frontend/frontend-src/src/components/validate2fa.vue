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

	},

	emits: ['logout']
})
</script>

<template>
	
	<div style="align-items: center; justify-content: center;">
		<div class="centered-container">
			<input v-model="twoFactorAuthenticationCode" style="text-align: center; font-size: 2em; margin-bottom: 1rem; padding: 10px">
			<p v-if="errorMsg" class="error" style="text-align: center;">Wrong code</p>
			<div style="display: flex; flex-direction: row;">
				<button class="btn cancel" @click="cancel"><span>CANCEL</span></button>
				<button class="btn validate" @click="validate2faCode"><span>VALIDATE</span></button>
			</div>
		</div>
	</div>

</template>

<style lang="scss" scoped src="../styles/validate2fa.scss"></style>