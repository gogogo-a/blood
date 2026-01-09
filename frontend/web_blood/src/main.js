import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store"
import 'element-plus/theme-chalk/index.css'
import ElementPlus from 'element-plus'

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')