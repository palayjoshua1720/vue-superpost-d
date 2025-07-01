<template>
    <section id="wrapper" class="login-register login-sidebar">
        <!-- Community Header Tabs -->
        <div id="layoutSidenav">
            <div id="layoutSidenav_content">
                <main>
                    <!-- Feed -->
                    <form id="post-dashboard" @submit.prevent>
                        <div class="container-fluid px-4 tab-content">
                            <div id="dashboard" class="container-fluid tab-pane active">
                                <!-- Newsfeed -->
                                <div class="container mb-5">
                                    <div class="d-flex justify-content-center row">
                                        <div class="col-md-8">
                                            <div class="feed p-2">
                                                <!-- What's on your mind -->
                                                <div class="d-flex flex-row justify-content-between align-items-center p-2 border">
                                                    <div class="feed-text py-2">
                                                        <h6 class="text-black-50">What's on your mind</h6>
                                                    </div>
                                                    <div class="feed-icon px-2">
                                                        <i class="fa fa-long-arrow-up text-black-50"></i>
                                                    </div>
                                                </div>
                                                <!-- Feed Post 1 -->
                                                <div class="border mt-2" v-for="(post, i) in posts" :key="i">
                                                    <div>
                                                        <div class="flex items-start justify-between p-2 border-b">
                                                            <!-- Left: Avatar and Name/Time -->
                                                            <div class="flex items-start">
                                                                <img class="rounded-full" :src="post.avatar" width="45" height="45" />
                                                                <div class="flex flex-col ml-2">
                                                                    <span class="font-bold leading-tight">{{ post.author }}</span>
                                                                    <span class="text-gray-400 text-xs mt-0.5">{{ post.time }}</span>
                                                                </div>
                                                            </div>
                                                            <!-- Right: 3 Dots Dropdown -->
                                                            <div class="feed-icon px-2 flex-shrink-0" v-if="post.menu">
                                                                <div class="relative" @click.stop="toggleDropdown(i)">
                                                                    <button type="button" class="mt-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                                                                        <DropdownIcon class="text-gray-500" />
                                                                    </button>
                                                                    <div
                                                                        v-if="dropdownOpen === i"
                                                                        class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10"
                                                                    >
                                                                        <ul class="py-1">
                                                                            <li>
                                                                                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hide Post</a>
                                                                            </li>
                                                                            <li>
                                                                                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Report Post</a>
                                                                            </li>
                                                                            <li>
                                                                                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Copy Link Address</a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="feed-icon px-2 flex-shrink-0" v-else>
                                                                <button type="button" class="mt-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                                                                    <DropdownIcon class="text-gray-500" />
                                                                </button>
                                                                <div
                                                                    v-if="dropdownOpen === i"
                                                                    class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10"
                                                                >
                                                                    <ul class="py-1">
                                                                        <li>
                                                                            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hide Post</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Report Post</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Copy Link Address</a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-if="post.content" class="py-5 px-3">
                                                        <span>{{ post.content }}</span>
                                                    </div>
                                                    <div v-if="post.image" class="feed-image py-5 px-3">
                                                        <img class="img-fluid img-responsive" :src="post.image" />
                                                    </div>

                                                    <div class="border-t border-gray-100 dark:border-gray-700"></div>
                                                    <div class="flex justify-center gap-3 socials">
                                                        <button class="btn flex items-center gap-1 size-full" title="Like">
                                                            <LikeIcon />
                                                            <span class="sr-only">Like</span>
                                                        </button>
                                                        <button class="btn flex items-center gap-1 size-full" title="Comment">
                                                            <CommentIcon />
                                                            <span class="sr-only">Comment</span>
                                                        </button>
                                                        <button class="btn flex items-center gap-1 size-full" title="Share">
                                                            <ShareIcon />
                                                            <span class="sr-only">Share</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <!-- End Feed Post -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- You can add Manage Users and Manage Posts sections here as separate components or tabs -->
                        </div>
                    </form>
                </main>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUser } from '@/composables/auth/useUser'
import LikeIcon from '@/components/icons/communityIcons/LikeIcon.vue'
import CommentIcon from '@/components/icons/communityIcons/CommentIcon.vue'
import ShareIcon from '@/components/icons/communityIcons/ShareIcon.vue'
import DropdownIcon from '@/components/icons/communityIcons/DropdownIcon.vue'

const { userInitials, currentUser } = useUser()

const username = ref('Guest')

// Example posts data
const posts = ref([
    {
        author: currentUser.value?.name || 'Guest',
        avatar: 'https://i.imgur.com/aoKusnD.jpg',
        time: '40 minutes ago',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        menu: true,
    },
    {
        author: currentUser.value?.name || 'Guest',
        avatar: 'https://i.imgur.com/aoKusnD.jpg',
        time: '40 minutes ago',
        image: 'https://i.imgur.com/aoKusnD.jpg',
        menu: false,
    },
])

const dropdownOpen = ref<number | null>(null)

function toggleDropdown(index: number) {
    dropdownOpen.value = dropdownOpen.value === index ? null : index
}
</script>

<style scoped>
/* Add your styles here or import Bootstrap if needed */
</style>