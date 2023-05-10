<script lang="ts">
import { defineComponent } from 'vue';
import store from '../scripts/chat';
import { State } from '../scripts/state';

export default defineComponent({
	data: function () {
		return {
			State,
			searchInput: '',
			searchArray: [] as {username: string, id: number}[]
		}
	},
	methods: {},
	mounted() {},
	watch: {
		searchInput() {
			store.search_user(this.searchInput).then((arr) => {
				this.searchArray = arr;
			});
		}
	},
	emits: ['logout']
})
</script>

<template>
	<div class="search-container">
		<input class="search-bar" type="text" placeholder="Search.." v-model="searchInput">
		<div v-for="user in searchArray">
			<div @click="$router.push({ name: State.USER, params: { id: user.id } })">
				<p class="username">{{user.username}}</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="../styles/profil.scss"></style>
