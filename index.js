const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});
const fs = require('fs');

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Conexión exitosa nenes');
});

// Función para eliminar tildes de las palabras
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Palabras clave con respuestas aleatorias y secuencias de mensajes
const keywordResponses = [
  {
    keywords: ['hola', 'saludos', 'buenos dias', 'qué tal'],
    responses: ['TODO ESTA BIEN'],
    responseDelay: 60000, // 2 segundos de espera antes de enviar la respuesta
  },
  {
    keywords: ['adios', 'chao', 'nos vemos', 'hasta pronto'],
    responses: ['¡Hasta luego!', '¡Adiós! Espero verte pronto.', '¡Nos vemos!'],
    responseDelay: 3000, // 3 segundos de espera antes de enviar la respuesta
  },
  {
    keywords: ['clima', 'tiempo'],
    responses: ['Hoy está soleado y cálido.', 'El clima de hoy es frío y lluvioso.'],
    responseDelay: 1000, // 1.5 segundos de espera antes de enviar la respuesta
  },
  // Agregar más palabras clave y sus respuestas/secuencias asociadas aquí
];

// Diccionario de secuencias y sus imágenes asociadas
const sequences = {
  // Agregar más secuencias aquí si es necesario
  // secuencia3: [ ... ]
};

// Respuestas aleatorias para mensajes desconocidos
const randomResponses = [
  {
    text: 'Lo siento, no he reconocido tu mensaje.',
    responseDelay: 2500, // 2.5 segundos de espera antes de enviar la respuesta
  },
  {
    text: 'No estoy seguro de cómo responder a eso.',
    responseDelay: 2000, // 2 segundos de espera antes de enviar la respuesta
  },
  // Agregar más respuestas aleatorias con sus tiempos de espera
];

// Función para obtener una respuesta aleatoria de una lista
function getRandomResponse(responsesList) {
  const randomIndex = Math.floor(Math.random() * responsesList.length);
  return responsesList[randomIndex];
}

// Función para verificar si el mensaje incluye alguna de las palabras clave asociadas con una secuencia
function findSequence(message) {
  const lowercaseMessage = removeAccents(message.toLowerCase()); // Eliminamos los acentos del mensaje
  for (const response of keywordResponses) {
    const keywords = response.keywords;
    const found = keywords.some(keyword => {
      const lowercaseKeyword = removeAccents(keyword.toLowerCase()); // Eliminamos los acentos de la palabra clave
      return lowercaseMessage.includes(lowercaseKeyword);
    });
    if (found) {
      return response;
    }
  }
  return null;
}

// Función para enviar mensajes con intervalos de tiempo y seleccionar una secuencia aleatoria
async function sendSequenceMessages(chatId, sequences) {
  const randomSequenceIndex = Math.floor(Math.random() * sequences.length);
  const randomSequence = sequences[randomSequenceIndex];

  for (const [message, interval] of randomSequence) {
    if (message.startsWith('enviar imagen')) {
      // Es una solicitud para enviar una imagen o video
      const imagePath = message.substring(14).trim();
      if (fs.existsSync(imagePath)) {
        const media = MessageMedia.fromFilePath(imagePath);
        await client.sendMessage(chatId, media);
      } else {
        await client.sendMessage(chatId, 'No se encontró la imagen.');
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, interval));
      await client.sendMessage(chatId, message);
    }
  }
}

// Función para pausar la ejecución por un tiempo específico en milisegundos
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para manejar los mensajes entrantes
async function handleIncomingMessage(message) {
  console.log(message.body);
  const matchedResponse = findSequence(message.body);
  if (matchedResponse) {
    if (matchedResponse.responses) {
      const randomResponse = getRandomResponse(matchedResponse.responses);
      if (matchedResponse.responseDelay) {
        await sleep(matchedResponse.responseDelay);
      }
      await client.sendMessage(message.from, randomResponse);
    } else if (matchedResponse.sequences) {
      const sequences = matchedResponse.sequences;
      if (matchedResponse.responseDelay) {
        await sleep(matchedResponse.responseDelay);
      }
      await sendSequenceMessages(message.from, sequences);
    }
  } else {
    const randomResponse = getRandomResponse(randomResponses);
    if (randomResponse.responseDelay) {
      await sleep(randomResponse.responseDelay);
    }
    await client.sendMessage(message.from, randomResponse.text);
  }
}

// Manejar eventos de mensajes
client.on('message', handleIncomingMessage);

// Función para inicializar el cliente y navegar a WhatsApp Web con opciones de espera
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  client.initialize(browser);
})();
