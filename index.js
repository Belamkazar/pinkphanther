
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
    keywords: ["hola", "hl", "noches", "buenas", "saludos", "dias", "tarde", "mañana", "hla", "ola"],
    responses: ['Hola amor', 'Hola papi', 'Hola como ests','Hola',],
    responseDelay: 60000,
  },
  {
    keywords: ["como", "estas", "como estas", "esta", "tal", "estás", "está"],
    responses: ['Estoy, bien gracias', 'Bastante bien.', 'Muy bien Gracias', 'Bien, gracias.', 'Estoy de maravilla, amor❤️.'],
    responseDelay: 3000,
  },
  {
    keywords: ["donde", "parte", "vives", "ciudad", "lugar", "pais", "dnde", "dónde", "país", "sitio"],
    responses: ['Soy Venezolana y estoy aquí en Bogota en la 127 con avenida villas en frente de bulevar niza amor'],
    responseDelay: 3000,
  },
  {
    keywords: ["soltera", "comprometida", "casada", "marido", "novio", "esposo", "pareja"],
    responses: ['Soy mamá de 2 niñas, tengo varios años separada del papá de mis hijas y solo me he dedicado a ellas el 100 %'],
    responseDelay: 3000,
  },
  {
    keywords: ["reina", "atractiva", "guapa", "belleza", "amor", "bb", "hermosa", "preciosa", "bella", "linda"],
    responses: ['Gracias muy alagador', 'Enserio', 'Q bien amor', 'De verdad q eres super lindo',  'Tu eres tan lindo de verdad', 'tu me gustas mucho', 'Gracias amor gracias 💞', 'Gracias mí corazón', 'Y eso q no me conoces','Es usted muy amable.'],
    responseDelay: 3000,
    },
  {
    keywords: ["edad", "años"],
    responses: ['Tengo 47 años'],
    responseDelay: 3000,
  },

    {
      keywords: ["mamar","cuca", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito","meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas ", "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja","cenos"],
      responses: ['Así me encanta el huevo rico 🤤 Ami me gusta mucho', 'Ay No Se Que Decir🤭','Q Rico Eso Me Encanta','Ay No Se Que Decir🤭','Super rico❤️❤️','divino papasito','Uf, qué rico. Me encantaría. 😋😋😋😋','Ayyy Q RiKo sii','Qué delicia 😘😘❤😍😍😍','Dime que me harías', 'Para lo q más importante son los sentimientos reales de esa persona'],
      responseDelay: 3000,
      },

{
  keywords: ['rico', 'rica', 'provocativa', 'ricota', 'lechita', 'haces', 'desnuda', 'dedicas', 'que haces', 'deliciosa'],
  sequences: [
    [
      ['Soy modelo webc@m de S€X0 en vivo por chat', 3000],
      ['Si quieres verme, aquí te envió el Link', 3000],
      ['no tienes que pagar nada amor', 3000],
      ['Te envire fotos y vídeos y cuando este en vivo amor', 6000],
      ['enviar imagen rica1.jpg', 3000],
      ['enviar imagen rica2.jpg', 3000],
      ['enviar imagen rica3.jpg', 3000],
      ['https://nahomicam.belamkazar.com/', 3000],
      ['https://nahomicam.belamkazar.com/', 3000],
      ['https://nahomicam.belamkazar.com/', 3000],
    ],
    [
      ['Soy modelo webc@m de S€X0 en vivo por chat, Te enviaré el enlace y no tienes que pagar nada, te enviare fotos y videos, podras verme cuando este en vivo Amor❤️🔥.', 6000],
      ['enviar imagen rica1.jpg', 6000],
      ['enviar imagen rica2.jpg', 6000],
      ['enviar imagen rica3.jpg', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
    ],
  ],
},
{
  keywords: ['entra', 'sale', 'entro', 'paguina', 'abre', 'hago', 'link', 'bloquada', 'funciona', 'abrir'],
  sequences: [
    [
      ['Quiero q lo intentes de nuevo para que me veas todas las noches Amor', 60000],
      ['enviar imagen entra1.jpg', 60000],
      ['enviar imagen entra2.jpg', 60000],
      ['enviar imagen entra3.jpg', 60000],
      ['https://nahomicam.belamkazar.com/', 60000],
      ['https://nahomicam.belamkazar.com/', 60000],
    ],
    [
      ['Intentalo de nuevo y disfrutamos todas las noches Amor🔥.', 6000],
      ['enviar imagen entra1.jpg', 6000],
      ['enviar imagen entra4.jpg', 6000],
      ['enviar imagen entra5.jpg', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
      ['https://nahomicam.belamkazar.com/', 6000],
    ],
  ],
},
// Agregar más palabras clave y sus respuestas/secuencias asociadas aquí
{
  keywords: ['foto', 'video', 'videos', 'mandame', 'enviame', 'hago', 'llamada', 'audio'],
  sequences: [
    [
      ['Sii Amor', 6000],
      ['enviar imagen amor1.jpg', 6000],
      ['enviar imagen amor2.jpg', 6000],
      ['enviar imagen amor3.jpg', 6000],
    ],
    [
      ['Bien Amor🔥.', 6000],
      ['enviar imagen amor2.jpg', 6000],
      ['enviar imagen amor4.jpg', 6000],
      ['enviar imagen amor5.jpg', 6000],
    ],
  ],
},
];

// Diccionario de secuencias y sus imágenes asociadas
const sequences = {
// Agregar más secuencias aquí si es necesario
// secuencia3: [ ... ]
};

// Respuestas aleatorias para mensajes desconocidos
const randomResponses = [
  {
    text: '❤️',
    responseDelay: 2500, // 2.5 segundos de espera antes de enviar la respuesta
  },
  {
    text: '🤗🤗',
    responseDelay: 2000, // 2 segundos de espera antes de enviar la respuesta
  },
  {
    text: '😍',
    responseDelay: 2500, // 2.5 segundos de espera antes de enviar la respuesta
  },
  {
    text: '🤗🤗',
    responseDelay: 2000, // 2 segundos de espera antes de enviar la respuesta
  },
  {
    text: 'Si amor',
    responseDelay: 2500, // 2.5 segundos de espera antes de enviar la respuesta
  },
  {
    text: '🤗🤗',
    responseDelay: 2000, // 2 segundos de espera antes de enviar la respuesta
  },
  {
    text: '❤️',
    responseDelay: 2500, // 2.5 segundos de espera antes de enviar la respuesta
  },
  {
    text: '🤗🤗',
    responseDelay: 2000, // 2 segundos de espera antes de enviar la respuesta
  },

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
