<!-- creer un component pour mute 
affichage du user qui va se faire mute 
+ avec menu deroulant ou autre pour entrer un input de duree ou de date
+ cancel / save  -->


<script>
import chat from '../scripts/chat';
import { CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto';
import { State } from '../scripts/state';
import user from '../scripts/user';

export default {

data: function () {
    return {
        State,
        user,
        isProtected: false,
        chat,
        channelNameInput: '',
        channeltype: undefined,
        channelKeyInput: '',
      };
},
methods: {
    async saveModifications() {
        // save les modifs du user selectionne
            console.log(this.currentUser());
            user = currentUser();
            this.switchPage(State.CHAT);
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
    computed: {
        currentUser() {
            // recuperer le user (a verifier pour l'argument)
            console.log(store.getUserName(user.userId));
            return user.getUserName(store.getUserName(user.userId));
        }
    },
    emits: ['switchPage']
}

</script>

<template>
    <div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
        <div v-if="user.darkMode == true" style="width: 0; height: 0;">
            <div class="stars"></div>
            <div class="stars1"></div>
            <div class="stars2"></div>
			</div>
        
        <div style="display: flex; justify-content: center; align-items: center; align-content: center; position:absolute; top:10%; left:10%;">        
        <div class="mute-chat-container">
            <h1 class="title">{{ currentUser }}</h1>
        
        <select v-model="selected">
            <option style="color: white" disabled value="">Please select one mute option</option>
            <option>10 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>3 hours</option>
            <option>24 hours</option>
        </select>
        <span>Selected: {{ selected }}</span>
        
        
            <!-- enregistre avant de revenir a la page precedente -->
            <button class="chat-btn" @click="saveModifications()">Save</button>
            <!-- ne change rien et fait revenir a la page precedente -->
            <button class="chat-btn" @click="switchPage(State.CHAT)">Cancel</button>
        </div>
    </div>
</div>

</template>

<style lang="scss" scoped>
.mute-chat-container {
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