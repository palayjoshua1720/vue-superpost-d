<template>
	<div class="flex h-[88vh] max-w-5xl mx-auto rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900">

		<!-- Sidebar -->
		<transition name="fade-in">
			<div v-if="messages.length">
				<aside class="w-64 min-w-[220px] bg-white/80 dark:bg-gray-900/80 border-r border-gray-200 dark:border-gray-800 flex flex-col p-0 md:p-0">
					<div class="flex flex-col items-center py-6 px-4 border-b border-gray-200 dark:border-gray-800">
						<div class="w-14 h-14 rounded-full flex items-center justify-center shadow mb-2
							bg-gradient-to-br from-blue-400 to-purple-400 dark:from-indigo-900 dark:to-purple-900">
							<!-- Loader Lightning Bolt Logo with AI Accent -->
							<svg viewBox="0 0 24 24" class="w-10 h-10" xmlns="http://www.w3.org/2000/svg">

								<!-- Background circle (optional if it's in a button/icon) -->
								<circle cx="12" cy="12" r="12" fill="url(#grad)" />

								<!-- Lightning Bolt: thinner stroke -->
								<path
								d="M13 2L3 14h7v8l10-12h-7z"
								stroke="white"
								stroke-width="1.8"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								/>

								<!-- Blue AI Spark -->
								<circle cx="17" cy="6" r="1" fill="#A5B4FC" />

								<!-- Tribute Dot (Paw/Heart) -->
								<circle cx="6.5" cy="17.5" r="0.8" fill="#F472B6" />

								<!-- Optional "G" integration as subtle shadow or background -->
								<path
								d="M9.5 10a2.5 2.5 0 1 1 2.5 2.5h-1"
								stroke="rgba(255,255,255,0.3)"
								stroke-width="1"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								/>

								<!-- Gradient for background -->
								<defs>
									<radialGradient id="grad" cx="50%" cy="50%" r="50%">
										<stop offset="0%" stop-color="#6D28D9" />
										<stop offset="100%" stop-color="#1E1B4B" />
									</radialGradient>
								</defs>
							</svg>
						</div>
						<div class="font-bold text-xl text-gray-800 dark:text-gray-100">Gappy</div>
						<div class="text-xs text-gray-500 dark:text-gray-400">Your AI Assistant</div>
					</div>

					<div class="flex-1 overflow-y-auto px-4 py-6">
						<div class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Sample Prompts</div>
						<ul class="space-y-2">
							<li class="bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 transition">How do I reset my password?</li>
							<li class="bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 transition">Tell me a joke</li>
							<li class="bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 transition">Summarize this article</li>
							<li class="bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 transition">What's the weather today?</li>
							<li class="bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 transition">Give me a productivity tip</li>
						</ul>
					</div>
				</aside>
			</div>
		</transition>

		<!-- Chat Area -->
		<main class="flex-1 flex flex-col">
			<!-- Header -->
			<div class="flex items-center gap-3 px-6 py-4 shadow bg-gradient-to-r from-blue-500 to-purple-500 dark:from-indigo-900 dark:to-purple-900">
				<div class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
					<!-- Loader Lightning Bolt Logo with AI Accent (same as sidebar) -->
					<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M13 2L3 14h7v8l10-12h-7z"
						:class="'stroke-gray-800 dark:stroke-white'"
						stroke-width="2.5"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- AI Accent: a small dot as an 'eye' -->
					<circle cx="15.5" cy="4.5" r="1.1" :class="'fill-blue-500 dark:fill-blue-300'" />
					</svg>
				</div>
				<div class="flex-1">
					<div class="font-bold text-lg tracking-wide text-white dark:text-gray-100">Gappy AI Assistant</div>
					<div class="text-xs opacity-80 text-white dark:text-gray-300">How can I help you today, Sir?</div>
				</div>
			</div>

			<!-- Chat area -->
			<div class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 dark:bg-gray-900/80 transition-colors duration-300" ref="chatContainer">
				<div v-if="messages.length">
					<div v-for="(msg, i) in messages" :key="i" class="flex items-end group py-3" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
						<div v-if="msg.role === 'assistant'" class="flex items-end gap-2">
							<div data-v-7f9e6556="" class="w-8 h-8 rounded-full flex items-center justify-center shadow mb-2 bg-gradient-to-br from-blue-400 to-purple-400 dark:from-indigo-900 dark:to-purple-900">
								<svg data-v-7f9e6556="" viewBox="0 0 24 24" class="w-10 h-10" xmlns="http://www.w3.org/2000/svg"><circle data-v-7f9e6556="" cx="12" cy="12" r="12" fill="url(#grad)"></circle><path data-v-7f9e6556="" d="M13 2L3 14h7v8l10-12h-7z" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><circle data-v-7f9e6556="" cx="17" cy="6" r="1" fill="#A5B4FC"></circle><circle data-v-7f9e6556="" cx="6.5" cy="17.5" r="0.8" fill="#F472B6"></circle><path data-v-7f9e6556="" d="M9.5 10a2.5 2.5 0 1 1 2.5 2.5h-1" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><defs data-v-7f9e6556=""><radialGradient data-v-7f9e6556="" id="grad" cx="50%" cy="50%" r="50%"><stop data-v-7f9e6556="" offset="0%" stop-color="#6D28D9"></stop><stop data-v-7f9e6556="" offset="100%" stop-color="#1E1B4B"></stop></radialGradient></defs>
								</svg>
							</div>
							<div class="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-2xl shadow-md max-w-[75%] animate-fade-in">
								<span v-html="msg.content.replace(/\n/g, '<br>')"></span>
							</div>
						</div>
						<div v-else class="flex items-end gap-2 flex-row-reverse">
							<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center shadow">
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path d="M6 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2" /></svg>
							</div>
							<div class="bg-blue-600/90 dark:bg-blue-700/90 text-white px-4 py-2 rounded-2xl shadow-md max-w-[75%] animate-fade-in">
								<span v-html="formatUserMessage(msg.content)"></span>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="flex items-center justify-center h-full w-full">
					<div class="text-gray-400 text-center text-lg font-medium select-none">
						Please enter your prompt below to start the conversation.
					</div>
				</div>
			</div>

			<!-- Prompt input at the bottom -->
			<form @submit.prevent="handleAsk" class="flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
				<input
					v-model="prompt"
					@keyup.enter="handleAsk"
					class="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-sm"
					placeholder="Type your message..."
					autocomplete="off"
				/>
				<!-- File upload input -->
				<label class="flex items-center cursor-pointer ml-2">
					<input type="file" accept=".docx,.txt,.csv,.xls,.xlsx,.pdf" class="hidden" @change="onFileChange" />
					<span class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
					</span>
				</label>
				<span v-if="fileName" class="ml-2">
					<span class="file-chip">
						{{ fileName }}
						<button type="button" class="remove-btn" @click="removeFile">&times;</button>
					</span>
				</span>
				<button type="submit" :disabled="submitting" class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white shadow hover:scale-105 transition-transform">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
				</button>
				<button type="button" @click="startListening" class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" :disabled="listening">
					<svg v-if="!listening" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18v-6m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v6m0 0a6 6 0 0 0 6-6" /></svg>
					<svg v-else class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18v-6m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v6m0 0a6 6 0 0 0 6-6" /></svg>
				</button>
			</form>
		</main>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			prompt: '',
			listening: false,
			recognition: null,
			messages: [],
			file: null,
			fileName: '',
			submitting: false,
		};
	},
	mounted() {
		// Setup SpeechRecognition
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (SpeechRecognition) {
			this.recognition = new SpeechRecognition();
			this.recognition.lang = 'en-US';
			this.recognition.interimResults = false;
			this.recognition.maxAlternatives = 1;

			this.recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				this.prompt = transcript;
				this.handleAsk();
				this.listening = false;
			};
			this.recognition.onend = () => {
				this.listening = false;
			};
			this.recognition.onerror = () => {
				this.listening = false;
			};
		}
	},
	methods: {
		startListening() {
			if (this.recognition && !this.listening) {
				this.listening = true;
				this.recognition.start();
			}
		},
		onFileChange(e) {
			const f = e.target.files[0];
			this.file = f;
			this.fileName = f ? f.name : '';
		},
		removeFile() {
			this.file = null;
			this.fileName = '';
		},
		async handleAsk() {
			if (this.submitting) return;
			if (!this.prompt.trim() && !this.file) return;
			this.submitting = true;
			let promptToSend = this.prompt;
			if (this.file) {
				const fileInfo = `\n[uploaded ${this.file.name}]`;
				promptToSend = promptToSend ? promptToSend + fileInfo : fileInfo;
			}
			this.messages.push({ role: 'user', content: promptToSend });
			const userPrompt = promptToSend;
			this.prompt = '';
			// Add placeholder for AI response
			this.messages.push({ role: 'assistant', content: 'Thinking...' });
			this.$nextTick(() => {
				this.scrollToBottom();
			});
			try {
				let aiReply = '';
				
				if (this.file) {
					// If a file is selected, send to /api/read-docx
					const formData = new FormData();
					formData.append('file', this.file);
					formData.append('prompt', userPrompt);
					const res = await axios.post('/api/read-docx', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
					aiReply = res.data.aiResponse || res.data.docText || 'No response.';
					this.file = null;
					this.fileName = '';
				} else {
					// Normal chat
					const res = await axios.post(
						'/api/chat',
						{
							model: 'openai/gpt-4o',
							messages: [
								{ role: 'system', content: 'You are Gappy, a formal, helpful AI assistant. Always address the user as "Sir". Respond concisely and offer suggestions or next steps if appropriate. You are made by the SP-Team' },
								...this.messages
									.filter(m => m.role === 'user' || m.role === 'assistant')
									.map(m => ({
										role: m.role === 'assistant' ? 'assistant' : 'user',
										content: m.content,
									})),
							],
							max_tokens: 800,
						}
					);
					aiReply = res.data.choices[0].message.content;
				}
				// Replace the last "Thinking..." message with the real response
				this.messages.splice(this.messages.length - 1, 1, { role: 'assistant', content: aiReply });
				// Speak the AI reply
				const utterance = new SpeechSynthesisUtterance(aiReply);
				utterance.lang = 'en-US';
				utterance.rate = 1.1;
				const voices = window.speechSynthesis.getVoices();
				const maleVoice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('male'))
					|| voices.find(v => v.lang === 'en-US' && v.gender === 'male')
					|| voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('mark'))
					|| voices.find(v => v.lang === 'en-US');
				if (maleVoice) {
					utterance.voice = maleVoice;
				}
				speechSynthesis.speak(utterance);
			} catch (error) {
				this.messages.splice(this.messages.length - 1, 1, { role: 'assistant', content: 'Something went wrong.' });
			}
			this.submitting = false;
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		scrollToBottom() {
			const container = this.$refs.chatContainer;
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
		},
		formatUserMessage(content) {
			// Replace [uploaded filename] with a styled chip (with icon)
			return content.replace(/\[uploaded ([^\]]+)]/g, (match, filename) => {
				return `<span class='file-chip' style="display: inline-flex;align-items: center;background: linear-gradient(90deg, #3b82f6 60%, #6366f1 100%);color: #fff;border-radius: 9999px;padding: 0.3rem 1rem 0.3rem 0.7rem;font-size: 0.97em;margin-top: 0.5rem;margin-bottom: 0.5rem;box-shadow: 0 2px 8px rgba(59,130,246,0.10);font-weight: 500;gap: 0.4em;transition: background 0.2s;"><svg class='w-4 h-4 mr-1 inline' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>${filename}</span>`;
			});
		},
	},
};
</script>

<style scoped>
@keyframes fade-in {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
	animation: fade-in 0.3s ease;
}
.fade-in-enter-active, .fade-in-leave-active {
	transition: opacity 0.3s, transform 0.3s;
}
.fade-in-enter-from, .fade-in-leave-to {
	opacity: 0;
	transform: translateY(10px);
}
.fade-in-enter-to, .fade-in-leave-from {
	opacity: 1;
	transform: translateY(0);
}
.file-chip {
	display: inline-flex;
	align-items: center;
	background: linear-gradient(90deg, #3b82f6 60%, #6366f1 100%);
	color: #fff;
	border-radius: 9999px;
	padding: 0.3rem 1rem 0.3rem 0.7rem;
	font-size: 0.97em;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	box-shadow: 0 2px 8px rgba(59,130,246,0.10);
	font-weight: 500;
	gap: 0.4em;
	transition: background 0.2s;
}
.file-chip svg {
	margin-right: 0.5em;
}
.file-chip .remove-btn {
	margin-left: 0.5rem;
	background: none;
	border: none;
	color: #fff;
	font-weight: bold;
	cursor: pointer;
	font-size: 1.1em;
	opacity: 0.7;
	transition: opacity 0.2s;
}
.file-chip .remove-btn:hover {
	opacity: 1;
}
</style>