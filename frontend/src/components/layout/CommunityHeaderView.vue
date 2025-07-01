<template>
	<!-- Sidebar -->
	<Sidebar v-model:isOpen="isSidebarOpen" />

	<div class="w-full sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
		<div class="mx-auto flex items-center justify-between py-2.5 px-4 md:px-6 lg:px-8 relative">
			<!-- Mobile Menu Button -->
			<button
			type="button"
			class="px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
			@click="toggleSidebar"
			>
				<span class="sr-only">Open sidebar</span>
				<svg
					class="h-6 w-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
			<!-- Tabs Centered -->
			<div class="flex-1 flex justify-center">
			<div class="flex space-x-4">
				<button
				v-for="tab in tabs"
				:key="tab"
				@click="activeTab = tab"
				:class="[
					'px-4 py-2 rounded transition',
					activeTab === tab
					? 'bg-blue-100 text-blue-600 font-semibold'
					: 'text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
				]"
				>
				{{ tab }}
				</button>
			</div>
			</div>
			<!-- Profile Dropdown Far Right -->
			<div class="flex items-center">
				<div class="relative">
					<button
					type="button"
					class="flex items-center rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
					@click="toggleProfile"
					>
						<span class="sr-only">Open user menu</span>
						<div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
							{{ userInitials }}
						</div>
					</button>
					
					<div
					v-if="isProfileOpen"
					class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu"
					>
						<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
							<p class="font-medium truncate" :title="currentUser?.name">{{ currentUser?.name }}</p>
							<p class="text-gray-500 dark:text-gray-400 truncate" :title="currentUser?.email">{{ currentUser?.email }}</p>
						</div>
						
						<div class="border-t border-gray-100 dark:border-gray-700"></div>
						<!-- Theme Toggle -->
						<button
						type="button"
						class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
						@click="toggleTheme"
						>
							<div class="flex items-center">
								<span class="mr-3 text-lg flex-shrink-0">{{ isDarkMode ? '🌞' : '🌙' }}</span>
								<span class="truncate">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
							</div>
						</button>

						<!-- Logout Button -->
						<button
						type="button"
						class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						@click="handleLogout"
						:disabled="isLoading"
						>
							<div class="flex items-center">
								<SignoutIcon />
								<span class="truncate">{{ isLoading ? 'Logging out...' : 'Sign out' }}</span>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="border-b dark:border-gray-700"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUser } from '@/composables/auth/useUser'
import { useLogin } from '@/composables/auth/useLogin'
import { useThemeStore } from '@/stores/theme'
import Sidebar from './Sidebar.vue'
import SignoutIcon from '@/components/icons/SignoutIcon.vue'

const themeStore = useThemeStore()

const tabs = ['Thread', 'Videos', 'News', 'Events']
const activeTab = ref(tabs[0])
const isSidebarOpen = ref(false)

// Profile dropdown logic
const isProfileOpen = ref(false)
const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

// toggle Sidebar on mobile view
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// User info
const authStore = useAuthStore()
const { userInitials } = useUser()
const { handleLogout } = useLogin()
const currentUser = computed(() => authStore.currentUser)

// toggle darkmode
const isDarkMode = computed(() => themeStore.isDarkMode)
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// Computed Properties
const isLoading = computed(() => authStore.isLoading)
</script>