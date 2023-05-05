<script>
import chat from '../scripts/chat';

import { State } from '../scripts/state';
import user from '../scripts/user';


export default {

data: function () {
    return {
        State,
        user,
        isProtected: false,
    };
},
methods: {
    async saveModifications() {
        // a modifier avec les channels 
        // necessite l'import de la classe chat? 
			// this.user.username = this.editName;
			// this.user.bio = this.editBio;
			// this.user.coa = this.editCoa;
			// const { success, error } = await this.user.save();
			if (success) {
				this.switchPage(State.CHAT);
			} else {
				this.errorMsg = error;
			}
		},
    switchPage(page) {
        this.$emit('switchPage', page);
    },
    applyTheme(themeClass) {
        this.editCoa = themeClass;
    },
    toggleDarkMode() {
        this.user.set({ darkMode: !this.user.darkMode });
        this.user.save();
    },
    
},

mounted() {
    this.editName = this.user.username;
    this.editBio = this.user.bio;
    this.editCoa = this.user.coa;
},
emits: ['switchPage']
}

</script>

<template>
	<div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]" style="display: flex; justify-content: center; align-items: center;">
        <div v-if ="user.darkMode == true">
            <div class="stars"></div>
            <div class="stars1"></div>
            <div class="stars2"></div>
			</div>
        
        
        <div class="create-chat-container">
            <h1 class="title">CREATE YOUR CHANNEL : </h1>
        
        <p style="color: white">CHANNEL'S NAME</p>
        <input type="text" id="name" name="channel" required size="15">
        
        <!-- types -->
        <legend class="title">Choose your channel's feature:</legend>
        
        <div class="title">
            <input v-on:click="isProtected=false" type="radio" id="public" name="channel" value="publicChan" checked>
            <label for="public">Public</label>
        </div>
        <div class="title">
            <input v-on:click="isProtected=false" type="radio" id="private" name="channel" value="privateChan">
            <label for="private">Private</label>
        </div>
        <div class="title">
            <input v-on:click="isProtected=true" type="radio" id="protected" name="channel" value="isProtected">
            <label for="protected">Protected</label>
            <div :style="[isProtected ? '' : 'display:none']">
            <p style="color: white">ENTER PASSWORD</p>
            <input type="text" id="name" name="channel" required size="15">
            </div>
        </div>
        <div>
            <!-- enregistre avant de revenir a la page precedente -->
            <!-- <button class="chat-btn" @click="createChannel()">Save</button> -->
            <button class="chat-btn" @click="saveModifications()">Save</button>
            <!-- ne change rien et fait revenir a la page precedente -->
            <button class="chat-btn" @click="switchPage(State.CHAT)">Cancel</button>
        </div>
    </div>
    </div>
</template>

<style lang="scss" scoped>

.create-chat-container {
    width: 80vw;
    height: 80vh;
    background-color: rgba(0, 0, 0, 0.5);
}

.title {
    color: white;
    // align-items: center;
}

.chat-btn {
    color: black;
}
</style>