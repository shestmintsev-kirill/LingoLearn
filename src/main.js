import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { firebaseApp } from './firebase'
import { VueFire, VueFireAuth } from 'vuefire'
import './styles/main.scss'

if (window.screen.orientation && window.screen.orientation.lock) {
	window.screen.orientation
		.lock('portrait')
		.then(() => {
			console.log('Screen orientation locked to portrait')
		})
		.catch((error) => {
			console.error('Failed to lock screen orientation:', error)
		})
} // TODO send to plugins/helpers

createApp(App)
	.use(VueFire, {
		firebaseApp,
		modules: [VueFireAuth()]
	})
	.use(Quasar, quasarUserOptions)
	.use(createPinia())
	.use(router)
	.mount('#app')
