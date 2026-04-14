<template>
  <div class="kafkaDemo">
    <h1>📡 Vue + Kafka Demo</h1>
    
    <div class="controls">
      <input 
        v-model="text" 
        placeholder="Введите сообщение..." 
        @keyup.enter="send"
      />
      <button @click="send" :disabled="sending">
        {{ sending ? 'Отправка...' : 'Отправить в Kafka' }}
      </button>
    </div>

    <div class="log">
      <h3>Прочитано из Kafka:</h3>
      <ul v-if="messages.length">
        <li v-for="msg in messages" :key="msg.id">
          <strong>{{ msg.text }}</strong>
          <span class="time">{{ msg.time }}</span>
        </li>
      </ul>
      <p v-else class="empty">Сообщений пока нет. Отправьте первое!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const text = ref('');
const sending = ref(false);
const messages = ref([]);
let pollInterval = null;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const send = async () => {
  if (!text.value.trim()) return;
  sending.value = true;
  try {
    await fetch(`${API_BASE}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.value })
    });
    text.value = '';
  } catch (err) {
    alert('Ошибка отправки. Проверьте консоль backend.');
  } finally {
    sending.value = false;
  }
};

const fetchMessages = async () => {
  const res = await fetch(`${API_BASE}/api/messages`);
  const data = await res.json();
  messages.value = data.map(m => ({
    ...m,
    time: new Date(m.receivedAt).toLocaleTimeString()
  }));
};

onMounted(() => {
  fetchMessages();
  pollInterval = setInterval(fetchMessages, 2000);
});

onUnmounted(() => clearInterval(pollInterval));
</script>

<style scoped>
.kafkaDemo { max-width: 600px; margin: 40px auto; font-family: system-ui; }
.controls { display: flex; gap: 10px; margin: 20px 0; }
input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 6px; }
button { padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; }
button:disabled { opacity: 0.6; }
.log { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; min-height: 150px; }
ul { list-style: none; padding: 0; }
li { padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
.time { color: #64748b; font-size: 0.85em; }
.empty { color: #94a3b8; text-align: center; margin-top: 40px; }
</style>