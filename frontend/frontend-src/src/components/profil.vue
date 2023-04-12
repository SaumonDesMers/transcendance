<script>

import axios from 'axios'
import { State } from '../scripts/state';
import { User } from '../scripts/user';

export default {
	data: function () {
		return {
			State,
			// isDark: false,
			status: false,
			user: new User(),
			// username: '',
			// federation: 1,
			// alliance: 0,
			// assembly: 0,
			// order: 0,
			// id: 0,
		}
	},
	methods: {
		toggleDarkMode() {
			// const b = document.querySelector('body');

			// if (!this.isDark) {
			// 	this.isDark = true;
			// } else {
			// 	this.isDark = false;
			// }
			this.user.darkMode = !this.user.darkMode;

			// axios
			// 	.patch(`http://localhost:3001/users/${this.user.id}`, 
			// 	{ 
			// 		"darkMode": this.isDark,
			// 	})
			// 	.then((res) => {
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 	});
			this.user.save();
		},
		// colorStatus() {
		// 	if (this.status)
		// 		return (true);
		// 	else
		// 		return (false);
		// },
		// updateUser(user) {
		// 	this.username = user.username;
		// 	this.isDark = user.darkMode;
    	// },
		switchPage(page) {
			this.$emit('switchPage', page);
		},
	},
	mounted() {
		// axios.get('http://localhost:3001/auth/user',)
		// 	.then(res => {
		// 		this.username = res.data.username;
		// 		this.isDark = res.data.darkMode;
		// 		this.id = res.data.id;
		// 	})
		// 	.catch(err => {
		// 		this.errorMsg = err.message;
		// 		console.log(err);
		// 	})
	},
	emits: [/*'onEdit', 'onChat', */'switchPage']
}
</script>

<template>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
	</head>
	<div :class="[user.darkMode ? 'main-page dark federation-dark' : 'main-page light federation']">
		<div style="width: 100vw; height: 100vh;">
		<div :class="[user.darkMode == true ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="banner-profile federation">
					<div class="avatar-profile">
						<div class="status-profile" :style="[status ? 'background-color: green' : 'background-color: gray']"></div>
					</div>
					<span class="profile-toggle" @click="toggleDarkMode" style="display: flex;">
						<div :class="[user.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun']" style="font-size: 1.5vw"></div>
					</span>
				</div>
				<div class="profile-grid">
					<div class="information-profile-container">
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> {{ user.username }}</div>
						<!-- <edit-form @updateUser="updateUser" :username="user.username" :isDark="user.isDark" :id="id" /> -->
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']" @click="switchPage(State.CHAT)">chat</div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> xp </div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark' : 'text-nav text-color-light']"> coalition </div>
						<div :class="[user.darkMode ? 'text-nav text-color-dark fa-solid fa-edit' : 'text-nav text-color-light fa-solid fa-edit']" @click="switchPage(State.EDIT)"></div>
					</div>
					<div class="bio-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">Bio</div>
						<div class="child-container">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non porttitor sem. Vestibulum ac massa tempus, auctor ex ut, lobortis tellus. Phasellus id tortor viverra, dictum diam nec, efficitur dui. Nullam placerat viverra tortor in ultricies. Quisque pellentesque hendrerit vulputate. Aenean dapibus dui lectus, nec dapibus arcu aliquam eget. Aenean dignissim arcu quis iaculis auctor.</div>
					</div>
					<div class="friend-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">friends</div>
						<div class="grid-friend">
							<div class="friend">
								<div>PixelPaddle</div>
							</div>
							<div class="friend">
								<div>BallBattler</div>
							</div>
							<div class="friend"><div>RetroRacket</div></div>
							<div class="friend"><div>ScoreSmasher</div></div>
							<div class="friend"><div>PongProphet</div></div>
							<div class="friend"><div>ArcadeAce</div></div>
							<div class="friend"><div>VirtualVolley</div></div>
							<div class="friend"><div>GameGuru</div></div>
							<div class="friend"><div>SpinMaster</div></div>
							<div class="friend"><div>PaddlePal</div></div>
							<div class="friend"><div>BlockBuster</div></div>
							<div class="friend"><div>NetNinja</div></div>
						</div>
					</div>
					<div class="stats-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">stats</div>
						<div class="child-container">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non porttitor sem. Vestibulum ac massa tempus, auctor ex ut, lobortis tellus. Phasellus id tortor viverra, dictum diam nec, efficitur dui. Nullam placerat viverra tortor in ultricies. Quisque pellentesque hendrerit vulputate. Aenean dapibus dui lectus, nec dapibus arcu aliquam eget. Aenean dignissim arcu quis iaculis auctor.</div>
					</div>
					<div class="history-container grid-border">
						<div :class="[user.darkMode ? 'text-nav text-color-dark ' : 'text-nav text-color-light']">history</div>
						<div class="child-container">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non porttitor sem. Vestibulum ac massa tempus, auctor ex ut, lobortis tellus. Phasellus id tortor viverra, dictum diam nec, efficitur dui. Nullam placerat viverra tortor in ultricies. Quisque pellentesque hendrerit vulputate. Aenean dapibus dui lectus, nec dapibus arcu aliquam eget. Aenean dignissim arcu quis iaculis auctor.</div>
					</div>
				</div>
			</div>
			<div v-if ="user.darkMode == false">
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

.profile-container {
	position: absolute;
	width: 98%;
	font-size: 4vw;
	height: 98%;
	top: 1%;
	left: 1%;
	z-index: 4;
	border-radius: .250rem;
	border: 1px solid rgba($black, .1);
	box-shadow: 0 .125rem .25rem rgba($black, .04);
	display: flex;
	flex-direction: column;
}

.profile-container-light {
	background-color: rgba(131, 131, 131, 0.4);	
}

.profile-container-dark {
	background-color: rgba(0, 0, 0, 0.5);	
}

.profile-toggle {
	position: absolute;
	display: flex;
	height: 2rem;
	width: 2rem;
	top: .05vw;
	right: .05vw;
	z-index: 10;
	color: white;
	text-align: center;
	flex-direction: column-reverse;
	justify-content: space-around;

	&:hover,
	&:active {
		text-shadow:
			0 0 5px #fff,
			0 0 10px #777777,
			0 0 15px #000000,
	}
}

.banner-profile {
	display: flex;
	width: 100%;
	margin: auto;
	opacity: 0.9;
	height: 20%;
	$border: 5px;
	color: #FFF;
	background-clip: padding-box;
	border-bottom: 2px solid;
	border-image: linear-gradient(0.25turn, rgb(66, 66, 66, 0), rgb(158, 158, 158, 10), rgb(255, 255, 255), rgb(158, 158, 158, 10), rgb(66, 66, 66, 0));
	border-image-slice: 1;
	&.alliance {
		background: url("../assets/images/alliance_background.jpg");
	}

	&.federation {
		background: url("../assets/images/federation_background.jpg");
	}

	&.assembly {
		background: url("../assets/images/assembly_background.jpg");
	}

	&.order {
		background: url("../assets/images/order_background.jpg");
	}
}

.avatar-profile {
	border-radius: 50%;
	z-index: 4;
	background: url(https://unsplash.it/120/120) no-repeat;
	background-size: cover;
	position: relative;
	min-width: 120px;
	height: 120px;
	text-align: center;
	flex-direction: column-reverse;
	justify-content: center;
	margin: auto;
}

.edit-profile {
	background-color: transparent;
	color: white;
	border: none;
	display: flex;
	top: 40%;
	position: relative;

	&:hover,
	&:active {
		text-shadow:
			0 0 5px #fff,
			0 0 10px #777777,
			0 0 15px #000000,
	}
}

.status-profile {
	border-radius: 50%;
	position: relative;
	left: 75%;
	width: 20%;
	height: 20%;
	z-index: 10;
	top: 75%;
	display: flex;
}

.information-profile-container {
	display: flex;
	justify-content:space-evenly;
	background-color: rgba(255, 255, 255, 0.1);
	height: 65px;
	margin: 1vw;
	grid-column: 1/3;
	border-color: transparent;
}

.text-nav {
	position: relative;
	text-transform: uppercase;
	display: flex;
	align-content: center;
	justify-content: center;
	font-size: 30px;
	padding: 1.5vh;
	color: white;
}

.text-color-dark {
	color: white;
	&:hover,
	&:active {
	text-shadow :
		0 0 10px #fff,
		0 0 15px #777777,
		0 0 25px #000000,
	}
}

.text-color-light {
	color: rgb(0,0,0,0.6);
	&:hover,
	&:active {
		color: rgb(0,0,0,1);
	}
}

.profile-grid {
	display: grid;
	background: rgb(0,0,0,0);
	width: 100%;
	height: 100%;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto 1fr 1fr;
}

.grid-border {
	$border: 5px;
	color: #FFF;
	border-top: 1px solid;
	border-image: linear-gradient(0.25turn, rgb(66, 66, 66, 0), rgb(158, 158, 158, 10), rgb(255, 255, 255), rgb(158, 158, 158, 10), rgb(66, 66, 66, 0));
	border-image-slice: 1;
}

.bio-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: transparent;
}

.friend-container {
	display: flex;
	justify-content: center;
	flex-direction: column;
	background-color: transparent;
}

.grid-friend {
	display: grid;
	background-color: rgba(255, 255, 255, 0.1);
	padding: 1rem;
	margin: 3rem;
	margin-top: 1rem;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 1rem;
	flex-grow: 1;
}

.friend {
	background-image: url(https://unsplash.it/85/78);
	background-size: cover;
	opacity: 0.8;
}

.friend div {
	height: 100%;
	width: 100%;
	margin-top: auto;
	color: transparent;
	font-size: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover,
	&:focus {
		color: white;
		background-color: rgba(0, 0, 0, 0.8);
		text-shadow:
			0 0 5px #fff,
			0 0 10px #777777,
			0 0 15px #000000,
	}
}

.history-container {
	display: flex;
	justify-content: center;
	flex-direction: column;
	background-color: transparent;
}

.stats-container {
	display: flex;
	justify-content: center;
	flex-direction: column;
	background-color: transparent;
}

.child-container {
	justify-content: center;
	text-align: justify;
	padding: 1rem;
	flex-grow: 1;
	margin: 3rem;
	margin-top: 1rem;
	background-color: rgba(255, 255, 255, 0.1);
}


</style>