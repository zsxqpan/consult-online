import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import 'vant/es/toast/style'
import '@/styles/main.scss'
import 'virtual:svg-icons-register'
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/image-preview/style';

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
