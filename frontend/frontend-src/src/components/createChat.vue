<script lang="ts">
import chat from '../scripts/chat';
import { CreateGroupChannelDto } from '../entities/Chat.entities';
import { State } from '../scripts/state';
import user from '../scripts/user';
import { defineComponent } from 'vue';
import { ChanType } from '../scripts/chat'


export default defineComponent({

	data: function () {
		return {
			State,
			user,
			isProtected: false,
			chat,
			channelNameInput: '',
			channeltype: undefined,
			channelKeyInput: '',
			picked: ChanType.PUBLIC as ChanType,
		};
	},
	methods: {
		async saveModifications() {
			let newChan = {
				ownerId: user.id,
				name: this.channelNameInput,
				type: this.picked,
				key: '',
				usersId: []
			};

			if (newChan.type == ChanType.KEY)
				newChan.key = this.channelKeyInput;

			console.log(newChan);
			chat.createChannel(newChan);
			this.$router.back();
		},
		// applyTheme(themeClass: string) {
		//     this.editCoa = themeClass;
		// },
		toggleDarkMode() {
			this.user.set({ darkMode: !this.user.darkMode });
			this.user.save();
		},

	},

	mounted() {
		// this.editName = this.user.username;
		// this.editBio = this.user.bio;
		// this.editCoa = this.user.coa;
	},

	emits: ['logout']
})

</script>

<template>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
		<div v-if="user.darkMode == true" style="width: 0; height: 0;">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div
			style="display: flex; justify-content: center; align-items: center; align-content: center; position:absolute; top:10%; left:10%;">
			<div class="create-chat-container">
				<h1 class="title-page">CREATE YOUR CHANNEL </h1>
				<div class="title" style="text-align: center;">
					<p>CHANNEL'S NAME</p>
					<input type="text" id="name" name="channel" required size="15" v-model="channelNameInput">
				</div>
				<div class="title">
					<input v-on:click="isProtected = false; channeltype = 'PUBLIC'" type="radio" id="public" name="channel"
						value="publicChan" checked>
					<label for="public">Public</label>
				</div>
				<div class="title">
					<input v-on:click=" isProtected = false; channeltype = 'PRIV'" type="radio" id="private" name="channel"
						value="privateChan">
					<label for="private">Private</label>
				</div>
				<div class="title">
					<input v-on:click=" isProtected = true; channeltype = 'KEY'" type="radio" id="protected" name="channel"
						value="isProtected">
					<label for="protected">Protected</label>
					<div :style="[isProtected ? '' : 'display:none']">
						<p>ENTER PASSWORD</p>
						<input type="text" id="name" name="channel" required size="15" v-model="channelKeyInput">
					</div>
				</div>
				<div class="title" style="text-align: center;">
					<button style="margin: 1rem;" class="chat-btn" @click=" saveModifications()">Save</button>
					<button style="position:relative;" class="chat-btn" @click="$router.back()">Cancel</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.create-chat-container {
	width: 80vw;
	height: 80vh;
	background-color: rgba(255, 255, 255, 0.1);
}

.title {
	color: white;
	text-align: center;
}

.title-page {
	color:white;
	text-align: center;
	font-size: 5em;
	background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
	padding: 10px;
}

.chat-btn {
	color: black;
}

</style>
