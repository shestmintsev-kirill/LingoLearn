import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { firebaseApp } from './firebase'
import { VueFire, VueFireAuth } from 'vuefire'

createApp(App)
	.use(VueFire, {
		firebaseApp,
		modules: [VueFireAuth()]
	})
	.use(Quasar, quasarUserOptions)
	.use(createPinia())
	.use(router)
	.mount('#app')