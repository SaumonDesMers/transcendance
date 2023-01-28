<script>
export default {
	data() {
		return {
			count: 1
		}
	}
}
</script>

<template>

	<h1>Hello world !</h1>
	
	<button @click="count++">Count is {{count}}</button>

</template>

<style scoped>
</style>
