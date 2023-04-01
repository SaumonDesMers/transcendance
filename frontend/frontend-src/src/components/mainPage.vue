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
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
		<link rel="stylesheet" href="https://kit.fontawesome.com/76ec232e00.css" crossorigin="anonymous">
		<link rel="stylesheet" href="./sidebar.css">
		<title>SideBAr</title>
	</head>
	<div :class="[isDark ? 'main-page dark assembly-dark' : 'main-page light assembly']">
		<div class="sun" @click="toggleDarkMode"></div>
		<div class="moon" @click="toggleDarkMode">
			<div class="dark">
			</div>
			<div class="dark">
			</div>
			<div class="dark">
			</div>
		</div>
		<div id="App" class="navigation">
			<ul>
				<li>
					<a href="#">
						<span class="avatar"></span>
						<span class="title">Username</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-user"></i></span>
						<span class="title">Profile</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-comments"></i></span>
						<span class="title">Messages</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-bullseye"></i></span>
						<span class="title">Quests</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-trophy"></i></span>
						<span class="title">Statistics</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-floppy-disk"></i></span>
						<span class="title">Game history</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-users"></i></span>
						<span class="title">Friends</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon" @click="toggleDarkMode"><i :class="[isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun']"></i></span>
						<span class="title" @click="toggleDarkMode">Theme</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
						<span class="title">SignOut</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="main-container">
			<button class="main-button">GAME</button>
			<button class="main-button">CUSTOM GAME</button>
		</div>
	</div>
	<div :class="[isDark ? 'ocean dark' : 'ocean assembly']">
		<div :class="[isDark ? 'wave assembly-dark' : 'wave assembly']"></div>
		<div :class="[isDark ? 'wave assembly-dark' : 'wave assembly']"></div>
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
	&.light {
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
		.sun {
			width: 190px;
			height: 190px;
			border-radius: 140px;
			position: relative;
			display: flex;
			background: radial-gradient(hsl(50, 100%, 50%) 20%, hsl(39, 100%, 50%));
			box-shadow: inset 0 0 20px 2px hsl(39, 100%, 80%), 0 0 90px 40px hsla(39, 96%, 52%, 0.4);
			left: 85vw;
			top: 2vw;
		}
	}

	&.dark {
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

		.moon {
			background: whitesmoke;
			display: flex;
			width: 190px;
			height: 190px;
			border-radius: 100%;
			position: relative;
			box-shadow: inset -11px -8px 0px 4px rgb(0, 0, 0, 0.05),
				0px 0px 10px 0px rgb(250, 250, 250),
				0px 0px 50px 0px rgb(250, 250, 250),
				0px 0px 500px 0px rgb(250, 250, 250);
			left: 85vw;
			top: 2vw;
		}

		.moon .dark {
			content: "";
			background: rgb(0, 0, 0, 0.25);
			position: absolute;
			width: 50px;
			height: 50px;
			bottom: 8px;
			left: 50px;
			border-radius: 100%;
		}

		.moon .dark:nth-child(1) {
			content: "";
			background: rgb(0, 0, 0, 0.25);
			position: absolute;
			width: 80px;
			height: 80px;
			top: 50px;
			left: 25px;
			border-radius: 100%;
		}

		.moon .dark:nth-child(1)::after {
			content: "";
			background: rgb(250, 250, 250, 0.6);
			width: 78px;
			height: 78px;
			position: absolute;
			bottom: 0px;
			left: 7px;
			border-radius: 100%;
		}

		.moon .dark::after {
			content: "";
			background: rgb(250, 250, 250, 0.6);
			width: 45px;
			height: 45px;
			position: absolute;
			bottom: 0px;
			left: 7px;
			border-radius: 100%;
		}

		.moon .dark:nth-child(2) {
			content: "";
			background: rgb(0, 0, 0, 0.35);
			position: absolute;
			width: 20px;
			height: 20px;
			bottom: 40px;
			left: 25px;
			border-radius: 100%;
		}

		.moon .dark:nth-child(2)::after {
			content: "";
			background: rgb(250, 250, 250, 0.6);
			width: 18px;
			height: 18px;
			position: absolute;
			bottom: 0px;
			left: 4px;
			border-radius: 100%;
		}
	}

}

.main-container {
	width: 100%;
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
	width: 35%;
	font-size: 4vw;
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 2%;
	margin-top: 2%;

	&:hover,
	&:active {
		text-shadow:
			0 0 5px #fff,
			0 0 10px #fff,
			0 0 20px #fff,
			0 0 30px rgb(199, 199, 199),
			0 0 40px rgb(134, 134, 134);
	}
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

.navigation {
	position: fixed;
	z-index: 1;
	width: 70px;
	max-width: 15%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.25);
	color: $white;
	overflow: hidden;
	transition: 0.5s;
}

.navigation:hover,
.navigation.active {
	width: 200px;
}

.navigation ul {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}

.navigation ul li {
	position: relative;
	width: 100%;
	list-style: none;
	transition: 1s;
}

.navigation ul li:hover {
	background: rgba(0, 0, 0, 0.5);
}

.navigation ul li a {
	position: relative;
	display: block;
	width: 100%;
	display: flex;
	height: 10vh;
	text-decoration: none;
	color: $white;
}

.navigation ul li a .icon {
	position: relative;
	display: flex;
	width: 70px;
	min-width: 63px;
	height: 100px;
	line-height: 60px;
	text-align: center;
	flex-direction: column-reverse;
	justify-content: space-around;
}

.navigation ul li a .avatar {
	border-radius: 10px 100px / 120px;
	background: url("../assets/images/sekiro-avatar.png") no-repeat;
	background-size: contain;
	position: relative;
	display: flex;
	min-width: 55px;
	height: 60px;
	line-height: 55px;
	margin: 20px 7px;
	text-align: center;
	flex-direction: column-reverse;
	justify-content: space-around;
}

.navigation ul li a .icon .fa {
	font-size: 24px;
}

.navigation ul li a .title {
	position: relative;
	display: flex;
	padding: 0 10px;
	height: 10px;
	line-height: 100px;
	text-align: center;
	white-space: nowrap;
	font-size: 1vw;

	&:hover,
	&:active {
		text-shadow:
			0 0 5px #fff,
			0 0 10px #777777,
			0 0 15px #000000,
	}
}

.toggle {
	position: absolute;
	top: 0;
	right: 0;
	width: 60px;
	height: 60px;
	background: #074848;
	transition: 0.7s;
}

.toggle.active {
	background: #ff7700;
}

.toggle::before {
	content: "\f0c9";
	font-family: fontAwesome;
	position: absolute;
	width: 100%;
	height: 100%;
	line-height: 60px;
	text-align: center;
	font-size: 24px;
	color: #fff;
}

.toggle.active::before {
	content: "\f00d";
}

@media (max-width: 767px) {
	.navigation {
		left: -60px;
	}

	.navigation.active {
		left: 0px;
		width: 100%;
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
		background-color: #315e36;
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
	// cursor: pointer;
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