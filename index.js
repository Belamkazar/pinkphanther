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
  },
  {
    keywords: ['adios', 'chao', 'nos vemos', 'hasta pronto'],
    responses: ['¡Hasta luego!', '¡Adiós! Espero verte pronto.', '¡Nos vemos!'],
  },
  {
    keywords: ['perro', 'primera secuencia'],
    sequences: [
      [
        ['Mensaje 1 - Secuencia 1 (Opción 1)', 2000],
        ['Mensaje 2 - Secuencia 1 (Opción 1)', 1000],
        ['enviar imagen Bang.gif', 1000],
      ],
      [
        ['Mensaje 1 - Secuencia 1 (Opción 2)', 2000],
        ['Mensaje 2 - Secuencia 1 (Opción 2)', 1000],
      ],
    ],
  },
  {
    keywords: ['gato'],
    sequences: [
      [
        ['todo esta bien)', 2000],
        ['enviar imagen amor1.jpg', 500],
      ],
      [
        ['Mensaje 1 - Secuencia 2 (Opción 2)', 2000],
        ['enviar imagen amor2.jpg', 1000],
      ],
    ],
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
  'Lo siento, no he reconocido tu mensaje.',
  'No estoy seguro de cómo responder a eso.',
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

// Función para manejar los mensajes entrantes
async function handleIncomingMessage(message) {
  console.log(message.body);
  const matchedResponse = findSequence(message.body);
  if (matchedResponse) {
    if (matchedResponse.responses) {
      const randomResponse = getRandomResponse(matchedResponse.responses);
      await client.sendMessage(message.from, randomResponse);
    } else if (matchedResponse.sequences) {
      const sequences = matchedResponse.sequences;
      await sendSequenceMessages(message.from, sequences);
    }
  } else {
    // Si no se encuentra una palabra clave, respondemos con la secuencia "gato"
    const gatoResponse = keywordResponses.find(response => response.keywords.includes('gato'));
    if (gatoResponse && gatoResponse.sequences) {
      const sequences = gatoResponse.sequences;
      await sendSequenceMessages(message.from, sequences);
    } else {
      const randomResponse = getRandomResponse(randomResponses);
      await client.sendMessage(message.from, randomResponse);
    }
  }
}

// Manejar eventos de mensajes
client.on('message', handleIncomingMessage);

// Función para inicializar el cliente y navegar a WhatsApp Web con opciones de espera
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    client.initialize(browser);
})();
