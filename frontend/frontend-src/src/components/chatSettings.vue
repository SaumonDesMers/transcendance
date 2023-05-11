<script lang="ts">
import chat from '../scripts/chat';
import { CreateGroupChannelDto } from '../entities/Chat.entities';
import { State } from '../scripts/state';
import SelfUser from '../scripts/user';
import store from "../scripts/chat";
import { defineComponent } from 'vue';
import { ChanType } from '../scripts/chat';

export default defineComponent({

    data: function () {
        return {
            State,
            SelfUser,
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
			store.setChanType(this.channeltype, this.channelKeyInput);
			this.$router.back();
		},
	},
	watch: {
		searchInput() {
			store.search_user(this.searchInput, this.currentGroupChannel?.channelId).then((arr) => {
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
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', SelfUser.coa]"
		v-if="currentGroupChannel != undefined">
		<div v-if="SelfUser.darkMode == true" style="width: 0; height: 0;">
			<div class="stars"></div>
			<div class="stars1"></div>
			<div class="stars2"></div>
		</div>
		<div
			style="display: flex; justify-content: center; align-items: center; align-content: center; position:absolute; top:10%; left:10%;">
			<div class="create-chat-container">
				<div class="title-chan">{{ currentGroupChannel?.name.toUpperCase() }} </div><br>
				<p></p>
				<div class="title">
					<input type="radio" id="public" name="channel" value="PUBLIC" checked v-model="channeltype">
					<label for="public">Public</label>
				</div>
				<div class="title">
					<input type="radio" id="private" name="channel" value="PRIV" v-model="channeltype">
					<label for="private">Private</label>
				</div>
				<div class="title">
					<input type="radio" id="protected" name="channel" value="KEY" v-model="channeltype">
					<label for="protected">Protected</label>
					<div :style="[channeltype == 'KEY' ? '' : 'display:none']">
						<p style="color: white">ENTER PASSWORD</p>
						<input type="text" id="name" name="channel" required size="15" v-model="channelKeyInput">
					</div>
				</div>
				<div class="title" style="text-align: center;">
					<p>Manage administrator</p>
					<input style="font-size: 1vw" type="text" v-model="searchInput" />
					<div>
						<p style="display:flex; justify-content: center; color: white;" v-for="user in searchArray">{{ user.username }}
							<button class="nocolor-btn" style="color:white" v-if="store.isAdmin(SelfUser.id)"
								@click="store.kick_user(user.id)">kick</button><br>
							<button class="nocolor-btn" style="color:white"
								v-if="store.isAdmin(SelfUser.id) && !store.isAdmin(user.id)"
								@click="store.ban_user(user.id, true)">ban</button>
							<button class="nocolor-btn" style="color:white"
								v-if="store.isAdmin(SelfUser.id) && !store.isAdmin(user.id)"
								@click="store.user_admin(user.id, true)">Set Admin</button>
							<button class="nocolor-btn" style="color:white"
								v-if="store.isAdmin(SelfUser.id) && store.isAdmin(user.id) && !store.isOwner(user.id)"
								@click="store.user_admin(user.id, false)">Unset Admin</button>
							<!-- <button class="nocolor-btn" style="color: white;" @click="store.user_admin(user.id, true)">MAKE ADMINISTRATOR</button> -->
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
	<div class="main-page" :class="[SelfUser.darkMode == true ? 'dark' : 'light ', SelfUser.coa]"
		v-else>
		<p style="color: red;">Please select a channel</p>
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
