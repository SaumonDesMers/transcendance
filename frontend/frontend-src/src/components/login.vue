<script>
import axios from 'axios'

export default {
	data() {
		return {
			errorMsg: '',
		}
	},

	methods: {
		login() {
			window.location.href = 'http://localhost:3001/auth/login'
		},
		getJwt() {
			let uri = window.location.search.substring(1);
			let params = new URLSearchParams(uri);
			return params.get("code");
		},
		requestUserWithJwt(jwt) {
			axios.get('http://localhost:3001/auth/user', {
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
				.then(res => {
					console.log('data :', res);
					if (res.data == '')
						this.$emit('onRegister', res.data);
					else
						this.$emit('onLogin', res.data);
					// console.log(res);
					localStorage.jwt = jwt;
					axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				})
				.catch(err => {
					this.errorMsg = err.message;
					console.log(err);
				})
		}
	},

	emits: ['onLogin', 'onRegister'],

	mounted() {
		let jwt = this.getJwt();
		if (jwt)
			this.requestUserWithJwt(jwt);
	},

	created() { }
}
</script>

<template>
	<div class="actions" style="align-items: center; justify-content: center;">
		<!-- <div style="display: flex; justify-content: flex-end;">
			<img src="/src/assets/images/pio-chick.gif" alt="chick-gif"
				style="width: 100px;height: 100px;animation: 1s steps(23) 5s infinite normal none running anim-ss;">
		</div> -->
		<div class="centered-container">
			<div class="actions-content">
				<button class="btn brown" type="submit" @click="login">
					<span>Login</span>
				</button>
			</div>
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
}

.actions {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-self: flex-start;
	margin: .25rem 0 1rem;
}

.actions-content {
	display: flex;
	flex-direction: row;
}

.btn {
	position: relative;
	display: inline-flex;
	flex: 0 0 auto;
	flex-direction: row;
	justify-content: center;
	align-self: center;
	padding: 1rem 8rem;
	line-height: 2.125rem;
	font-size: 1.5rem;
	font-weight: 400;
	text-align: center;
	margin: .125rem;

	border-radius: .125rem;
	border: 2px solid $brown-orange;
	background-color: $brown-orange;
	color: $white;
	text-decoration: none;
	transition: color .125s ease;
	overflow: hidden;
	cursor: pointer;
	vertical-align: middle;
	outline: none;

	&:before {
		background-color: $white;
		content: "";
		display: flex;
		transform: scale(1, 0);
		transition: transform .25s ease;
		transform-origin: 50% 100%;
		position: absolute;
		overflow: hidden;
		border-radius: 1px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
	}

	span {
		display: flex;
		position: relative;
		z-index: 1;
	}

	&:hover,
	&:active,
	&:focus {
		color: $blue-grey;

		&:before {
			transform: scale(1, 1);
		}
	}

	&.block {
		align-self: stretch;
		width: 100%;
		flex: 1 1 auto;
	}

	&.bordered {
		background-color: transparent !important;
		color: $brown-orange;

		&:before {
			background-color: $brown-orange;
		}

		&:hover,
		&:active,
		&:focus {
			color: $white;
		}
	}

	&.rounded {
		border-radius: 1.1875rem;
	}

	&.hard {
		border-radius: 0;
	}
}

.btn {
	&.brown {
		background-color: $brown-orange;
		border-color: $brown-orange;
		color: $white;

		&:hover,
		&:active,
		&:focus {
			color: $brown-orange;
		}

		&.bordered {
			color: $brown-orange;

			&:before {
				background-color: $brown-orange;
			}

			&:hover,
			&:active,
			&:focus {
				color: $white;
			}
		}
	}
}

.error {
	color: red;
}
</style>

