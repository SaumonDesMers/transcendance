<script lang="ts">

import axios from 'axios'
import { State } from '../scripts/state';
import SelfUser from '../scripts/user';
import { User } from '../scripts/user';
import userLoader from '@/scripts/user.loader';
import { defineComponent } from 'vue';
import homepagebtn from './homepagebtn.vue';

export default defineComponent({
	data: function () {
		return {
			State,
			status: false,
			SelfUser,
			displayUser: new User(),
			userLoader,
			ladder: [] as {id:number, username:string}[], // TODO: type this
		}
	},
	watch: {
		'$route.params'(oldVal, newVal) {
			this.fetchData(parseInt(newVal.id));
		}
	},
	methods: {
		toggleDarkMode() {
			this.SelfUser.set({ darkMode: !this.SelfUser.darkMode });
			this.SelfUser.save();
		},
		fetchData(id: number) {
			this.userLoader.users.clear();
			this.displayUser.loadUser(parseInt(this.$route.params.id as string))
			.then(nothing => {
				this.displayUser.downloadAvatar();
				this.displayUser.loadHistory();
			})

			this.userLoader.addUser(this.displayUser);
			axios.get(`http://localhost:3001/games/ladder`, {
			params: {
				take: 10
			}
			}).then(res => {
				this.ladder = res.data;
			}).catch(err => {
				console.log('err :', err);
			});
		}
	},
	mounted() {
		this.fetchData(parseInt(this.$route.params.id as string));
	},
	emits: ['logout'],
	components: { homepagebtn }
})
</script>

<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', SelfUser.coa]">
		<div v-if="SelfUser.darkMode == false">
		</div>
		<div v-else>
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div style="color:aliceblue">
			<homepagebtn></homepagebtn>
		</div>
		<div style="height: 100vh; overflow: scroll;">
			<div class="grid-history">
				<div class="best-players">
					<h1 class="text-color-dark"><p class="fa-solid fa-ranking-star"></p> BEST PLAYERS <p class="fa-solid fa-ranking-star"></p><br></h1>
					<div v-for="(user, rank) in ladder">
						<p class="text-color-dark" @click="$router.push({ name: State.USER, params: { id: user.id }})">{{ rank + 1 }} : {{ user.username }}<br></p>
					</div>
				</div>
				<div class="friends-grid">
					<div v-for="game in displayUser.history">
						<div class="friend">
							<div class="avatar">	
								<div class="avatar-style" :style="['background-image: url(\'' + userLoader.getUser(game.loserId).avatar.imageBase64 + '\')']">
									<div class="status-profile"
										:style="[SelfUser.id ? 'background-color: green' : 'background-color: gray']"></div>
								</div>
								<div class="status"></div>
							</div>
							<div class="avatar">
								<div class="avatar-style" :style="['background-image: url(\'' + userLoader.getUser(game.winnerId).avatar.imageBase64 + '\')']">
									<div class="status-profile"
										:style="[SelfUser.id ? 'background-color: green' : 'background-color: gray']"></div>
								</div>
								<div class="status"></div>
							</div>
							<div class="result-grid" :class="[SelfUser.darkMode ? 'text-color-dark' : 'text-color-light']">
								<p class="login" @click="$router.push({ name: State.USER, params: { id: game.loserId } })">{{ userLoader.getUser(game.loserId).username }}<br></p>
								<p class="fa-solid fa-skull"><br></p>
								<p class="score">{{ game.LoserScore }}<br></p>
							</div>
							<div class="result-grid goldBG goldText"
								:class="[SelfUser.darkMode ? 'text-color-dark' : 'text-color-light']">
								<p class="login" @click="$router.push({ name: State.USER, params: { id: game.winnerId } })">{{ userLoader.getUser(game.winnerId).username }}<br></p>
								<p class="fa-solid fa-trophy"><br></p>
								<p class="score">{{ game.winnerScore }}<br></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.grid-history {
	display: grid;
	grid-template-columns: 1fr 2fr;
	// grid-template-rows: 1fr 1fr;
}

.best-players {
	display: grid;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 95vh;
	margin-left: 1rem;
	gap: 1rem;
	background-color: rgba(0, 0, 0, 0.5);
	margin-top: 1rem;
	margin-bottom: 0.5rem;
}

.title {
	font-size: 25px;
}

.friends-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	// gap: 1rem;
	align-items: center;
	justify-content: center;
}

.friend {
	background-color: rgba(0, 0, 0, 0.5);
	display: grid;
	// padding: 0.5rem;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	width: 35rem;
	height: 15rem;
}

.text-color-dark {
	color: white;
	font-size: 20px;
	text-transform: uppercase;
	text-align: center;

	&:hover,
	&:active {
		text-shadow:
			0 0 10px #fff,
			0 0 15px #777777,
			0 0 25px #000000,
	}
}

.text-color-light {
	color: rgb(0, 0, 0, 0.6);

	&:hover,
	&:active {
		color: rgb(0, 0, 0, 1);
	}
}

@media screen and (min-width: 768px) {
	body {
		align-items: center;
		justify-content: center;
	}

	.friend {
		padding: 0.5rem;
		width: 35rem;
		height: 15rem;
	}

	.friends-grid {
		margin-top: 1rem;
		margin-bottom: 1rem;
		gap: 5rem;
	}
}

.avatar {
	grid-row: span 1;
	display: flex;
	justify-content: center;
}

.avatar-style {
	border-radius: 50%;
	background: url("https://unsplash.it/100/100");
	width: 100px;
	height: 100px;
}

.result-grid {
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	font-size: 20px;
	padding: 0.5rem;
	margin: 0.5rem;
	text-align: center;
}

.login {
	text-align: start;
}

.score {
	text-align: end;
}

:root {
	--goldBackground: linear-gradient(45deg, #AE8625, #F7EF8A, #D2AC47, #EDC967);
}

.goldBG {
	background: linear-gradient(45deg, #AE8625, #F7EF8A, #D2AC47, #EDC967, #AE8625, #F7EF8A, #D2AC47, #EDC967, #AE8625, #F7EF8A);
	background-position: 0 0;
}

@keyframes AnimationName {
	0% {
		background-position: 0% 0%
	}

	100% {
		background-position: 100% 0%
	}
}

.goldText {
	animation: AnimationName 10s linear infinite;
}
</style>
