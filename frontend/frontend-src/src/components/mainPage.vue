
<script>

import axios from 'axios'

export default {
	data: function () {
		return {
			username: '',
			isDark: false,
			windowSize: { width: window.innerWidth, height: window.innerHeight }
		}
	},
	created() {
		window.addEventListener('resize', this.updateWindowSize);
	},
	destroyed() {
		window.removeEventListener('resize', this.updateWindowSize);
	},
	methods: {
		updateWindowSize() {
			this.windowSize = { width: window.innerWidth, height: window.innerHeight };
		},
		toggleDarkMode() {
			const b = document.querySelector('body');
			if (!this.isDark) {
				this.isDark = true;
			} else {
				this.isDark = false;
			}
		},
	}
}
</script>

<template>
	<div :class="[isDark ? 'main-page federation-dark' : 'main-page federation']">
		<div :class="[isDark ? 'container dark' : 'container light']">
			<nav class="side-nav">
				<div class="nav-menu">
					<div>
						<input type="checkbox" id="toggle">
						<label class="toggle" for="toggle" @click="toggleDarkMode"></label>
					</div>
					<span style="display: flex; justify-content: center; align-items: center;">
						<div class="animated-avatar">
							<div class="spinner"></div>
						</div>
					</span>
					<div style="padding: 20px 0;">
						<button class="but gray"><span class="menu-text">🫂 GAME</span></button>
						<button class="but gray"><span class="menu-text">GAME</span></button>
						<button class="but gray"><span class="menu-text">GAME</span></button>
						<button class="but gray"><span class="menu-text">GAME</span></button>
					</div>
				</div>
			</nav>
		</div>
		<div class="main-container">
			<button class="main-button">GAME</button>
			<button class="main-button">CUSTOM GAME</button>
		</div>
	</div>
	<div :class="[isDark ? 'ocean dark' : 'ocean federation']">
		<div :class="[isDark ? 'wave federation-dark' : 'wave federation']"></div>
		<div :class="[isDark ? 'wave federation-dark' : 'wave federation']"></div>
	</div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

$brown-orange: #C06014;
$grey-dark: #536162;
$black: #000000;
$sem-black: #1d1d1d;
$blue-grey: #3F4C5C;
$white: #FFFFFF;
$whitesmoke: #F3F4ED;
$grey: #777777;


* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Righteous', cursive;
	text-rendering: optimizeLegibility;
	font-size: 18px;
}

.main-page {
	display: flex;
	width: 100vw;
	height: 100vh;
}

.main-page {
	&.alliance {
		background-image: linear-gradient(to top, #a4be7b, #97b572, #8aab6a, #7da261, #709959, #659053, #5a874d, #507e47, #457341, #3b693c, #315e36, #285430);
		transition: none;
	}

	&.federation {
		background-image: linear-gradient(to top, #8bbfec, #7ab1e1, #69a2d6, #5894cc, #4686c1, #3b79b3, #306ca5, #255f97, #1f5082, #19416e, #12335a, #0a2647);
		transition: none;
	}

	&.assembly {
		background-image: linear-gradient(to top, #b994f0, #a681e3, #936ed5, #7f5bc8, #6b49bb, #603eb1, #5534a7, #49299d, #452394, #421d8a, #3e1781, #3a1078);
		transition: none;
	}

	&.order {
		background-image: linear-gradient(to top, #dea7ab, #d8a6a8, #cb8889, #bb6a6b, #aa4c4d, #9e3c3e, #922c2f, #851a21, #7c161d, #741218, #6b0e14, #630a10);
		transition: none;
	}

	&.alliance-dark {
		background-image: linear-gradient(to top, #285430, #254e2c, #224729, #1f4125, #1c3b22, #1a371f, #17321d, #152e1a, #132a18, #112616, #102314, #0e1f11);
		transition: none;
	}

	&.order-dark {
		background-image: linear-gradient(to top, #630a10, #5a0810, #50070f, #47070e, #3e060c, #38070b, #320709, #2c0607, #270607, #230506, #1e0405, #180304);
		transition: none;
	}

	&.federation-dark {
		background-image: linear-gradient(to top, #0a2647, #092240, #081f39, #071b33, #07182c, #061627, #051423, #04111e, #030f1a, #030c16, #020911, #02060b);
		transition: none;
	}

	&.assembly-dark {
		background-image: linear-gradient(to top, #3a1078, #350f6d, #2f0e62, #2a0c57, #250b4d, #210b45, #1c0b3e, #190a36, #16092f, #140728, #110521, #0c031a);
		transition: none;
	}
}

.main-container {
	width: 80%;
	left: 20%;
	flex: 0 0 auto;
	flex-direction: column;
	height: 100vh;
	position: absolute;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
}

.main-button {
	background-color: rgba(0, 0, 0, 0.25);
	border: none;
	color: $white;
	width: 50%;
	font-size: xxx-large;
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 2%;
	margin-top: 2%;
}

.container {
	box-shadow: 5px 1px 4px 0 rgba(0, 0, 0, .1);
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	height: 100vh;
	width: 20%;
	max-width: 20%;
	z-index: 1;
}

.container {
	&.light {
		background-color: rgba(255, 255, 255, .25);
	}

	&.dark {
		background-color: rgba(0, 0, 0, 0.25);
		color: $white;
	}
}

.side-nav,
.nav-menu {
	height: 100%;
	justify-content: left;
}

.side-nav .nav-menu {
	list-style: none;
	padding: 40px 0;
	width: 100%;
	background-color: rgba(255, 255, 255, .25);
}

.side-nav .nav-item {
	padding: 10px 20px;
	display: flex;
	justify-content: center;
}

.menu-text {
	padding: 30px 30%;
	border: rgba(0, 0, 0, 0.10);
	background-color: rgba(0, 0, 0, 0.05);
	color: $white;
    border-style: solid;
}

.animated-avatar {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	background-color: rgba(255, 255, 255, .25);
	border-radius: 100%;
	border: 3px solid #dadada;
	height: 105px;
	width: 105px;
	background-image: url(https://i.picsum.photos/id/502/200/200.jpg?hmac=c6mcZ5mcmjadIeDKaJClpvPz9R9-X9q6c0Un-n73Kv4);
}

.spinner {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	height: 100%;
	width: 100%;
	border-radius: 100%;
	background-color: rgba(255, 255, 255, .25);
	animation: spin 1s linear 0s infinite;
	box-shadow: -3px 0px 3px 0px rgb(184, 184, 184);
}

@keyframes background {
	from {
		background-color: rgb(255, 255, 255);
		border: 3px solid rgb(163, 163, 163);
	}

	to {
		background-color: rgb(151, 151, 151);
		border: 3px solid rgb(75, 75, 75);
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(180deg);
	}

	to {
		transform: rotate(1turn);
	}
}

.but {
	width: 100%;
	height: 100px;
	position: absolute;
	background-color: transparent;
	padding: 22% 10px;
	position: relative;
	display: flex;
	flex: 0 0 auto;
	border: none;
	align-items: center;
	justify-content: center;
	color: $sem-black;
	flex-grow: 1;
	font-size: 1.5rem;
	transition: color .125s ease;
	overflow: hidden;
	cursor: pointer;
	outline: none;

	&:before {
		background-color: transparent;
		content: "";
		display: flex;
		transform: scale(1, 0);
		transform-origin: 50% 100%;
		position: absolute;
		overflow: hidden;
		border-radius: 1px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
	}

	span {
		display: flex;
		position: relative;
		z-index: 1;
	}

	&:hover,
	&:active {
		color: $sem-black;

		&:before {
			transform: scale(1, 1);
		}
	}

	&.bordered {
		background-color: transparent;
		color: $sem-black;

		&:before {
			background-color: transparent;
		}

		&:hover,
		&:active {
			color: $white;
		}
	}
}

.but {
	&.gray {
		background-color: transparent;

		&:hover,
		&:active {
			color: $sem-black;
		}

		&.bordered {
			color: $sem-black;

			&:before {
				background-color: transparent;
			}

			&:hover,
			&:active {
				color: $sem-black;
			}
		}
	}
}

.centered-container-dark {
	background: $black;
}

.ocean {
	height: 5%;
	width: 100%;
	z-index: 0;
	position: absolute;
	bottom: 0;
	left: 0;
}

.ocean {
	&.alliance {
		background-color: #4f9b38;
	}

	&.federation {
		background-color: #19416e;
	}

	&.order {
		background-color: #741218;
	}

	&.assembly {
		background-color: #3e1781;
	}

	&.dark {
		background: #000000;
	}
}

.wave {
	position: absolute;
	z-index: 0;
	top: -198px;
	width: 6400px;
	height: 198px;
	animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
	transform: translate3d(0, 0, 0);
}

.wave {
	&.alliance {
		background: url("../assets/images/wave/wave-alliance.svg") repeat-x;
	}

	&.federation {
		background: url("../assets/images/wave/wave-federation.svg") repeat-x;
	}

	&.order {
		background: url("../assets/images/wave/wave-order.svg") repeat-x;
	}

	&.assembly {
		background: url("../assets/images/wave/wave-assembly.svg") repeat-x;
	}

	&.alliance-dark {
		background: url("../assets/images/wave/wave-alliance-dark.svg") repeat-x;
	}

	&.federation-dark {
		background: url("../assets/images/wave/wave-federation-dark.svg") repeat-x;
	}

	&.order-dark {
		background: url("../assets/images/wave/wave-order-dark.svg") repeat-x;
	}

	&.assembly-dark {
		background: url("../assets/images/wave/wave-assembly-dark.svg") repeat-x;
	}
}

.wave:nth-of-type(2) {
	top: -175px;
	animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite, swell 7s ease -1.25s infinite;
	opacity: 1;
}

@keyframes wave {
	0% {
		margin-left: 0;
	}

	100% {
		margin-left: -1600px;
	}
}

@keyframes swell {

	0%,
	100% {
		transform: translate3d(0, -25px, 0);
	}

	50% {
		transform: translate3d(0, 5px, 0);
	}
}

.toggle {
	cursor: pointer;
	top: -4%;
	left: 78%;
	display: inline-block;
	background: $sem-black;
	width: 60px;
	height: 25px;
	border-radius: 50px;
	position: relative;
	transition: 0.2s all ease-in-out;
}

.toggle::before {
	content: '';
	display: inline-block;
	background: #fff;
	width: 21px;
	height: 21px;
	border-radius: 50px;
	transition: 0.2s all cubic-bezier(0.85, 0.05, 0.18, 1.35);
	margin: 2px 0 0 2px;
}

input[type="checkbox"] {
	display: none;
}

input[type="checkbox"]:checked~label {
	background: $sem-black;
}

input[type="checkbox"]:checked~label::before {
	transform: translateX(35px);
}

.endWave {
	display: none;
}
</style>