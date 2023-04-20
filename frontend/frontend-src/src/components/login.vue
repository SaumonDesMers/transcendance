<script>
import axios from 'axios'
import { State } from '../scripts/state'
import { User } from '../scripts/user'

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

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

$brown-orange: #C06014;
$grey-dark: #536162;
$black: #000000;
$sem-black: #1d1d1d;
$white: #FFFFFF;
$whitesmoke: #F3F4ED;
$grey: #777777;
$blue-grey: #3F4C5C;

* {
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}


html,
body {
	display: flex;
	flex-direction: columns;
	width: 100vw;
	height: 100vh;
	font-size: 16px;
	font-family: 'Righteous', cursive;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	overflow: hidden;
	justify-content: center;
	align-items: center;
}

.centered-container {
	background: $whitesmoke;
	padding: 5rem 10rem;
	border-radius: .250rem;
	border: 1px solid rgba($black, .1);
	box-shadow: 0 .125rem .25rem rgba($black, .04);
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;

	&.dark {
		background: $black;
	}
}

.btn {
	padding: 1rem 8rem;
	line-height: 2.125rem;
	border: 2px solid $brown-orange;
}

.error {
	color: red;
}
</style>