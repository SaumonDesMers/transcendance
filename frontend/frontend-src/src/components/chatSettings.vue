<script lang="ts">
import chat from '../scripts/chat';
import { CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto';
import { State } from '../scripts/state';
import user from '../scripts/user';
import store from "../scripts/chat"
import { defineComponent } from 'vue';
import { ChanType } from '../scripts/chat';

export default defineComponent({

    data: function () {
        return {
            State,
            user,
            isProtected: false,
            chat,
			store,
            channelNameInput: '',
			searchInput: '',
			searchArray: [] as {username: string, id: number}[],
            channeltype: ChanType.PUBLIC as ChanType,
            channelKeyInput: '',
        };
    },
    methods: {
        async saveModifications() {
			store.setChanType(this.channeltype);
			this.$router.back();
		},
	},
	watch: {
		searchInput() {
			store.search_user(this.searchInput).then((arr) => {
				this.searchArray = arr;
			});
		}
	},
	computed: {
		currentGroupChannel() {
			return chat.getCurrentGroupChannel();
		}
	},
	mounted() {
		if (this.currentGroupChannel != undefined)
			this.channeltype = this.currentGroupChannel.type;
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
				<div class="title-chan">{{ currentGroupChannel?.name.toUpperCase() }} </div><br>
				<p></p>
				<legend class="title">Change type's channel:</legend>
				<div class="title">
					<input v-on:click="isProtected = false; channeltype = 'PUBLIC'" type="radio" id="public"
						name="channel" value="publicChan" checked>
					<label for="public">Public</label>
				</div>
				<div class="title">
					<input v-on:click=" isProtected = false; channeltype = 'PRIV'" type="radio" id="private"
						name="channel" value="privateChan">
					<label for="private">Private</label>
				</div>
				<div class="title">
					<input v-on:click=" isProtected = true; channeltype = 'KEY'" type="radio" id="protected"
						name="channel" value="isProtected">
					<label for="protected">Protected</label>
					<div :style="[isProtected ? '' : 'display:none']">
						<p style="color: white">ENTER PASSWORD</p>
						<input type="text" id="name" name="channel" required size="15" v-model="channelKeyInput">
					</div>
				</div>
				<div class="title" style="text-align: center;">
					<p>Manage administrator</p>
					<input style="font-size: 1vw" type="text" v-model="searchInput" />
					<div>
						<p style="display:flex; justify-content: center; color: white;"
							@click="store.invite_user(user.username, true)" v-for="username in searchArray">{{ username }}
							<button style="" @click="store.user_admin(user.username, true)">MAKE ADMINISTRATOR</button>
						</p>
					</div>
					<div>
					</div>
					<div>
						<div>
							<div style="">
								<button style="margin: 1rem;" class="chat-btn"
									@click=" saveModifications()">Save</button><!-- ne change rien et fait revenir a la page precedente -->
								<button style="position:relative;" class="chat-btn"
									@click="$router.back()">Cancel</button>
							</div>
						</div>
					</div>
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
	background-color: rgba(0, 0, 0, 0.5);
}

.title {
	color: white;
	text-align: center;
}

.title-chan {
	text-align: center;
	font-size: 5em;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
	padding: 10px;
	text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px rgb(0, 0, 0),
    0 0 80px rgb(0, 0, 0);
}

.chat-btn {
	color: black;
}
</style>
