// server.cjs
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1'; // 🔇 Глушим варнинг о partitioner

const express = require('express');
const cors = require('cors');
const { Kafka, Partitioners } = require('kafkajs');

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];

const app = express();
app.use(cors());
app.use(express.json());

// Явно указываем легаси-партиционер для предсказуемости в тестах
const kafka = new Kafka({
      clientId: 'vue-bridge',
      brokers: KAFKA_BROKERS,
      connectionTimeout: 8000,
      requestTimeout: 8000,
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'vue-group' });
const receivedMessages = [];

async function init() {
      console.log('🔄 Подключение к Kafka...');

      try {
            await producer.connect();
            console.log('✅ Producer подключен');

            await consumer.connect();
            console.log('✅ Consumer подключен');

            // Подписка с автоматическим созданием топика (если KAFKA_AUTO_CREATE_TOPICS_ENABLE=true)
            await consumer.subscribe({ topic: 'ui-events', fromBeginning: false });
            console.log('📡 Подписка на ui-events');

            consumer.run({
                  eachMessage: async ({ message }) => {
                        try {
                              const data = JSON.parse(message.value.toString());
                              receivedMessages.push({ ...data, id: Date.now(), time: new Date().toISOString() });
                              console.log('📥 Kafka →', data);
                        } catch (e) {
                              console.error('❌ Parse error:', e);
                        }
                  }
            }).catch(e => console.error('💥 Consumer run error:', e));

      } catch (err) {
            console.error('💥 Kafka init error:', err.message);
            console.error('👉 Убедитесь, что:');
            console.error('   1. docker compose up -d выполнен');
            console.error('   2. Kafka полностью загрузилась (подождите 15 сек)');
            console.error('   3. Порт 9092 не занят другой программой');
            process.exit(1);
      }
}

app.post('/api/send', async (req, res) => {
      try {
            await producer.send({
                  topic: 'ui-events',
                  messages: [{ value: JSON.stringify(req.body) }]
            });
            res.json({ status: 'ok' });
      } catch (e) {
            console.error('Producer error:', e);
            res.status(500).json({ error: e.message });
      }
});

app.get('/api/messages', (req, res) => {
      res.json(receivedMessages.slice(-50));
});

init().then(() => {
      app.listen(3000, () => console.log('🚀 HTTP: http://localhost:3000'));
}).catch(console.error);