const { Kafka } = require('kafkajs');

async function clearTopic() {
  const kafka = new Kafka({
    clientId: 'topic-cleaner',
    brokers: ['localhost:9092']
  });

  const admin = kafka.admin();

  try {
    console.log('Conectando ao Kafka...');
    await admin.connect();
    console.log('Conectado com sucesso!');

    const topicName = 'order.checkout';
    
    console.log(`Verificando se o tópico '${topicName}' existe...`);
    const topics = await admin.listTopics();
    
    if (!topics.includes(topicName)) {
      console.log(`Tópico '${topicName}' não encontrado.`);
      return;
    }

    console.log(`Tópico '${topicName}' encontrado. Obtendo informações...`);
    const topicMetadata = await admin.fetchTopicMetadata({ topics: [topicName] });
    
    if (topicMetadata.topics.length === 0) {
      console.log('Nenhuma informação encontrada para o tópico.');
      return;
    }

    const topic = topicMetadata.topics[0];
    console.log(`Tópico: ${topic.name}`);
    console.log(`Partições: ${topic.partitions.length}`);

    const partitions = topic.partitions.map(partition => ({
      topic: topicName,
      partition: partition.partitionId,
      offset: '0' 
    }));

    console.log('Definindo offsets para o início de todas as partições...');
    await admin.setOffsets({
      groupId: 'topic-cleaner-group',
      topic: topicName,
      partitions: partitions
    });

    console.log('✅ Tópico limpo com sucesso!');
    console.log('📝 Nota: As mensagens foram "limpas" definindo o offset para o início.');
    console.log('📝 As mensagens ainda existem fisicamente, mas não serão mais consumidas.');

  } catch (error) {
    console.error('❌ Erro ao limpar o tópico:', error.message);
  } finally {
    await admin.disconnect();
    console.log('Desconectado do Kafka.');
  }
}

clearTopic().catch(console.error); 