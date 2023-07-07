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
import { useSpeakStore } from '@/stores/speak'

const emits = defineEmits(['deleteHandler'])
const props = defineProps({
	card: { type: Object, default: () => ({}) }
})

const cardsStore = useCardsStore()
const speakStore = useSpeakStore()

const cardActions = [
	{ icon: 'add', color: 'blue-5', handler: () => cardsStore.showAddingCardDialog() },
	{ icon: 'edit', color: 'green-5', handler: () => cardsStore.showAddingCardDialog(props.card) },
	{ icon: 'restart_alt', color: 'orange-5', handler: () => cardsStore.refreshCard(props.card.id) },
	{
		icon: 'delete',
		color: 'red-5',
		handler: () => {
			cardsStore.deleteCard(props.card.id, true, async () => {
				emits('deleteHandler')
				speakStore.speak(props.card?.word)
			})
		}
	}
]
</script>

<style lang="scss" scoped>

</style>