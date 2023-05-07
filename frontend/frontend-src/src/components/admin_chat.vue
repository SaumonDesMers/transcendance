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
        chat,
        channelNameInput: '',
        channeltype: undefined,
        channelKeyInput: '',
        picked: '',
      };
},
methods: {

    async saveModifications() {
        // question : besoin de modifier ici le nouveau statut du channel ? 
        // (meme question pour les statuts du user (ban/kick/mute/admin/unadmin)?
        if (this.currentChannel.type == 'KEY')
            this.currentChannel.key = this.channelKeyInput;
        
        console.log(this.currentChannel.type);
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
        currentChannel() {
            return chat.getCurrentChannel();
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
        
        
        <div class="admin-chat">
            <h1 class="title">{{ currentChannel.name }}</h1>
        
        <p style="color: white" ></p> 
        
        <!-- verifier (quand? comment?) si le user est bien owner ou admin avant tout  -->
        
        <!-- types -->
        <legend class="title">Change channel's type :</legend>
        
        <div class="title">
            <input type="radio" id="public" value="PUBLIC" v-model="picked" />
            
            <label for="public">Public</label>
            
            <input type="radio" id="private" value="PRIV" v-model="picked" />
            <label for="private">Private</label>

            <input type="radio" id="protected" value="KEY" v-model="picked" />
            <label for="protected">Protected</label>
            <div :style="[isProtected ? '' : 'display:none']">
            <p style="color: white">ENTER PASSWORD</p>
            <input type="text" id="name" name="channel" required size="15" v-model="channelKeyInput">
            </div>
        </div>
        <div>
            <legend class="title">Search user :</legend>
            <input type="text" id="type" name="user" required size="15" v-model="userNameInput">
        </div>
        <p>Choose one of this options :</p>
        <div class="title">
            <input type="radio" id="kick" value="KICK" v-model="picked" />
            <label for="kick">Kick</label>
            
            <input type="radio" id="ban" value="BAN" v-model="picked" />
            <label for="ban">Ban</label>

            <input type="radio" id="mute" value="MUTE" v-model="picked" />
            <label for="mute">Mute</label>            
        </div>
        <p>Or one of these :</p>
        <div class="title">
            <input type="radio" id="admin" value="ADMIN" v-model="picked" />
            <label for="admin">Admin</label>
            
            <input type="radio" id="unadmin" value="UNADMIN" v-model="picked" />
            <label for="unadmin">Unadmin</label>
       
        </div>
        <div>
            <!-- enregistre avant de revenir a la page precedente -->
            <button class="admin-btn" @click="saveModifications()">Save</button>
            <!-- ne change rien et fait revenir a la page precedente -->
            <button class="admin-btn" @click="switchPage(State.CHAT)">Cancel</button>
        </div>
    </div>
    </div>
</template>

<style lang="scss" scoped>
.admin-chat {
    width: 80vw;
    height: 80vh;
    background-color: rgba(0, 0, 0, 0.5);
}

.title {
    color: white;
}

.admin-btn {
    color: black;
}
</style>