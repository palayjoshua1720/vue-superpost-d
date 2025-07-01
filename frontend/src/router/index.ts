import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import CommunityFeedView from '@/views/CommunityFeedView.vue'
import SpeechAI from '@/views/SpeechAI.vue'
import AnimeView from '@/views/AnimeView.vue'
import MovieView from '@/views/MovieView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import AboutIcon from '@/components/icons/AboutIcon.vue'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'
import CommunityFeedIcon from '@/components/icons/communityIcons/CommunityFeedIcon.vue'
import AnimeIcon from '@/components/icons/AnimeIcon.vue'
import MovieIcon from '@/components/icons/MovieIcon.vue'
import AiIcon from '@/components/icons/AiIcon.vue'

// Types
interface NavigationItem {
	name: string
	to: string
	icon: any
}

interface RouteMeta {
	requiresAuth?: boolean
	title?: string
	icon?: any
}

// Route Configuration
const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: AppLayout,
		meta: { requiresAuth: true },
		children: [
			{
				path: '',
				name: 'home',
				component: HomeView,
				meta: {
					requiresAuth: true,
					title: 'Home',
					icon: HomeIcon
				}
			},
			// {
			// 	path: 'about',
			// 	name: 'about',
			// 	component: AboutView,
			// 	meta: {
			// 		requiresAuth: true,
			// 		title: 'About',
			// 		icon: AboutIcon
			// 	}
			// },
			{
				path: 'profile',
				name: 'profile',
				component: ProfileView,
				meta: {
					requiresAuth: true,
					title: 'Profile',
					icon: ProfileIcon
				}
			},
			{
				path: 'communityFeed',
				name: 'communityFeed',
				component: CommunityFeedView,
				meta: {
					requiresAuth: true,
					title: 'Community Feed',
					icon: CommunityFeedIcon
				}
			},
			{
				path: 'text-to-speech',
				name: 'text-to-speech',
				component: SpeechAI,
				meta: {
					requiresAuth: true,
					title: 'AI',
					icon: AiIcon
				}
			},
			{
				path: 'anime',
				name: 'anime',
				component: AnimeView,
				meta: {
					requiresAuth: true,
					title: 'Anime',
					icon: AnimeIcon
				}
			},
			{
				path: 'movie',
				name: 'movie',
				component: MovieView,
				meta: {
					requiresAuth: true,
					title: 'Movie',
					icon: MovieIcon
				}
			},
		]
	},
	{
		path: '/login',
		name: 'login',
		component: LoginView,
		meta: {
			requiresAuth: false,
			title: 'Login'
		}
	},
	{
		path: '/500',
		name: 'server-error',
		component: () => import('@/views/ServerErrorView.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: NotFoundView,
		meta: {
			requiresAuth: false,
			title: 'Not Found'
		}
	}
]

// Router Instance
const router = createRouter({
	history: createWebHistory(process.env.VUE_APP_BASE_URL),
	routes
})

// Navigation Helper
export const getNavigationItems = (routes: RouteRecordRaw[]): NavigationItem[] => {
	const layoutRoute = routes.find(route => route.path === '/')
	if (!layoutRoute?.children) return []

	return layoutRoute.children
	.filter(route => (route.meta as RouteMeta)?.requiresAuth && route.name !== 'not-found')
	.map(route => ({
		name: (route.meta as RouteMeta)?.title || String(route.name),
		to: `/${route.path}`,
		icon: (route.meta as RouteMeta)?.icon
	}))
}

// Navigation Guards
router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	// Check if route requires authentication
	if (requiresAuth) {
		// Check if user is authenticated
		const isAuthenticated = await authStore.checkAuth()

		if (!isAuthenticated) {
			// Redirect to login if not authenticated
			next({ name: 'login', query: { redirect: to.fullPath } })
			return
		}
	}

	// If user is authenticated and trying to access login page
	if (to.name === 'login' && authStore.isAuthenticated) {
	next({ name: 'home' })
	return
	}

	next()
})

export default router 