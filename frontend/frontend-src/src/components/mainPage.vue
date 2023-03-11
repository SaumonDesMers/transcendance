
<script>

import axios from 'axios'

export default {
	data: function () {
		return {
			username: '',
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
		}
	}
}
</script>

<template>
	<div class="main-page">

			<input class="menu-btn" type="checkbox" id="menu-btn" />
			<label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
			<div class="container">
				<nav class="side-nav">
					<div class="nav-menu">
						<span style="display: flex; justify-content: center; align-items: center;">
							<div class="animated-avatar">
								<div class="spinner"></div>
							</div>
						</span>
						<div style="padding: 20px 0;">
							<button class="but gray"><span class="menu text">GAME</span></button>
							<button class="but gray"><span class="menu text">GAME</span></button>
							<button class="but gray"><span class="menu text">GAME</span></button>
							<button class="but gray"><span class="menu text">GAME</span></button>
						</div>
					</div>
				</nav>
			</div>
		</div>
		<div class="ocean">
		<div class="wave alliance"></div>
		<div class="wave alliance"></div>
	</div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

$brown-orange: #C06014;
$grey-dark: #536162;
$black: #000000;
$sem-black: #1d1d1d;
$white: #FFFFFF;
$whitesmoke: #F3F4ED;
$grey: #777777;
$blue-grey: #3F4C5C;

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
	background: linear-gradient(to top, #a4be7b, #97b572, #8aab6a, #7da261, #709959, #659053, #5a874d, #507e47, #457341, #3b693c, #315e36, #285430);
	width: 100vw;
	height: 100vh;
}

.container {
	box-shadow: 5px 1px 4px 0 rgba(0, 0, 0, .1);
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	height: 100vh;
	width: 40%;
	max-width: 300px;
	z-index: 1;
	background-color: rgba(255, 255, 255, .25);
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
	// background-color: $whitesmoke;
}

.side-nav .nav-item {
	padding: 10px 20px;
	display: flex;
	justify-content: center;
}

.menu-text {
	padding: 0 20px;
}

.animated-avatar {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	background-color: rgba(255, 255, 255, .25);
	// background-color: white;
	border-radius: 100%;
	border: 3px solid #47ac2d;
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
	box-shadow: -3px 0px 3px 0px rgb(14, 153, 9);
}

@keyframes background {
	from {
		background-color: rgb(65, 158, 28);
		border: 3px solid rgb(8, 216, 1);
	}

	to {
		background-color: rgb(77, 173, 38);
		border: 3px solid rgb(255, 255, 255);
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
	padding: 20% 10px;
	position: relative;
	display: flex;
	flex: 0 0 auto;
	// width: 100%;
	border: none;
	align-items: center;
	justify-content: center;
	color: $sem-black;
	flex-grow: 1;
	// height: 5rem;
	font-size: 1.5rem;
	transition: color .125s ease;
	overflow: hidden;
	cursor: pointer;
	outline: none;
	// margin-block: 0.5rem;

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
		// border-color: $whitesmoke;

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

.ocean {
	height: 5%;
	width: 100%;
	z-index: 0;
	position: absolute;
	bottom: 0;
	left: 0;
	background: #4f9b38;
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
		background: url("../assets/images/wave-alliance.svg") repeat-x;
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

.endWave {
	display: none;
}
</style>