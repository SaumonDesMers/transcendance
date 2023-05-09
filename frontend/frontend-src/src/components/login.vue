<script lang="ts">
import axios from 'axios'
import { State } from '../scripts/state'
import user from '../scripts/user'
import '../styles/all.scss'
import "../styles/themes.scss"
import "../styles/buttons.scss"
import { defineComponent } from 'vue'

export default defineComponent({
	data() {
		return {
			errorMsg: '',
			user,
		}
	},

	methods: {
		login() {
			window.location.href = 'http://localhost:3001/auth/login'
		},
		async requestUserWithJwt(jwt: string) {

			const { data, error } = await this.user.login(jwt);

			if (error) {
				this.$cookie.removeCookie('jwt');
				this.login();
				return;
			}

			if (data == '')
				this.$router.push({ name: 'register' });
			else if (data == '2fa')
				this.$router.push({ name: 'validate-2fa' });
			else
				this.$router.push({ name: 'main' });
		},
	},

	mounted() {
		let jwt = this.$cookie.getCookie('jwt');
		if (jwt)
			this.requestUserWithJwt(jwt);
	},

	created() {},
	emits: ['logout']
})
</script>

<template>
	<div style="align-items: center; justify-content: center;">
		<div class="centered-container">
			<button class="btn brown" type="submit" @click="login">
				<span>Login</span>
			</button>
			<small class="error">{{ errorMsg }}</small>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/login.scss"></style>
