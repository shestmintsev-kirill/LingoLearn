import { db } from '@/plugins/firebase'
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

export const useAuthStore = defineStore('auth', () => {
	const auth = useFirebaseAuth()
	const googleAuthProvider = new GoogleAuthProvider()
	const user = useCurrentUser()

	// state
	// state

	// getters
	// getters

	// actions
	const sighWithGoogle = async () => {
		await signInWithRedirect(auth, googleAuthProvider)
	}
	const logout = async () => {
		await signOut(auth)
	}
	const createUserCollection = async () => {
		const querySnapshot = await getDocs(collection(db, user.value.email))
		if (querySnapshot.size < 1) {
			await setDoc(doc(db, 'settings', user.value.email), {
				lang: 'en',
				currentVoice: null,
				pitch: 1,
				rate: 1
			})
			await addDoc(collection(db, user.value.email), {
				date: new Date().toISOString(),
				example: 'You start from your first word',
				level: 1,
				translate: 'Ваше первое слово',
				word: 'Your first word'
			})
		}
	}
	// actions

	return {
		user,
		createUserCollection,
		sighWithGoogle,
		logout
	}
})
