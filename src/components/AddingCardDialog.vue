<template>
	<q-dialog
		ref="dialogRef"
		persistent
		@hide="onDialogHide"
	>
		<q-card class="q-dialog-plugin">
			<div class="flex justify-end bg-grey-4">
				<q-btn
					dense
					rounded
					unelevated
					@click="onDialogHide"
				>
					<q-icon
						name="close"
						size="sm"
					/>
				</q-btn>
			</div>
			<q-separator />
			<q-form
				class="q-gutter-xs q-px-lg q-pb-md q-pt-md"
				@submit="onSubmit"
				@reset="onReset"
			>
				<q-input
					v-model="form.word"
					autogrow
					autocapitalize="off"
					filled
					label="Your new word *"
					lazy-rules
					:rules="rules.word"
				>
					<template
						v-slot:append
						v-if="clipboardIsSupported"
					>
						<q-btn
							round
							dense
							:disable="!form.word?.length"
							flat
							icon="content_copy"
							@click="copyWordValue"
						/>
					</template>
					<template
						v-slot:prepend
						v-if="speechRecognitionIsSupported"
					>
						<q-btn
							round
							dense
							:disable="sourceRecognition ? sourceRecognition !== 'word' : false"
							:flat="!(isListening && sourceRecognition === 'word')"
							:color="isListening && sourceRecognition === 'word' ? 'red' : 'grey-7'"
							icon="mic"
							@click="speechRecognitionHandler('word')"
						/>
					</template>
				</q-input>
				<!-- TODO Improve rule performance -->

				<q-input
					v-model="form.translate"
					autogrow
					autocapitalize="off"
					filled
					label="Translate for word *"
					lazy-rules
					:rules="[(val) => (val && val.length > 0) || 'Please type something']"
				/>

				<q-input
					v-model="form.example"
					autogrow
					autocapitalize="off"
					filled
					label="Your example"
				>
					<template
						v-slot:prepend
						v-if="speechRecognitionIsSupported"
					>
						<q-btn
							round
							dense
							:disable="sourceRecognition ? sourceRecognition !== 'example' : false"
							:flat="!(isListening && sourceRecognition === 'example')"
							:color="isListening && sourceRecognition === 'example' ? 'red' : 'grey-7'"
							icon="mic"
							@click="speechRecognitionHandler('example')"
						/>
					</template>
				</q-input>

				<div class="q-mt-md row justify-around">
					<q-btn
						color="primary"
						icon="translate"
						label="CR"
						@click="showContext"
					/>
					<q-btn
						label="Reset"
						type="reset"
						color="primary"
						flat
						class="q-ml-sm"
					/>
					<q-btn
						:disable="isSaveDisabled"
						label="Save"
						type="submit"
						color="primary"
						icon="save"
					/>
				</div>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'
import ContextIframe from './ContextReverso.vue'
import { useQuasar } from 'quasar'
import { useCardsStore } from '@/stores/cards'
import { useClipboard, useSpeechRecognition } from '@vueuse/core'
import { useAppStore } from '@/stores/app'

defineEmits([...useDialogPluginComponent.emits])
const props = defineProps({
	card: [Object, null],
	default: () => ({})
})

const $q = useQuasar()
const appStore = useAppStore()
const cardsStore = useCardsStore()
const { dialogRef, onDialogHide } = useDialogPluginComponent()
const {
	isSupported,
	isListening,
	result: speechResult,
	start: startRecognition,
	stop: stopRecognition
} = useSpeechRecognition({ land: 'en-US', continuous: true, interimResults: true })

let speechTimeout

const form = ref({
	word: '',
	translate: '',
	example: ''
})
const sourceRecognition = ref('')
const { copy, isSupported: clipboardIsSupported } = useClipboard({ source: form.value.word })

const speechRecognitionIsSupported = computed(() => {
	return isSupported.value && !appStore.isPwa && !appStore.isMobileDevice // isPwa, isMobileDevice because of nowadays iOS PWA don't support permissions allow
})
const rules = computed(() => {
	return {
		word: [
			(val) => {
				const isExistWord = cardsStore.cards.find((card) => card.word?.toLowerCase() === val?.toLowerCase())
				const isTheSameWord = form.value.word?.toLowerCase() === val?.toLowerCase()
				return (isEditMode.value ? (!isExistWord || isTheSameWord) : !isExistWord) || 'Word already exists'
			}
		]
	}
})
const isEditMode = computed(() => !!props.card && Object.keys(props.card).length)
const isSaveDisabled = computed(() => {
	if (!isEditMode.value) return false
	const { word, translate, example } = props.card
	const initCard = { word, translate, example }
	return JSON.stringify(form.value).split('').sort().join() === JSON.stringify(initCard).split('').sort().join()
	// TODO вынести в helper
})

watch(speechResult, (result) => {
	form.value[sourceRecognition.value] = result

	clearTimeout(speechTimeout)
	speechTimeout = setTimeout(() => {
		stopRecognition()
		sourceRecognition.value = ''
	}, 2500)
})

onMounted(() => {
	if (isEditMode.value) {
		const { word, translate, example } = props.card
		form.value = { word, translate, example }
	}
})

const speechRecognitionHandler = (sourceName) => {
	if (isListening.value) {
		stopRecognition()
		sourceRecognition.value = ''
	} else {
		sourceRecognition.value = sourceName
		startRecognition()
	}
}

const copyWordValue = () => {
	copy(form.value.word)
	$q.notify({
		message: 'Copied!',
		color: 'secondary',
		position: 'top'
	})
}

const onSubmit = async () => {
	if (isEditMode.value) await cardsStore.updateCard(props.card.id, form.value)
	else await cardsStore.addNewWord(form.value)
	onDialogHide()
}

const onReset = () => {
	form.value = {
		word: '',
		translate: '',
		example: ''
	}
}

const showContext = () => {
	$q.dialog({
		component: ContextIframe
	})
}
</script>

<style lang="scss" scoped></style>
