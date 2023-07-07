<template>
	<q-layout view="lHh Lpr lFf">
		<q-page-container class="light-blue-1">
			<appView v-if="authStore.user" />
			<Auth v-else-if="authStore.user === null" />
		</q-page-container>
	</q-layout>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Auth from './views/Auth.vue'
import appView from './views/appView.vue'
import useNetworkConnection from './hooks/useNetworkConnection.js'

useNetworkConnection()
const authStore = useAuthStore()
</script>
