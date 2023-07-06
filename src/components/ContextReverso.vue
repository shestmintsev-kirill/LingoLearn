<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
	>
		<q-card class="q-dialog-plugin">
			<iframe
				:src="CRUrl"
				name="myFrame"
				width="100%"
				height="99%"
			/>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { useSpeakStore } from '@/store/speak'
import { useDialogPluginComponent } from 'quasar'
import { computed } from 'vue'

const { dialogRef, onDialogHide } = useDialogPluginComponent()
const speakStore = useSpeakStore()

const CRUrl = computed(() => `https://context.reverso.net/translation/${speakStore.currentLanguage === 'en' ? 'english' : 'italian'}-russian`)

defineEmits([...useDialogPluginComponent.emits])
</script>

<style lang="scss" scoped>
.q-dialog-plugin {
	height: 75%;
	width: 100%;
}
</style>
