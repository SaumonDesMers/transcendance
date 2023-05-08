<script lang="ts">
import chat from '../scripts/chat';
import { CreateGroupChannelDto } from '../../../../backend/backend-src/src/chat/GroupChannel.create.dto';
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
            ownerId:user.id,
            name:this.channelNameInput,
            type:this.picked,
            key: '',
            usersId: []
        };

            if (newChan.type == ChanType.KEY)
                newChan.key = this.channelKeyInput;

            console.log(newChan);
            chat.createChannel(newChan);
            this.switchPage(State.CHAT);
        },
		switchPage(page: State, id?: number) {
			this.$emit('switchPage', {page, id});
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
    emits: ['switchPage']
})

</script>

<template>
    <div class="main-page" :class="[user.darkMode == true ? 'dark' : 'light ', user.coa]">
        <div v-if="user.darkMode == true" style="width: 0; height: 0;">
            <div class="stars"></div>
            <div class="stars1"></div>
            <div class="stars2"></div>
			</div>
        
        <div style="display: flex; justify-content: center; align-items: center; align-content: center; position:absolute; top:10%; left:10%;">        
        <div class="create-chat-container">
            <h1 class="title">CREATE YOUR CHANNEL : </h1>
        
        <p style="color: white">CHANNEL'S NAME</p>
        <input type="text" id="name" name="channel" required size="15" v-model="channelNameInput">
        
        <!-- types -->
        <legend class="title">Choose your channel's feature:</legend>
        
        <div class="title">
            <input v-on:click="isProtected=false" type="radio" id="public" value="PUBLIC" v-model="picked" checked/>
            <label for="public">Public</label>
            
            <input v-on:click="isProtected=false" type="radio" id="private" value="PRIV" v-model="picked" />
            <label for="private">Private</label>

            <input v-on:click="isProtected=true" type="radio" id="protected" value="KEY" v-model="picked" />
            <label for="protected">Protected</label>
            <div :style="[isProtected ? '' : 'display:none']">
            <p style="color: white">ENTER PASSWORD</p>
            <input type="text" id="name" name="channel" required size="15" v-model="channelKeyInput">
            </div>
        </div>
        <div>
            <!-- enregistre avant de revenir a la page precedente -->
            <button class="chat-btn" @click="saveModifications()">Save</button>
            <!-- ne change rien et fait revenir a la page precedente -->
            <button class="chat-btn" @click="switchPage(State.CHAT)">Cancel</button>
        </div>
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
