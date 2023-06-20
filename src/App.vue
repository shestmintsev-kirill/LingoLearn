<template>
	<q-layout view="lHh Lpr lFf">
		<q-page-container class="light-blue-1">
			<appView v-if="authStore.user" />
			<Login v-else-if="authStore.user === null" />
		</q-page-container>
	</q-layout>
</template>

<script setup>
import { useAuthStore } from './store/auth'
import Login from './views/Login.vue'
import appView from './views/appView.vue'

const authStore = useAuthStore()
</script>
