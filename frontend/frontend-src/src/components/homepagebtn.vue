<script lang="ts">
import { defineComponent } from 'vue';
import store from '../scripts/chat';
import { State } from '../scripts/state';
// import { imageFileFilter, randomFileName, userPicturename } from './image_utils'

export default defineComponent({
	data: function () {
		return {
			State
		}
	},
	methods: {},
	mounted() {}
})
</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	
	<p class="fa-solid fa-house" @click="$router.push({ name: State.MAIN })"></p>
</template>

<style lang="scss" scoped>
</style>