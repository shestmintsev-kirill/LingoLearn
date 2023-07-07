import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { db } from '@/plugins/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuthStore } from './auth'
import { useSpeechSynthesis } from '@vueuse/core'
import { useAppStore } from './app'
import $snackBar from '@/services/snackBar'

export const useSpeakStore = defineStore('speak', () => {
	const appStore = useAppStore()

	const voices = ref([])
	const pitch = ref(1)
	const rate = ref(1)
	const speechSynthesis = window.speechSynthesis
	const currentVoice = ref(null)
	const userRef = ref(null)
	const speakingText = ref('')
	const currentLanguage = ref('en')

	const voicesAccordingByLang = computed(() => voices.value.filter((voice) => voice.lang.includes(currentLanguage.value)))
	const speech = useSpeechSynthesis(speakingText, {
		voice: computed(() => voicesAccordingByLang.value[currentVoice.value?.index])
	})

	const getPreparedVoices = computed(() =>
		voicesAccordingByLang.value.map((voice, index) => ({
			...voice,
			label: `${voice.name} (${voice.lang})`,
			index
		}))
	)
	const isSpeaking = computed(() => speech.isPlaying.value)

	const speak = (textToSpeak) => {
		if (isSpeaking.value && textToSpeak === speakingText.value) {
			stopSpeak()
			return
		}
		if (speech.status.value === 'pause') {
			speechSynthesis.resume()
		} else {
			speakingText.value = textToSpeak
			speech.speak()
		}
	}

	const pause = () => {
		speechSynthesis.pause()
	}

	const stopSpeak = () => {
		speech.stop()
	}

	const initUserSettings = async () => {
		const authStore = useAuthStore()
		userRef.value = doc(db, 'settings', authStore.user.email)
		const userSnap = await getDoc(userRef.value)
		const { rate: userRate, currentVoice: userCurrentVoice, pitch: userPitch, lang } = userSnap.data()
		currentVoice.value = userCurrentVoice
		rate.value = userRate
		pitch.value = userPitch
		currentLanguage.value = lang
	}

	const saveUserSettings = async () => {
		try {
			await updateDoc(userRef.value, {
				pitch: pitch.value,
				rate: rate.value,
				currentVoice: currentVoice.value,
				lang: currentLanguage.value
			})
			$snackBar.success('Saved!')
		} catch (error) {
			$snackBar.error('Some error')
			console.log(error)
		}
	}

	const setSpeechSynthesis = () => {
		// voices.value = speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en'))
		// if (!voices.value.length) {
		setTimeout(() => {
			// voices.value = speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en') || voice.lang.includes('it'))
			voices.value = speechSynthesis.getVoices()
			if (!currentVoice.value) {
				currentVoice.value = getPreparedVoices.value.at(-1)
			}
			setTimeout(() => {
				if (appStore.userBrowser === 'safari') speak(' ') // for iOS safari init TODO not work
			}, 100)
		})
		// }
	}

	watch(currentLanguage, () => {
		currentVoice.value = getPreparedVoices.value[0]
	})

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
		pause,
		stopSpeak,
		isSpeaking,
		speakingText,
		currentLanguage
	}
})
