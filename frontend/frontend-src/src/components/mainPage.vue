<script>

import axios from 'axios'
import { State } from '../scripts/state';

export default {
	data: function () {
		return {
			State,
			username: '',
			isDark: false,
			windowSize: { width: window.innerWidth, height: window.innerHeight },
			id: 0,
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
			console.log(this.windowSize);
		},
		windowSize() {
			console.log(window.innerWidth * window.innerHeight);
		},
		toggleDarkMode() {
			const b = document.querySelector('body');
			if (!this.isDark) {
				this.isDark = true;
			} else {
				this.isDark = false;
			}
			axios
				.put(`http://localhost:3001/users/${this.id}`, 
				{ 
					"username": this.username,
					"darkMode": this.isDark,
				})
				.then((res) => {
				})
				.catch((error) => {
					console.log(error);
				});
		},
		switchPage(page) {
			this.$emit('switchPage', page);
		},
		getUser() {
			axios.get('http://localhost:3001/auth/user',)
				.then(res => {
					if (res.data == '')
						this.$emit('onRegister', res.data);
					else
						this.$emit('onLogin', res.data);
					localStorage.jwt = jwt;
					axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				})
				.catch(err => {
					this.errorMsg = err.message;
					console.log(err);
				})
		}
	},
	mounted() {
		axios.get('http://localhost:3001/auth/user',)
			.then(res => {
				this.username = res.data.username;
				this.isDark = res.data.darkMode;
				this.id = res.data.id;
			})
			.catch(err => {
				this.errorMsg = err.message;
				console.log(err);
			})
	},
	emits: ['switchPage'],
}
</script>

<template>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
		<title>SideBAr</title>
	</head>
	<div :class="[isDark == true ? 'main-page dark federation-dark' : 'main-page light federation']">
		<div class="sky" style="width: 100vw; height: 100vh; display: block; position:relative;">
			<div class="sun" @click="toggleDarkMode"></div>
			<div class="moon" @click="toggleDarkMode">
				<div class="dark">
				</div>
				<div class="dark">
				</div>
				<div class="dark">
				</div>
			</div>
			<div v-if ="this.isDark == false">
				<div class="cloud large cloud-1"><div></div><div></div><div></div><div></div></div>
				<div class="cloud normal cloud-2"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-3"><div></div><div></div><div></div><div></div></div>
				<div class="cloud tiny cloud-4"><div></div><div></div><div></div><div></div></div>
				<div class="cloud large cloud-5"><div></div><div></div><div></div><div></div></div>
				<div class="cloud normal cloud-6"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-7"><div></div><div></div><div></div><div></div></div>
				<div class="cloud tiny cloud-8"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-9"><div></div><div></div><div></div><div></div></div>
				<div class="cloud normal cloud-10"><div></div><div></div><div></div><div></div></div>
				<div class="cloud tiny cloud-11"><div></div><div></div><div></div><div></div></div>
				<div class="cloud small cloud-12"><div></div><div></div><div></div><div></div></div>
			</div>
			<div v-else>
				<div class="stars"></div>
				<div class="stars1"></div>
				<div class="stars2"></div>
				<div class="shooting-stars"></div>
			</div>
		</div>
	</div>
	<div :style="[windowSize.width < 620 ? 'display : none' : 'display : flex']">
		<div class="navigation">
			<ul>
				<li>
					<a href="#">
						<span class="avatar"></span>
						<span class="title" @click="switchPage(State.USER)">{{ this.username }}</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-comments"></i></span>
						<span class="title" @click="switchPage(State.CHAT)">Messages</span>
					</a>
				</li>
				<!-- <li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-bullseye"></i></span>
						<span class="title">Quests</span>
					</a>
				</li> -->
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-trophy"></i></span>
						<span class="title" @click="switchPage(State.STATS)">Statistics</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-floppy-disk"></i></span>
						<span class="title" @click="switchPage(State.HISTORY)">Game history</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon"><i class="fa-solid fa-users"></i></span>
						<span class="title" @click="switchPage(State.HISTORY)">Friends</span>
					</a>
				</li>
				<li>
					<a href="#">
						<span class="icon" @click="toggleDarkMode"><i
								:class="[isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun']"></i></span>
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
			<button class="main-button" @click="switchPage(State.GAME)">GAME</button>
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
$starFieldWidth: 2560;
$starFieldHeight: 2560;
$starStartOffset: 600px;
$starOneScrollDuration: 100s;
$starTwoScrollDuration: 125s;
$starThreeScrollDuration: 175s;
$numStarOneStars: 1700;
$numStarTwoStars: 700;
$numStarThreeStars: 200;
$numShootingStars: 10;

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
	top: 0;
	left: 0;
	position: absolute;
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
			z-index: 10;
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
			z-index: 10;
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
			z-index: 10;
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
			z-index: 10;
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
			z-index: 10;
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
			z-index: 10;
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
			z-index: 10;
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
	flex-direction: column;
	height: 100vh;
	left: 0;
	top: 0;
	position: absolute;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	z-index: 7;
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
	z-index: 10;
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
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
	width: 70px;
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
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	top: 0;
	left: 0;
	height: 100%;
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
	font-size: 17px;

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

// @media (max-width: 621px) {
// 	.navigation {
// 		left: -60px;
// 	}

// 	.navigation.active {
// 		left: 0px;
// 		width: 100%;
// 	}
// }

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

// .container
//   display: block
//   position: relative
//   width: 100%
//   height: 100%
//   background: linear-gradient(to bottom, #020107 0%, #201b46 100%)
//   .text
//     color: #FFF
//     position: absolute
//     top: 50%
//     right: 50%
//     margin: -10px -75px 0 0
//     font-size: 20px
//     font-family: sans-serif
//     font-weight: bold

@function create-stars($n) {
	$stars: "#{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF";

	@for $i from 2 through $n {
		$stars: "#{$stars} , #{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF";
	}

	@return unquote($stars);
}

@mixin star-template($numStars, $starSize, $scrollSpeed) {
	z-index: 4;
	width: $starSize;
	height: $starSize;
	border-radius: 50%;
	// background: transparent;
	box-shadow: create-stars($numStars);
	animation: animStar $scrollSpeed linear infinite;

	&:after {
		content: " ";
		top: -$starStartOffset;
		width: $starSize;
		height: $starSize;
		border-radius: 50%;
		position: absolute;
		// background: transparent;
		box-shadow: create-stars($numStars);
	}
}


@mixin shooting-star-template($numStars, $starSize, $speed) {
	z-index: 5;
	width: $starSize;
	height: $starSize + 80px;
	border-top-left-radius: 50%;
	border-top-right-radius: 50%;
	position: absolute;
	bottom: 0;
	right: 0;
	// background: linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,1));
	animation: animShootingStar $speed linear infinite;
}

.stars {
	@include star-template($numStarOneStars, 1px, $starOneScrollDuration);
}

.stars1 {
	@include star-template($numStarTwoStars, 2px, $starTwoScrollDuration);
}

.stars2 {
	@include star-template($numStarThreeStars, 3px, $starThreeScrollDuration);
}

.shooting-stars {
	@include shooting-star-template($numShootingStars, 5px, 10s);
}

@keyframes animStar {
	from {
		transform: translateY(0px);
	}

	to {
		transform: translateY(-#{$starFieldHeight}px) translateX(-#{$starFieldWidth}px);
	}
}


@keyframes animShootingStar {
	from {
		transform: translateY(0px) translateX(0px) rotate(-45deg);
		opacity: 1;
		height: 5px;
	}

	to {
		transform: translateY(-#{$starFieldHeight}px) translateX(-#{$starFieldWidth}px) rotate(-45deg);
		opacity: 1;
		height: 800px;
	}
}

@mixin animation($animation) {
	-webkit-animation: $animation;
	-moz-animation: $animation;
	-ms-animation: $animation;
	-o-animation: $animation;
	animation: $animation;
}

@mixin animation-duration($duration) {
	-webkit-animation-duration: $duration;
	-moz-animation-duration: $duration;
	-ms-animation-duration: $duration;
	-o-animation-duration: $duration;
	animation-duration: $duration;
}

@mixin keyframes($name) {
	@-webkit-keyframes #{$name} {
		@content;
	}

	@-moz-keyframes #{$name} {
		@content;
	}

	@-ms-keyframes #{$name} {
		@content;
	}

	@keyframes #{$name} {
		@content;
	}
}

.cloud {
	@include animation(clouds 60s infinite linear);
	border-radius: 10px;
	position: relative;
	margin: 33px 0 0 0;
	z-index: 3;
	width: 54px;
	height: 5px;

	background: #f7e7eb;

	&.tiny {
		scale: .5;
	}

	&.small {
		scale: 1;
	}

	&.normal {
		scale: 2;
	}

	&.large {
		scale: 4;
	}

	div {
		box-shadow: inset -2px -3px 0 0 #f7e7eb;
		position: absolute;

		border-radius: 50%;
		width: 12px;
		height: 12px;

		left: -3px;
		bottom: 0;

		background: #fafbf0;
		z-index: 3;

		&:first-child {
			&+div {
				transform: scale(1.6, 1.6);
				margin: 0 0 4px 13px;
				z-index: 2;

				&+div {
					transform : scale(2.4, 2.4);
					margin: 0 0 9px 32px;
					z-index: 1;

					&+div {
						transform : scale(1.3, 1.3);
						margin: 0 0 2px 50px;
						z-index: 0;
					}
				}
			}
		}
	}
}

@include keyframes(clouds) {
	0% {
		left: -100%;
	}

	100% {
		left: 120%;
	}
}

.cloud-1 {
	@include animation-duration(263s);
	margin-left: 20%;
	z-index: 3;
}

.cloud-2 {
	@include animation-duration(99s);
	margin-left: 90%;
	z-index: 3;
}

.cloud-3 {
	@include animation-duration(142s);
	margin-left: 50%;
	z-index: 3;
}

.cloud-4 {
	@include animation-duration(152s);
	margin-left: 43%;
	z-index: 3;
}

.cloud-5 {
	@include animation-duration(215s);
	margin-left: 83%;
	z-index: 3;
}

.cloud-6 {
	@include animation-duration(139s);
	margin-left: 73%;
	z-index: 3;
}

.cloud-7 {
	@include animation-duration(109s);
	margin-left: 69%;
	z-index: 3;
}

.cloud-8 {
	@include animation-duration(121s);
	margin-left: 100%;
	z-index: 3;
}

.cloud-9 {
	@include animation-duration(101s);
	margin-left: 10%;
	z-index: 3;
}

.cloud-10 {
	@include animation-duration(126s);
	margin-left: 14%;
	z-index: 3;
}

.cloud-11 {
	@include animation-duration(96s);
	margin-left: 73%;
	z-index: 3;
}

.cloud-12 {
	@include animation-duration(83s);
	margin-left: 51%;
	z-index: 3;
}</style>