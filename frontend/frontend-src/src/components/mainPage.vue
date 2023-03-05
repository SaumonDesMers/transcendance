
<script>

import axios from 'axios'
import "../styles/darkTheme.scss"
import "../styles/lightTheme.scss"

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
		<div class="container">
			<nav class="side-nav">
				<ul class="nav-menu">
					<div class="animated-avatar">
						<div class="spinner"></div>
					</div>
					<li class="nav-item"><a href="#"><i class="fas fa-tachometer-alt"></i><span
								class="menu-text">Dashboard</span></a></li>
					<li class="nav-item"><a href="#"><i class="fas fa-user"></i><span class="menu-text">Users</span></a>
					</li>
					<li class="nav-item active"><a href="#"><i class="fas fa-file-alt"></i><span
								class="menu-text">Posts</span></a></li>
					<li class="nav-item"><a href="#"><i class="fas fa-play "></i><span class="menu-text">Media</span></a>
					</li>
					<li class="nav-item"><a href="#"><i class="fas fa-sign-out-alt"></i><span
								class="menu-text">exit</span></a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>

<style lang="scss">
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
}

.main-page {
	display: flex;
	background: linear-gradient(to top, #a4be7b, #97b572, #8aab6a, #7da261, #709959, #659053, #5a874d, #507e47, #457341, #3b693c, #315e36, #285430);
	width: 100vw;
	height: 100vh;
}

.container {
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	height: 100vh;
	width: 40%;
	max-width: 300px;
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
	background-color: $whitesmoke;
}

.side-nav .nav-item {
	padding: 10px 20px;
}

.nav-item.active {
	background-color: #fff;
	box-shadow: 0px -3px rgba(0, 0, 0, 0.2), 0px 3px rgba(0, 0, 0, 0.2);
}

.nav-item.active a {
	color: #2980b9;
}

.nav-item a {
	text-decoration: none;
	color: $sem-black;
}

.menu-text {
	padding: 0 20px;
}

.side-nav .nav-item.active::before {
	// content: "";
	// position: absolute;
	bottom: 100%;
	right: 0;
	height: 150%;
	width: 20px;
	// border-bottom-right-radius: 25px;
	box-shadow: 0 20px 0 0 #fff;
}

.side-nav .nav-item.active::after {
	content: "";
	position: absolute;
	// background-color: transparent;
	top: 100%;
	right: 0;
	height: 150%;
	width: 20px;
	border-top-right-radius: 25px;
	box-shadow: 0 -20px 0 0 #fff;
}

.animated-avatar {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	background-color: white;
	border-radius: 100%;
	border: 3px solid #2d4dac;
	height: 105px;
	width: 105px;
	background-image: url(https://i.picsum.photos/id/502/200/200.jpg?hmac=c6mcZ5mcmjadIeDKaJClpvPz9R9-X9q6c0Un-n73Kv4);
}

.spinner {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	border-radius: 100%;
	animation: spin 1s linear 0s infinite;
	box-shadow: -3px 0px 3px 0px rgba(14, 242, 136, 1);
}

@keyframes background {
	from {
		background-color: red;
		border: 3px solid pink;
	}

	to {
		background-color: rgb(0, 0, 0);
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
</style>