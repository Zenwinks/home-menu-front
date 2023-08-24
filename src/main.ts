import '__/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '__/App.vue';
import router from '__/router';

import i18n from '__/i18n';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
