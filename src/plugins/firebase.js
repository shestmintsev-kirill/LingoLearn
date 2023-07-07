import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { useFirestore } from 'vuefire'

// Initialize Firebase
export const firebaseApp = initializeApp({
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	authDomain: 'english-app-pwa.firebaseapp.com',
	projectId: 'english-app-pwa',
	storageBucket: 'english-app-pwa.appspot.com',
	messagingSenderId: '915160404778',
	appId: '1:915160404778:web:6c457df086a6ff47204453',
	measurementId: 'G-DP2H1QVF54'
})
export const db = useFirestore()
getAnalytics(firebaseApp)
