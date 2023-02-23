<script>
import axios from 'axios'
import io from "socket.io-client"
import loginPage from './components/login.vue'
import chat from './components/chat.vue'

export default {

	components: {
		loginPage,
		chat
	},

	data() {
		return {
			loggedIn: false,
			user: null
		}
	},

	methods: {},

	mounted() {},

	created() {}
}
</script>

<template>

	<h1>Transcendence (lol) !</h1>
	<p v-if="user != null">You are logged as {{ user.username }}</p>
	
	<div v-if="!loggedIn">
		<loginPage @loggedIn="loggedUser => {loggedIn = true; user = loggedUser}"></loginPage>
	</div>

	<div v-else>
		<chat></chat>
	</div>

</template>

<style scoped>
</style>
