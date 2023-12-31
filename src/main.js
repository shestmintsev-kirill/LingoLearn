import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { Quasar } from 'quasar'
import quasarUserOptions from '@/plugins/quasar-user-options'
import { firebaseApp } from '@/plugins/firebase'
import { VueFire, VueFireAuth } from 'vuefire'
import '@/styles/main.scss'

createApp(App)
	.use(VueFire, {
		firebaseApp,
		modules: [VueFireAuth()]
	})
	.use(Quasar, quasarUserOptions)
	.use(createPinia())
	.use(router)
	.mount('#app')
