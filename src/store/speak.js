import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useSpeakStore = defineStore('speak', {
	state: () => ({
		voices: [],
		pitch: 1,
		rate: 1,
		speechSynthesis: window.speechSynthesis,
		currentVoice: null,
		userRef: null
	}),
	getters: {
		getPreparedVoices: (state) => state.voices.map((voice, index) => ({ ...voice, label: `${voice.name} (${voice.lang})`, index }))
	},
	actions: {
		async initUserSettings() {
			const authStore = useAuthStore()
			const userRef = doc(db, 'settings', authStore.user.email)
			this.userRef = userRef
			const userSnap = await getDoc(userRef)
			const { rate, currentVoice, pitch } = userSnap.data()
			this.currentVoice = currentVoice
			this.rate = rate
			this.pitch = pitch
		},
		async saveUserSettings() {
			await updateDoc(this.userRef, {
				pitch: this.pitch,
				rate: this.rate,
				currentVoice: this.currentVoice
			})
		},
		setSpeechSynthesis() {
			this.voices = speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en'))
			if (!this.voices.length) {
				setTimeout(() => {
					this.voices = speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en'))
					if (!this.currentVoice) {
						this.currentVoice = this.getPreparedVoices.at(-1)
					}
				}, 100)
			}
		},
		speak(text) {
			if (this.speechSynthesis.speaking) {
				console.log('text speaking available')
				return
			}

			if (text?.length) {
				const ssUtterance = new SpeechSynthesisUtterance(text)
				ssUtterance.voice = this.voices[this.currentVoice?.index]
				ssUtterance.pitch = this.pitch
				ssUtterance.rate = this.rate
				this.speechSynthesis.speak(ssUtterance)
			}
		},
		stopSpeck() {
			this.speechSynthesis.cancel()
		}
	}
})
