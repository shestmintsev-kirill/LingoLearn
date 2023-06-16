<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
	>
		<q-card class="q-dialog-plugin">
			<iframe
				src="https://context.reverso.net"
				name="myFrame"
				width="100%"
				height="99%"
			/>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { defineEmits } from 'vue'

const { dialogRef, onDialogHide } = useDialogPluginComponent()

defineEmits([...useDialogPluginComponent.emits])
</script>

<style lang="scss" scoped>
.q-dialog-plugin {
	height: 75%;
	width: 100%;
}
</style>
