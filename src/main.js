import { createApp } from 'vue'

import App from './App.vue';
import {router} from './route/router.js'
import {createPinia} from "pinia";

//store
const pinia = createPinia();
//styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import {MotionPlugin} from "@vueuse/motion";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(pinia);
app.use(MotionPlugin);
app.mount('#app')
