import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		component: () => import('@/App.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { path: '/' }
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
