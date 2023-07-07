<template>
	<q-card
		class="my-card bg-grey-1 flex justify-center"
		style="height: calc(100vh - 180px)"
		@click="cardClickHandler"
		@touchmove="cardClickHandler"
	>
		<q-card-section class="flex column items-center justify-center">
			<div class="row items-center no-wrap">
				<q-btn
					v-if="!!card?.word && (cardIsExistInSecondStep(card.id) ? isFirstShow : !isFirstShow)"
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
						v-if="isBlurCard && !cardIsExistInSecondStep(card.id)"
						class="absolute-center z-top"
						name="visibility"
						color="grey-7"
						size="32px"
						@click.stop="toVisible"
					/>
					<span :class="{ blur: isBlurCard && !cardIsExistInSecondStep(card.id) }">
						{{
							isFirstShow ? card?.[cardIsExistInSecondStep(card.id) ? 'word' : 'translate']
								?? 'Empty' : card?.[cardIsExistInSecondStep(card.id) ? 'translate' : 'word']
								?? 'Empty'
						}}
					</span>
				</div>
			</div>
			<div
				v-if="!!card?.example && (cardIsExistInSecondStep(card.id) ? isFirstShow : !isFirstShow)"
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
import { computed, ref } from 'vue'

const emits = defineEmits(['clickHandler'])
const props = defineProps({
	card: { type: Object, default: () => ({}) },
	isFirstShow: { type: Boolean, default: false },
	cardIsExistInSecondStep: { type: Function, default: () => false }
})

const speakStore = useSpeakStore()

const visibleState = ref(false)

const isBlurCard = computed(() => !props.isFirstShow && props.card?.level > 3 && visibleState.value)

const toVisible = () => {
	visibleState.value = false
}
const cardClickHandler = () => {
	visibleState.value = true
	emits('clickHandler')
}
</script>
<style lang="scss" scoped></style>
