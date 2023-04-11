<script>
import axios from 'axios'
import "./profil.vue"

export default {
	data: function () {
		return {
			coalition: '',
			isDark: false,
			username: '',
			id : 0,
		};
	},
	methods: {
		saveModifications() {
			console.log(this.username);
			axios
				.put(`http://localhost:3001/users/${this.id}`,
				{
					"username": this.username,
					"darkMode": this.isDark,
				})
				.then((res) => {
					this.$emit('updateUser', res.data)
				})
				.catch((error) => {
					console.log(error);
				});
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
	emits: ['updateUser']
}

</script>

<template>
	<div :class="[isDark ? 'main-page dark federation-dark' : 'main-page light federation']">
		<div style="width: 100vw; height: 100vh;">
			<div :class="[isDark ? 'profile-container profile-container-dark' : 'profile-container profile-container-light']">
				<div class="edit-profile">
					EDIT YOUR PROFILE
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
						<div class="grid">
		<div class="form-group a">
			<label>LOGIN</label>
			<input v-model='username' type="text" @click="username=''"/>
		</div>
		<div class="textarea-group">
			<label for="bio">BIO</label>
			<textarea id="bio"></textarea>
		</div>
	</div> 
	<div class="button-container">
		<button class="button" @click="saveModifications()">Enregister les modifications</button>
	</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.edit-profile {
	display: flex;
	top: 0;
	justify-content: center;
	align-items: center;
	width: 100%;
	background: url("../assets/images/federation_background.jpg");
	opacity: 0.9;
	height: 10%;
	font-size: 3vw;
	$border: 5px;
	color: #FFF;
	background-clip: padding-box;
	border-bottom: 2px solid;
	border-image: linear-gradient(0.25turn, rgb(66, 66, 66, 0), rgb(158, 158, 158, 10), rgb(255, 255, 255), rgb(158, 158, 158, 10), rgb(66, 66, 66, 0));
	border-image-slice: 1;
}

.form-group {
	margin-top: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.textarea-group label,
.form-group label {
	color: #ffffff;
	font-size: 2vw;;
	line-height: 19px;
	margin-bottom: 3vh;
	text-align: center;
	&:hover,
	&:active {
		text-shadow:
			0 0 5px #fff,
			0 0 10px #777777,
			0 0 15px #000000,
	}
}

.form-group [type],
.textarea-group textarea {
	border: 1px solid #d2d6db;
	border-radius: 6px;
	padding: 15px;
	color: white;
	background-color: rgba(165, 165, 165, 0.1);
}
.form-group [type]:hover,
.textarea-group textarea:hover {
	border-color: #a8afb9;
}

.textarea-group {
	margin-top: 24px;
}

.textarea-group textarea {
	resize: none;
	width: 100%;
	margin-top: 10px;
	height: calc(100% - 59px);
}

.checkbox-group {
	margin-top: 25px;
}

.checkbox-group label {
	display: flex;
}

.checkbox-group label::before {
	content: "\0020";
	display: flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	margin-right: 8px;
	border: 1px solid #d2d6db;
	border-radius: 6px;
	transition: background 0.1s ease-in;
}

.checkbox-group input[type="checkbox"] {
	/* ici on ne doit pas mettre de display: none afin de pouvoir "tabber" */
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}
.checkbox-group input[type="checkbox"]:focus + label:before {
	border-color: #5850eb;
}
.checkbox-group input[type="checkbox"]:checked + label:before {
	color: #fff;
	content: "\2713";
	background: #5850eb;
	border-color: #5850eb;
}

.button {
	line-height: 19px;
	background: rgba(143, 143, 143, 0.5);
	border: none;
	padding: 15px 25px;
	border-radius: 6px;
	color: white;
	margin-top: 24px;
}
.button:hover {
	background: rgba(255, 255, 255, 0.5);
}
.button:focus {
	background: rgba(255, 255, 255, 0.5);
}

// @media screen and (min-width: 768px) {
// 	body {
// 		align-items: center;
// 		justify-content: center;
// 	}

// 	.container {
// 		margin: 2rem;
// 		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
// 		border-radius: 4px;
// 		max-width: 32rem;
// 		padding: 2rem;
// 	}
// }

@media screen and (min-width: 1024px) {
	.container {
		max-width: 80%;
		width: 100%;
	}

	.checkboxes {
		display: flex;
	}
	.checkboxes > :not(:first-child) {
		margin-left: 1rem;
	}

	.grid {
		display: grid;
		grid-gap: 24px;
		grid-template-columns: 1fr;
		grid-auto-rows: 1fr;
	}

	.textarea-group {
		grid-column: 1;
		grid-row: span 2;
		margin-right: 2rem;
		width: 100%;
		text-align: center;

	}

	.button-container {
		text-align: center;
	}

	.button {
		width: auto;
	}
}
</style>