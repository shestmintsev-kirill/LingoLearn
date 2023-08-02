<template>
	<q-card
		class="my-card bg-grey-1 flex justify-center"
		style="height: calc(100svh - 180px)"
		@click="cardClickHandler"
		@touchmove="cardClickHandler"
	>
		<q-card-section class="flex column items-center justify-center">
			<div class="row items-center no-wrap">
				<q-btn
					v-show="!!card?.word && currentStateOfCard === 'word'"
					class="speakBtn"
					flat
					round
					@click.stop="speakStore.speak(card.word)"
				>
					<q-icon
						:name="speakStore.isSpeaking && speakStore.speakingText === card.word ? 'stop_circle' : 'play_arrow'"
						:color="speakStore.isSpeaking && speakStore.speakingText === card.word ? 'red' : 'green'"
						size="32px"
					/>
				</q-btn>
				<div class="text-h6 relative-position text-center">
					<q-icon
						v-if="isBlurCard"
						class="absolute-center z-top"
						name="visibility"
						color="grey-7"
						size="32px"
						@click.stop="toVisible"
					/>
					<span :class="{ blur: isBlurCard }">
						{{ card[currentStateOfCard] }}
					</span>
				</div>
			</div>
			<div
				v-if="!!card?.example && currentStateOfCard === 'word'"
				class="row q-mt-md items-center no-wrap"
			>
				<q-btn
					flat
					round
					@click.stop="speakStore.speak(card.example)"
				>
					<q-icon
						:name="speakStore.isSpeaking && speakStore.speakingText === card.example ? 'stop_circle' : 'play_arrow'"
						:color="speakStore.isSpeaking && speakStore.speakingText === card.example ? 'red' : 'green'"
						size="24px"
					/>
				</q-btn>
				<div
					class="text-subtitle2"
					:class="{ blur: isBlurCard }"
				>
					{{ card.example }}
				</div>
			</div>
		</q-card-section>
	</q-card>
</template>
<script setup>
import { useSpeakStore } from '@/stores/speak'
import { computed, nextTick, onMounted, ref } from 'vue'

const emits = defineEmits(['clickHandler'])
const props = defineProps({
	card: { type: Object, default: () => ({}) },
	isSecondShowing: { type: Boolean, default: false },
	cardIsExistInSecondStep: { type: Function, default: () => false }
})

const speakStore = useSpeakStore()

const visibleState = ref(true)

const isBlurCard = computed(() => currentStateOfCard.value === 'word' && props.card?.level > 4 && visibleState.value && !props.isSecondShowing)
const currentStateOfCard = computed(() => {
	// First showing and new card
	if (!props.isSecondShowing && !props.cardIsExistInSecondStep(props.card.id)) return props.card.isTranslateShow ? 'translate' : 'word'
	// First showing and card in second step
	if (!props.isSecondShowing && props.cardIsExistInSecondStep(props.card.id)) return props.card.firstWasTranslate ? 'word' : 'translate'
	// Second showing and new card
	if (props.isSecondShowing && !props.cardIsExistInSecondStep(props.card.id)) return props.card.isTranslateShow ? 'word' : 'translate'
	// Second showing and card in second step
	if (props.isSecondShowing && props.cardIsExistInSecondStep(props.card.id)) return props.card.firstWasTranslate ? 'translate' : 'word'
	return console.warn("Card's state not found")
	// TODO to improve DevExp
})

onMounted(() => {
	nextTick(() => {
		if (currentStateOfCard.value === 'word') speakStore.speak(props.card.word)
	})
})

const toVisible = () => {
	visibleState.value = false
}
const cardClickHandler = () => {
	visibleState.value = true
	emits('clickHandler', currentStateOfCard)
}
</script>
<style lang="scss" scoped></style>
