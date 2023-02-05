<script>
import axios from 'axios'

export default {
	data: function() {
		return {
			userName: '',
			userNameErrorMsg: '',
			connectionErrorMsg: ''
		}
	},

	methods: {
		login() {
			if (this.userNameCorrect()) {
				this.userNameErrorMsg = ''
				axios.post('http://localhost:3001/user', {
						'name': this.userName,
						'email': 'example\@example.com',
						'password': '',
					})
					.then(res => {
						this.$emit('loggedIn')
					})
					.catch(error => {
						this.connectionErrorMsg = 'Error: ' + error
					})
			}
		},
		userNameCorrect() {
			if (this.userName == '') {
				this.userNameErrorMsg = 'User name cannot be empty.'
				return false
			}
			if (/\s/g.test(this.userName)) {
				this.userNameErrorMsg = 'User name cannot contains white spaces.'
				return false
			}
			return true
		}
	},

	emits: ['loggedIn'],

	mounted: function() {},

	created: function() {}
}
</script>

<template>
	<div>
		<div>
			<label for="userName">User name:</label>
			<input type="text" id="userName" v-model="userName" />
			<button type="submit" @click="login">Log in</button>
			<small class="error">{{ connectionErrorMsg }}</small>
		</div>
		<div>
			<small class="error">{{ userNameErrorMsg }}</small>
		</div>
	</div>
</template>

<style scoped>
.error {
	color: red;
}
</style>
