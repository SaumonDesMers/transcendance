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

	data: function() {
		return {
			loggedIn: false,
		}
	},

	methods: {},

	mounted: function() {},

	created: function() {}
}
</script>

<template>

	<h1>Transcendence (lol) !</h1>
	
	<div v-if="!loggedIn">
		<loginPage @loggedIn="loggedIn = true"></loginPage>
	</div>

	<div v-else>
		<chat></chat>
	</div>

</template>

<style scoped>
</style>
