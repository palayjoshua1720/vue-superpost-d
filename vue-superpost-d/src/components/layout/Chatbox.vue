<template>
	<div
	class="fixed bottom-0 right-4 z-50 flex items-end space-x-2"
	:class="{
		'flex-col items-end space-x-0 space-y-2': isMobile,
		'flex-row items-end space-x-2 space-y-0': !isMobile
	}"
	>
		<!-- Desktop: Multiple chatboxes and chat list side by side -->
		<template v-if="!isMobile">
			<div
			v-for="conv in openConversations"
			:key="conv.id"
			class="w-80 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg flex flex-col"
			style="height: 400px;"
			>
				<div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-primary text-white rounded-t-lg">
					<span class="font-semibold">{{ conv.name }}</span>
					<button class="text-white" @click="closeConversation(conv.id)">&times;</button>
				</div>
				<div class="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
					<div
					v-for="(msg, idx) in conv.messages"
					:key="idx"
					:class="msg.fromMe ? 'text-right' : 'text-left'"
					>
					<span
						:class="msg.fromMe ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'"
						class="inline-block px-3 py-1 rounded mb-1 max-w-[70%] break-words"
					>{{ msg.text }}</span>
					</div>
				</div>
				<form @submit.prevent="sendMessage(conv)" class="flex p-2 border-t border-gray-200 dark:border-gray-700">
					<input
					v-model="chatInputs[conv.id]"
					type="text"
					class="flex-1 input input-bordered rounded-l"
					placeholder="Type a message..."
					/>
					<button type="submit" class="btn btn-primary rounded-r">Send</button>
				</form>
			</div>
			<!-- Chat Bar (list of conversations) -->
			<div class="bg-white dark:bg-gray-800 rounded-t-lg shadow-lg w-64">
			<div
				class="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold cursor-pointer select-none flex items-center justify-between"
				@click="toggleChatList"
			>
				<span>Chats ({{ conversations.length }})</span>
				<svg :class="{'transform rotate-90': showChatList}" class="w-4 h-4 ml-2 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</div>
			<transition name="fade">
				<div v-show="showChatList">
				<button
					v-for="conv in conversations"
					:key="conv.id"
					class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
					@click="openConversation(conv)"
				>
					<span class="font-medium">{{ conv.name }}</span>
					<span
					v-if="conv.messages.length"
					class="ml-2 text-xs text-gray-400 truncate inline-block max-w-[120px] align-middle"
					>
					<template v-if="conv.messages[conv.messages.length - 1].fromMe">
						You: {{ conv.messages[conv.messages.length - 1].text }}
					</template>
					<template v-else>
						{{ conv.messages[conv.messages.length - 1].text }}
					</template>
					</span>
				</button>
				<div v-if="!conversations.length" class="p-4 text-gray-400 text-center">No conversations</div>
				</div>
			</transition>
			</div>
		</template>
		<!-- Mobile: Only one chatbox at a time, chatbox overlaps chat list -->
		<template v-else>
			<div class="bg-white dark:bg-gray-800 rounded-t-lg shadow-lg w-64 mb-2 relative z-10">
				<div
					class="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold cursor-pointer select-none flex items-center justify-between"
					@click="toggleChatList"
				>
					<span>Chats {{ conversations.length }}</span>
					<svg :class="{'transform rotate-90': showChatList}" class="w-4 h-4 ml-2 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</div>
				<transition name="fade">
					<div v-show="showChatList">
					<button
						v-for="conv in conversations"
						:key="conv.id"
						class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
						@click="openConversation(conv)"
					>
						<span class="font-medium">{{ conv.name }}</span>
						<span v-if="conv.messages.length" class="ml-2 text-xs text-gray-400">({{ conv.messages.length }})</span>
					</button>
					<div v-if="!conversations.length" class="p-4 text-gray-400 text-center">No conversations</div>
					</div>
				</transition>
				<!-- Overlapping Chatbox -->
				<div
					v-if="openConversations.length"
					class="absolute bottom-full right-0 w-80 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg flex flex-col mb-2 z-20"
					style="height: 400px;"
				>
					<div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-primary text-white rounded-t-lg">
						<span class="font-semibold">{{ openConversations[0].name }}</span>
						<button class="text-white" @click="closeConversation(openConversations[0].id)">&times;</button>
					</div>
					<div class="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
						<div
							v-for="(msg, idx) in openConversations[0].messages"
							:key="idx"
							:class="msg.fromMe ? 'text-right' : 'text-left'"
						>
							<span
							:class="msg.fromMe ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'"
							class="inline-block px-3 py-1 rounded mb-1 max-w-[70%] break-words"
							>{{ msg.text }}</span>
						</div>
					</div>
					<form @submit.prevent="sendMessage(openConversations[0])" class="flex p-2 border-t border-gray-200 dark:border-gray-700">
						<input
							v-model="chatInputs[openConversations[0].id]"
							type="text"
							class="flex-1 input input-bordered rounded-l"
							placeholder="Type a message..."
						/>
						<button type="submit" class="btn btn-primary rounded-r">Send</button>
					</form>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const conversations = ref([
	{
		id: 1,
		name: 'John Doe',
		messages: [
			{ text: 'Hello!', fromMe: false },
			{ text: 'Hi there!', fromMe: true }
		]
	},
	{
		id: 2,
		name: 'Jane Smith',
		messages: [
			{ text: 'How are you?', fromMe: false }
		]
	}
])
const openConversations = ref<any[]>([])
const chatInputs = ref<{ [key: number]: string }>({})
const showChatList = ref(false)
const isMobile = ref(false)

function checkMobile() {
	isMobile.value = window.innerWidth < 768
}
onMounted(() => {
	checkMobile()
	window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
	window.removeEventListener('resize', checkMobile)
})

function toggleChatList() {
	showChatList.value = !showChatList.value
}

function openConversation(conv: any) {
	if (isMobile.value) {
		openConversations.value = [conv] // Only one at a time on mobile
	} else if (!openConversations.value.find(c => c.id === conv.id)) {
		openConversations.value.push(conv)
	}
	chatInputs.value[conv.id] = ''
	showChatList.value = false
}

function closeConversation(convId: number) {
	openConversations.value = openConversations.value.filter(c => c.id !== convId)
}

function sendMessage(conv: any) {
	const input = chatInputs.value[conv.id]
		if (input && input.trim()) {
		conv.messages.push({
			text: input,
			fromMe: true
		})
		chatInputs.value[conv.id] = ''
	}
}
</script>

<style scoped>
	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.2s;
	}
	.fade-enter-from, .fade-leave-to {
		opacity: 0;
	}
</style>