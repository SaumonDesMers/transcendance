<script>
import axios from 'axios'
import { api } from '../api'

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
		async requestUserWithJwt(jwt) {
			// axios.get('http://localhost:3001/auth/profile', {
			// 	headers: {
			// 		Authorization : `Bearer ${jwt}`
			// 	}
			// })
			// .then(res => {
			// 	this.$emit('loggedIn', res.data);
			// 	localStorage.jwt = jwt;
			// 	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
			// })
			// .catch(err => {
			// 	this.errorMsg = err.message;
			// })
			let res = await api.login(jwt);
			if (!res.err) {
				if (res.data != null) {
					this.$emit('loggedIn', res.data);
				} else {
					this.$emit('toRegister');
				}
			} else {
				this.errorMsg = res.err;
			}
		}
	},

	emits: ['loggedIn', 'toRegister'],

	mounted() {
		let jwt = this.getJwt();
		if (jwt)
			this.requestUserWithJwt(jwt);
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
