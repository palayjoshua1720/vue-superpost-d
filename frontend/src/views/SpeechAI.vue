<template>
  <div class="flex flex-col h-[88vh] max-w-lg mx-auto bg-white rounded shadow p-0">
    <!-- Chat area -->
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-2" ref="chatContainer">
      <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div
          :class="[
            'max-w-[75%] px-4 py-2 rounded-lg',
            msg.role === 'user'
              ? 'bg-blue-600 text-white self-end'
              : 'bg-gray-200 text-gray-800 self-start'
          ]"
        >
          {{ msg.content }}
        </div>
      </div>
    </div>
    <!-- Prompt input at the bottom -->
    <form @submit.prevent="handleAsk" class="flex items-center border-t p-2 gap-2">
      <input
        v-model="prompt"
        @keyup.enter="handleAsk"
        class="flex-1 p-2 border rounded"
        placeholder="Type your message..."
        autocomplete="off"
      />
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      <button type="button" @click="startListening" class="px-3 py-2 bg-gray-600 text-white rounded" :disabled="listening">
        🎤
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