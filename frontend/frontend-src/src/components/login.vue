<script>
import axios from 'axios'

export default {
	data() {
		return {
			connectionErrorMsg: '',
			// url: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-83a9e79a18485926a5999f8d21d7a446e76d4e9e3cda5ac0c65f0198f390f2d0&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code'
			url: 'http://localhost:3001/auth/login'
		}
	},

	methods: {
		login() {
			window.location.href = this.url
			// axios.get(url, {
			// 		headers: {
			// 			'Access-Control-Allow-Origin': '*',
			// 			'Content-Type': 'application/json',
			// 		},
			// 	})
			// 	.then(res => {
			// 		console.log(res)
			// 		this.$emit('loggedIn')
			// 	})
			// 	.catch(error => {
			// 		this.connectionErrorMsg = 'Error: ' + error
			// 	})
		},
		requestAuth() {
			axios.get('http://localhost:3001/auth' + window.location.search)
				.then(res => {
					console.log('auth request response', res)
				})
				.catch(error => {
					console.log('Error when request auth', error)
				})
		}
	},

	emits: ['loggedIn'],

	mounted() {
		console.log(window.location.search)
		// this.requestAuth()
	},

	created() {}
}
</script>

<template>
	<div>
		<div>
			<button type="submit" @click="login">Log in</button>
			<small class="error">{{ connectionErrorMsg }}</small>
		</div>
	</div>
</template>

<style scoped>
.error {
	color: red;
}
</style>
