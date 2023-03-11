
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
				<div class="nav-menu">
					<span style="display: flex; justify-content: center; align-items: center;"><nav class="animated-avatar">
						<div class="spinner"></div>
					</nav></span>
					<li class="nav-item"><a href="#"><i class="fas fa-tachometer-alt"></i><span
								class="btn gray menu-text">Dashboard</span></a></li>
					<li class="nav-item"><a href="#"><i class="fas fa-user"></i><span class="menu-text">Users</span></a>
					</li>
					<li class="nav-item active"><a href="#"><i class="fas fa-file-alt"></i><span
								class="menu-text">Posts</span></a></li>
					<li class="nav-item"><a href="#"><i class="fas fa-play "></i><span class="menu-text">Media</span></a>
					</li>
					<li class="nav-item"><a href="#"><i class="fas fa-sign-out-alt"></i><span
								class="menu-text">exit</span></a>
					</li>
				</div>
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
	display: flex;
	justify-content: center;
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

.btn {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	width: 100%;
	height: 5%;
	font-size: 1.5rem;
	align-items: center;
	border-radius: .125rem;
	border: 2px solid $brown-orange;
	background-color: $brown-orange;
	color: $white;
	text-align: center;
	text-decoration: none;
	transition: color .125s ease;
	overflow: hidden;
	cursor: pointer;
	outline: none;
	margin-block: 0.5rem;

	&:before {
		background-color: $white;
		content: "";
		display: flex;
		transform: scale(1, 0);
		transition: transform .25s ease;
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
		background-color: transparent !important;
		color: $brown-orange;

		&:before {
			background-color: transparent;
		}

		&:hover,
		&:active {
			color: $white;
		}
	}

	&.rounded {
		border-radius: 1.1875rem;
	}

	&.hard {
		border-radius: 0;
	}
}

.btn {
	&.gray {
		background-color: $white-smoke;
		border-color: $white-smoke;

		&:hover,
		&:active {
			color: $sem-black;
		}

		&.bordered {
			color: $white-smoke;

			&:before {
				background-color: $white-smoke;
			}

			&:hover,
			&:active {
				color: $white;
			}
		}
	}
}
</style>