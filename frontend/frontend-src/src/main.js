import { createApp, reactive, ref } from 'vue'
import App from './App.vue'
import VueCookies from 'vue3-cookies';
import { Game } from './scripts/game'

const app = createApp(App);

app.config.globalProperties.globalGame = reactive(new Game());

app.use(VueCookies);

app.mount('#app');
