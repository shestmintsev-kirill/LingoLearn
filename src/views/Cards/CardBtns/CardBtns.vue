<template>
	<div class="row justify-between q-mt-md">
		<q-btn
			:key="index"
			v-for="(btn, index) in cardActions"
			round
			size="lg"
			:color="btn.color"
			:icon="btn.icon"
			@click="btn.handler"
		/>
	</div>
</template>

<script setup>
import { useCardsStore } from '@/stores/cards'

const emits = defineEmits(['deleteHandler', 'editAction'])
const props = defineProps({
	card: { type: Object, default: () => ({}) }
})

const cardsStore = useCardsStore()

const cardActions = [
	{ icon: 'add', color: 'blue-5', handler: () => cardsStore.showAddingCardDialog() },
	{ icon: 'edit', color: 'green-5', handler: () => cardsStore.showAddingCardDialog(props.card, (card) => emits('editAction', card)) },
	{ icon: 'restart_alt', color: 'orange-5', handler: () => cardsStore.refreshCard(props.card.id) },
	{
		icon: 'delete',
		color: 'red-5',
		handler: () => cardsStore.deleteCard(props.card.id, true, () => emits('deleteHandler', props.card.id))
	}
]
</script>

<style lang="scss" scoped></style>
