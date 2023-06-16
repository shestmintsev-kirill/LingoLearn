import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { useFirestore } from 'vuefire'
import { firebaseConfig } from '../dbConfig'


// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const db = useFirestore()
getAnalytics(firebaseApp)
