import 'element-plus/dist/index.css'
import './assets/style/style.scss'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
const app = createApp(App);
app.use(ElementPlus)
app.use(createPinia());


app.mount('#app')
