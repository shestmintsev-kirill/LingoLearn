import { db } from '@/plugins/firebase'
import snackBar from '@/services/snackBar'
import { GoogleAuthProvider, signOut, signInWithPopup } from 'firebase/auth'
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
		await signInWithPopup(auth, googleAuthProvider)
	}
	const logout = async () => {
		try {
			// [useAppStore(), useCardsStore(), useSpeakStore(), useTabsStore()].forEach(store => store.$reset())
			await signOut(auth)
			location.reload()
		} catch (error) {
			console.warn(error)
			snackBar.error('Something went wrong')
		}
	}
	const createUserCollection = async () => {
		const querySnapshot = await getDocs(collection(db, user.value.email))
		if (querySnapshot.size < 1) {
			await setDoc(doc(db, 'settings', user.value.email), {
				lang: 'en',
				currentVoice: null,
				pitch: 1,
				rate: 1,
				withShuffle: true
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
