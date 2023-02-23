<script>
import axios from 'axios'

export default {
	data() {
		return {
			connectionErrorMsg: '',
			url: 'http://localhost:3001/auth/login'
		}
	},

	methods: {
		login() {
			window.location.href = this.url
		},
	},

	emits: ['loggedIn'],

	mounted() {
		console.log(window.location.search)
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
