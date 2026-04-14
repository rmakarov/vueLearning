// 🔇 Глушим варнинги KafkaJS
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

const { Kafka, Partitioners } = require('kafkajs');

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];


// Простая «аналитика» в памяти
const stats = {
      totalMessages: 0,
      byHour: {},
      keywords: {},
      startTime: new Date()
};

const kafka = new Kafka({
      clientId: 'analytics-service',
      brokers: KAFKA_BROKERS,
      connectionTimeout: 8000,
});

// 🔑 Ключевое: ДРУГОЙ groupId → независимая подписка!
const consumer = kafka.consumer({
      groupId: 'analytics-group',
      sessionTimeout: 30000,
});

async function start() {
      console.log('📊 Запуск аналитического консьюмера...');

      await consumer.connect();
      await consumer.subscribe({ topic: 'ui-events', fromBeginning: false });

      console.log('✅ Подписка на ui-events (analytics-group)');

      consumer.run({
            eachMessage: async ({ message }) => {
                  try {
                        const data = JSON.parse(message.value.toString());
                        processMessage(data);
                  } catch (err) {
                        console.error('❌ Ошибка парсинга в аналитике:', err.message);
                  }
            }
      });

      // Вывод статистики каждые 10 секунд
      setInterval(printStats, 10000);
}

function processMessage(data) {
      stats.totalMessages++;

      // 1️⃣ Считаем сообщения по часам
      const hour = new Date().getHours();
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

      // 2️⃣ Простой анализ текста (если есть поле text)
      if (data.text && typeof data.text === 'string') {
            const words = data.text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            words.forEach(word => {
                  stats.keywords[word] = (stats.keywords[word] || 0) + 1;
            });
      }

      // 3️⃣ Логгируем «сырое» событие (в проде — в БД/хранилище)
      console.log(`📈 [Аналитика] #${stats.totalMessages} →`, {
            text: data.text?.slice(0, 40),
            timestamp: data.timestamp || new Date().toISOString()
      });
}

function printStats() {
      const uptime = Math.round((Date.now() - stats.startTime) / 1000);
      const topWords = Object.entries(stats.keywords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => `${word}(${count})`)
            .join(', ');

      console.log('\n📊 === АНАЛИТИКА ===');
      console.log(`⏱️  Uptime: ${uptime}с`);
      console.log(`📨 Всего сообщений: ${stats.totalMessages}`);
      console.log(`🕐 По часам: ${JSON.stringify(stats.byHour)}`);
      console.log(`🔤 Топ слов: ${topWords || '—'}`);
      console.log('==================\n');
}

// Graceful shutdown
process.on('SIGINT', async () => {
      console.log('\n🛑 Остановка аналитики...');
      await consumer.disconnect();
      printStats();
      process.exit(0);
});

start().catch(console.error);