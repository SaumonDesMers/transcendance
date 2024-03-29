import { createApp, reactive, ref } from 'vue'
import App from './App.vue'
import VueCookies from 'vue3-cookies';
import { createRouter, createWebHistory } from 'vue-router';
import { VueCookieNext } from 'vue-cookie-next'

import main from './components/mainPage.vue';
import login from './components/login.vue';
import validate2fa from './components/validate2fa.vue';
import register from './components/register.vue';
import profile from './components/profil.vue';
import edit from './components/edit.vue';
import history from './components/history.vue';
import game from './components/game.vue';
import chat from './components/chat.vue';
import friends from './components/friends.vue';
import createChat from './components/createChat.vue';
import chatSettings from './components/chatSettings.vue';

import mute from './components/mute.vue'

const routes = [
	{ name: 'main', path: '/', component: main },
	{ name: 'login', path: '/login', component: login },
	{ name: 'validate-2fa', path: '/validate-2fa', component: validate2fa },
	{ name: 'register', path: '/register', component: register },
	{ name: 'profile', path: '/profile/:id', component: profile },
	{ name: 'edit', path: '/edit', component: edit },
	{ name: 'history', path: '/history/:id', component: history },
	{ name: 'game', path: '/game', component: game },
	{ name: 'chat', path: '/chat', component: chat },
	{ name: 'friends', path: '/friends/:id', component: friends },
	{ name: 'create-chat', path: '/create-chat', component: createChat },
	{ name: 'chat-settings', path: '/chat-settings', component: chatSettings },
	{ name: 'mute', path: '/mute', component: mute },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const app = createApp(App);

app.use(VueCookieNext).use(router);

app.mount('#app');
