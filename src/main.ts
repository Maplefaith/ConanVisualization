import {createApp} from 'vue'

import App from './App.vue'

// import router
import router from './router'

// import pinia
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')