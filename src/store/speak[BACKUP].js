import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuthStore } from './auth'
import { useAppStore } from './app'

export const useSpeakStore = defineStore('speak', () => {
	const appStore = useAppStore()

	const voices = ref([])
	const pitch = ref(1)
	const rate = ref(1)
	const speechSynthesis = window.speechSynthesis
	const currentVoice = ref(null)
	const userRef = ref(null)

	const getPreparedVoices = computed(() =>
		voices.value.map((voice, index) => ({
			...voice,
			label: `${voice.name} (${voice.lang})`,
			index
		}))
	)

	const initUserSettings = async () => {
		const authStore = useAuthStore()
		userRef.value = doc(db, 'settings', authStore.user.email)
		const userSnap = await getDoc(userRef.value)
		const { rate: userRate, currentVoice: userCurrentVoice, pitch: userPitch } = userSnap.data()
		currentVoice.value = userCurrentVoice
		rate.value = userRate
		pitch.value = userPitch
	}

	const saveUserSettings = async () => {
		await updateDoc(userRef.value, {
			pitch: pitch.value,
			rate: rate.value,
			currentVoice: currentVoice.value
		})
	}

	const setSpeechSynthesis = () => {
		// voices.value = speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en'))
		// if (!voices.value.length) {
			setTimeout(() => {
				voices.value = speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en'))
				if (!currentVoice.value) {
					currentVoice.value = getPreparedVoices.value.at(-1)
				}
				setTimeout(() => {
					if (appStore.userBrowser === 'safari') speak(' ') // for iOS safari init TODO not work
				}, 100)
			})
		// }
	}

	const speak = (text) => {
		if (speechSynthesis.speaking) {
			console.log('Text speaking available')
			return
		}

		// if (text?.length) {
		const ssUtterance = new SpeechSynthesisUtterance(text)
		ssUtterance.voice = voices.value[currentVoice.value?.index]
		ssUtterance.pitch = pitch.value
		ssUtterance.rate = rate.value
		speechSynthesis.speak(ssUtterance)
		// }
	}

	const stopSpeak = () => {
		speechSynthesis.cancel()
	}

	return {
		voices,
		pitch,
		rate,
		currentVoice,
		getPreparedVoices,
		initUserSettings,
		saveUserSettings,
		setSpeechSynthesis,
		speak,
		stopSpeak
	}
})
