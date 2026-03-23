import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import './style.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);

app.mount('#app');
