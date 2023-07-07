<template>
	<q-card
		dark
		bordered
		class="bg-grey-1 shadow-2"
	>
		<q-card-section>
			<div
				class="text-h5 flex justify-center"
				:class="color"
			>
				{{ count }}
			</div>
		</q-card-section>

		<q-separator inset />

		<q-card-section
			class="flex justify-center"
			:class="color"
		>
			{{ label }}
		</q-card-section>
	</q-card>
</template>

<script setup>
defineProps({
	count: { type: Number, default: 0, required: true },
	label: { type: String, default: '', required: true },
	color: { type: String, default: 'primary', required: false }
})
</script>

<style lang="scss" scoped></style>
