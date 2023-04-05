<script>

import axios from 'axios'

export default {
	data: function () {
		return {
			isDark: false,
			status: false,
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
			return (window.innerWidth);
		},
		toggleDarkMode() {
			const b = document.querySelector('body');
			if (!this.isDark) {
				this.isDark = true;
			} else {
				this.isDark = false;
			}
		},
		colorStatus() {
			if (this.status)
				return (true);
			else
				return (false);
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
		<div class="sky" style="width: 100vw; height: 100vh;">
			<div class="profil-container">
				<div class="banner-profil">
					<div class="avatar-profil">
						<div class="status-profil" :style="[status ? 'background-color: green' : 'background-color: gray']">
						</div>
					</div>
					<span class="profil-togle" @click="toggleDarkMode" style="display: flex;">
						<div :class="[isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun']" style="font-size: 1.5vw"></div>
					</span>
					<span class="profil-title" @click="toggleDarkMode"></span>
					<button class="edit-profil fa-solid fa-pencil" style="font-size: 1.5vw"></button>
				</div>
			</div>
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
			<div class="shooting-stars"></div>
		</div>
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

.main-page {
	display: flex;
	flex-direction: columns;
	width: 100vw;
	height: 100vh;
	font-family: 'Righteous', cursive;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	overflow: hidden;
	justify-content: center;
	align-items: center;
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
	}
}

.profil-container {
	position: absolute;
	width: 98%;
	font-size: 4vw;
	height: 98%;
	top: 1%;
	left: 1%;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: .250rem;
	border: 1px solid rgba($black, .1);
	box-shadow: 0 .125rem .25rem rgba($black, .04);
	display: flex;
	flex-direction: column;
}

.profil-title {
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

.profil-togle {
	position: absolute;
	display: flex;
	left: .05vw;
	height: 20%;
	color: white;
	text-align: center;
	flex-direction: column-reverse;
	justify-content: space-around;
}

.banner-profil {
	// z-index: 10;
	display: flex;
	width: 100%;
	margin: auto;
	position: absolute;
	background: url("../assets/images/assembly_background.jpg");
	height: 20%;
	$border: 5px;
	color: #FFF;
	background-clip: padding-box;
	border-bottom: 2px solid;
	border-image: linear-gradient(0.25turn, rgb(66, 66, 66, 0), rgb(158, 158, 158, 10), rgb(255, 255, 255), rgb(158, 158, 158, 10), rgb(66, 66, 66, 0));
	border-image-slice: 1;
}

.avatar-profil {
	border-radius: 50%;
	z-index: 4;
	background: url("../assets/images/sekiro-avatar.png");
	background-size: contain;
	position: relative;
	display: flex;
	min-width: 120px;
	height: 120px;
	text-align: center;
	flex-direction: column-reverse;
	justify-content: center;
	display: flex;
	margin: auto;
	$border: 5px;
	background-clip: padding-box;
	box-sizing: border-box;
	border-bottom: 2px solid;
	border-image-slice: 1;
	border-image: linear-gradient(0.25turn, rgb(66, 66, 66, 0), rgb(158, 158, 158, 10), rgb(255, 255, 255), rgb(158, 158, 158, 10), rgb(66, 66, 66, 0));
}

.edit-profil {
	background-color: transparent;
	color: white;
	border: none;
	display: flex;
	top: 40%;
	position: relative;
}

.status-profil {
	border-radius: 50%;
	position: relative;
	left: 75%;
	width: 20%;
	height: 20%;
	z-index: 10;
	top: 40%;
	// background-color: white;
	display: flex;
}

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
	background: transparent;
	box-shadow: create-stars($numStars);
	animation: animStar $scrollSpeed linear infinite;

	&:after {
		content: " ";
		top: -$starStartOffset;
		width: $starSize;
		height: $starSize;
		border-radius: 50%;
		position: absolute;
		background: transparent;
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
</style>