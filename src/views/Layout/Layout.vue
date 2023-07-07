<template>
	<q-page
		v-show="!loading"
		padding
	>
		<transition :name="tabsStore.currentAnimationName">
			<component :is="currentComponent" />
		</transition>
	</q-page>
	<q-page-sticky
		expand
		position="bottom"
	>
		<div class="full-width">
			<q-tabs
				:model-value="tabsStore.tab"
				dense
				class="bg-grey-1 text-grey-7 shadow-2 top-index"
				align="justify"
				indicator-color="transparent"
				active-color="black"
				@update:model-value="(tab) => tabsStore.setTab(tab)"
			>
				<q-tab
					:disable="!cardsStore.getToLearnCards.length"
					class="q-pa-md"
					name="Cards"
					icon="school"
				>
					<q-badge
						v-if="cardsStore.getToLearnCards.length"
						class="q-mb-lg"
						color="green"
						floating
						rounded
					>
						{{ cardsStore.getToLearnCards.length }}
					</q-badge>
				</q-tab>
				<q-tab
					class="q-pa-md"
					name="Home"
					icon="home"
				/>
				<q-tab
					class="q-pa-md"
					name="Settings"
					icon="settings"
				/>
			</q-tabs>
		</div>
	</q-page-sticky>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useSpeakStore } from '@/stores/speak'
import { useTabsStore } from '@/stores/tabs'
import { useCardsStore } from '@/stores/cards'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

const $q = useQuasar()

const speakStore = useSpeakStore()
const tabsStore = useTabsStore()
const cardsStore = useCardsStore()
const authStore = useAuthStore()

const loading = ref(true)

const currentComponent = computed(() => {
	const componentName = tabsStore.tab
	return defineAsyncComponent(() => import(`@/views/${componentName}/${componentName}`))
})

onMounted(() => {
	initialAppHandler()
})

const initialAppHandler = async () => {
	$q.loading.show()
	await authStore.createUserCollection()
	await speakStore.initUserSettings()
	speakStore.setSpeechSynthesis()
	$q.loading.hide()
	loading.value = false
}
</script>
