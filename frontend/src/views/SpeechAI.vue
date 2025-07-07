<template>
  <div class="flex flex-col h-[88vh] max-w-lg mx-auto rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-100 border border-gray-200">
    <!-- Header -->
    <div class="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow">
      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>
      </div>
      <div class="flex-1">
        <div class="font-bold text-lg tracking-wide">Jarvis AI Assistant</div>
        <div class="text-xs opacity-80">How can I help you today, Sir?</div>
      </div>
    </div>
    <!-- Chat area -->
    <div class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent" ref="chatContainer">
      <div v-for="(msg, i) in messages" :key="i" class="flex items-end group" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div v-if="msg.role === 'assistant'" class="flex items-end gap-2">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>
          </div>
          <div class="bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-md max-w-[75%] animate-fade-in">
            <span v-html="msg.content.replace(/\n/g, '<br>')"></span>
          </div>
        </div>
        <div v-else class="flex items-end gap-2 flex-row-reverse">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path d="M6 20v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2" /></svg>
          </div>
          <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-md max-w-[75%] animate-fade-in">
            <span v-html="msg.content.replace(/\n/g, '<br>')"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- Prompt input at the bottom -->
    <form @submit.prevent="handleAsk" class="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200">
      <input
        v-model="prompt"
        @keyup.enter="handleAsk"
        class="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 shadow-sm"
        placeholder="Type your message..."
        autocomplete="off"
      />
      <button type="submit" class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow hover:scale-105 transition-transform">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
      </button>
      <button type="button" @click="startListening" class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-blue-600 shadow hover:bg-blue-100 transition-colors" :disabled="listening">
        <svg v-if="!listening" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18v-6m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v6m0 0a6 6 0 0 0 6-6" /></svg>
        <svg v-else class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18v-6m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v6m0 0a6 6 0 0 0 6-6" /></svg>
      </button>
    </form>
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
      messages: [
        // Example: { role: 'assistant', content: 'Hello! How can I help you today?' }
      ],
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
        this.listening = false;
        this.handleAsk();
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
    async handleAsk() {
      if (!this.prompt.trim()) return;
      // Add user message
      this.messages.push({ role: 'user', content: this.prompt });
      const userPrompt = this.prompt;
      this.prompt = '';

      // Add placeholder for AI response
      this.messages.push({ role: 'assistant', content: 'Thinking...' });

      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        const res = await axios.post(
          '/api/chat', // Use your backend proxy!
          {
            model: 'openai/gpt-4o',
            messages: [
              { role: 'system', content: 'You are Jarvis, a formal, helpful AI assistant. Always address the user as "Sir". Respond concisely and offer suggestions or next steps if appropriate.' },
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

        const aiReply = res.data.choices[0].message.content;
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
</style>