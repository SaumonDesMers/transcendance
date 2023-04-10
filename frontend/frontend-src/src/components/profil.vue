<script>

import axios from 'axios'

export default {
	data: function () {
		return {
			isDark: false,
			status: false,
		}
	},
	methods: {
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

</style>