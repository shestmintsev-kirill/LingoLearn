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
					:rules="[(val) => cardsStore.cards.find((card) => card.word !== val) || 'Word already exists']"
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
import { defineEmits, defineProps, onMounted, ref } from 'vue'
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

onMounted(() => {
	if (props.card) {
		const { word, translate, example } = props.card
		form.value = { word, translate, example }
	}
})

const onSubmit = async () => {
	if (cardsStore.cards.find((card) => card.word === form.value.word)) {
		$q.notify({
			message: 'Card exists',
			color: 'error',
			position: 'bottom-right'
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
