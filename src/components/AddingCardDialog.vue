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
					filled
					label="Your new word *"
					lazy-rules
					:rules="rules.word"
				/>
				<!-- TODO Improve rule performance -->

				<q-input
					v-model="form.translate"
					filled
					label="Translate for word *"
					lazy-rules
					:rules="[(val) => (val && val.length > 0) || 'Please type something']"
				/>

				<q-input
					v-model="form.example"
					filled
					label="Your example"
				/>

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
import { computed, defineEmits, defineProps, onMounted, ref } from 'vue'
import ContextIframe from './ContextReverso.vue'
import { useQuasar } from 'quasar'
import { useCardsStore } from '@/store/cards'

defineEmits([...useDialogPluginComponent.emits])
const props = defineProps({
	card: [Object, null],
	default: () => ({})
})

const $q = useQuasar()
const cardsStore = useCardsStore()
const { dialogRef, onDialogHide } = useDialogPluginComponent()

const form = ref({
	word: '',
	translate: '',
	example: ''
})

const rules = computed(() => {
	return { word: [(val) => !cardsStore.cards.indexOf((card) => card.word.toLowerCase() === val.toLowerCase()) || 'Word already exists'] }
})
const isSaveDisabled = computed(() => {
	if (!props.card) return false
	const { word, translate, example } = props.card
	const initCard = { word, translate, example }
	return JSON.stringify(form.value).split('').sort().join() === JSON.stringify(initCard).split('').sort().join()
	// TODO вынести в helper
})

onMounted(() => {
	if (props.card) {
		const { word, translate, example } = props.card
		form.value = { word, translate, example }
	}
})

const onSubmit = async () => {
	if (cardsStore.cards.find((card) => card.word.toLowerCase() === form.value.word.toLowerCase())) {
		$q.notify({
			message: 'Card already exists',
			color: 'error',
			position: 'top'
		})
		return
	}
	if (props.card.id) await cardsStore.updateCard(props.card.id, form.value)
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
		.onOk(() => {
			console.log('OK')
		})
		.onCancel(() => {
			console.log('Cancel')
		})
		.onDismiss(() => {
			console.log('Called on OK or Cancel')
		})
}
</script>

<style lang="scss" scoped></style>
