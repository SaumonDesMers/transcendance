<script>
import axios from 'axios'
import { State } from '../scripts/state'
import { User } from '../scripts/user'
import '../styles/all.scss'
import "../styles/themes.scss"
import "../styles/buttons.scss"

export default {
	data() {
		return {
			errorMsg: '',
			user: new User(),
		}
	},

	methods: {
		login() {
			window.location.href = 'http://localhost:3001/auth/login'
		},
		async requestUserWithJwt(jwt) {
			await axios.get('http://localhost:3001/auth/user', {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
				.then(res => {
					// console.log('data :', res.data);
					axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
					if (res.data == '') {
						this.$emit('switchPage', State.REGISTER);
					}
					else if (res.data == '2fa') {
						this.$emit('switchPage', State.VALIDATE_2FA);
					}
					else {
						this.user.set(res.data);
						this.$emit('switchPage', State.MAIN);
					}
				})
				.catch(err => {
					this.errorMsg = err.message;
					console.log(err);
				})
		},
		switchPage(page) {
			this.$emit('switchPage', page);
		},
	},

	emits: ['switchPage', 'user'],

	mounted() {
		let jwt = this.$cookies.get('jwt');
		if (jwt)
			this.requestUserWithJwt(jwt);
	},

	created() { }
}
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