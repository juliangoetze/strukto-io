import './styles/reset.css'
import './styles/globals.css'
import './styles/main.css'
import './styles/transitions.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

app.mount('#app')
