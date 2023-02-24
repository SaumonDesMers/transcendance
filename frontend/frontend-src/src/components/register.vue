<script>
import axios from 'axios'

export default {
	data() {
		return {
			username: ''
		}
	},

	methods: {
		register() {
			axios.post()
		}
	},

	mounted() {},

	created() {}
}
</script>

<template>
	<input v-model="username">
	<button>Submit</button>
</template>

<style scoped>
.error {
	color: red;
}
</style>
