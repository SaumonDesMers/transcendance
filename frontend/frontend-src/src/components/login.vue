<script>
import axios from 'axios'

export default {
	data() {
		return {
			errorMsg: '',
			jwt: ''
		}
	},

	methods: {
		login() {
			window.location.href = 'http://localhost:3001/auth/login'
		},
		getJwt() {
			let uri = window.location.search.substring(1);
			let params = new URLSearchParams(uri);
			this.jwt = params.get("code");
		},
		requestUserWithJwt() {
			axios.get('http://localhost:3001/auth/profile', {
				headers: {
					Authorization : `Bearer ${this.jwt}`
				}
			})
			.then(res => {
				this.$emit('loggedIn', res.data);
			})
			.catch(err => {
				this.jwt = '';
				this.errorMsg = err.message;
			})
		}
	},

	emits: ['loggedIn'],

	mounted() {
		this.getJwt();
		if (this.jwt)
			this.requestUserWithJwt();
	},

	created() {}
}
</script>

<template>
	<div>
		<div>
			<button type="submit" @click="login">Log in</button>
			<small class="error">{{ errorMsg }}</small>
		</div>
	</div>
</template>

<style scoped>
.error {
	color: red;
}
</style>
