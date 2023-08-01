const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const fs = require('fs');

const puppeteerOptions = {
  args: ['--no-sandbox'],
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: puppeteerOptions,
});

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
  },
  {
    keywords: ["como", "estas", "como estas", "esta", "tal", "estás", "está"],
    responses: ['Estoy, bien gracias', 'Bastante bien.', 'Muy bien Gracias', 'Bien, gracias.', 'Estoy de maravilla, amor❤️.'],
  },
  {
    keywords: ["donde", "parte", "vives", "ciudad", "lugar", "pais", "dnde", "dónde", "país", "sitio"],
    responses: ['Soy Venezolana y estoy aquí en Bogota en la 127 con avenida villas en frente de bulevar niza amor'],
  },
  {
    keywords: ["soltera", "comprometida", "casada", "marido", "novio", "esposo", "pareja"],
    responses: ['Soy mamá de 2 niñas, tengo varios años separada del papá de mis hijas y solo me he dedicado a ellas el 100 %'],
  },
  {
    keywords: ["reina", "atractiva", "guapa", "belleza", "amor", "bb", "hermosa", "preciosa", "bella", "linda"],
    responses: ['Gracias muy alagador', 'Enserio', 'Q bien amor', 'De verdad q eres super lindo',  'Tu eres tan lindo de verdad', 'tu me gustas mucho', 'Gracias amor gracias 💞', 'Gracias mí corazón', 'Y eso q no me conoces','Es usted muy amable.'],
  },
  {
    keywords: ["edad", "años"],
    responses: ['Tengo 47 años'],
  },

    {
      keywords: ["mamar","cuca", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas" , "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito","meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja", "cenosmamar", "cuca", "culo", "cojerte", "tetas ", "excita", "duro", "paro", "vagina", "grandemasturbarme", "chupartela", "chuparsela", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", "meterselo", "oral", "guevo", "chupar", "sexo", "venirme", "paja","cenos"],
      responses: ['Así me encanta el huevo rico 🤤 Ami me gusta mucho', 'Ay No Se Que Decir🤭','Q Rico Eso Me Encanta','Ay No Se Que Decir🤭','Super rico❤️❤️','divino papasito','Uf, qué rico. Me encantaría. 😋😋😋😋','Ayyy Q RiKo sii','Qué delicia 😘😘❤😍😍😍','Dime que me harías', 'Para lo q más importante son los sentimientos reales de esa persona'],
    },

{
  keywords: ['rico', 'rica', 'provocativa', 'ricota', 'lechita', 'haces', 'desnuda', 'dedicas', 'que haces', 'deliciosa'],
  sequences: [
    [
      ['Soy modelo webc@m de S€X0 en vivo por chat', 1000],
      ['Si quieres verme, aquí te envió el Link', 3000],
      ['no tienes que pagar nada amor', 500],
      ['Te envire fotos y vídeos y cuando este en vivo amor', 2000],
      ['enviar imagen rica1.jpg', 1000],
      ['enviar imagen rica2.jpg', 1000],
      ['enviar imagen rica3.jpg', 1000],
      ['https://nahomicam.belamkazar.com/', 500],
      ['https://nahomicam.belamkazar.com/', 500],
      ['https://nahomicam.belamkazar.com/', 500],
    ],
    [
      ['Soy modelo webc@m de S€X0 en vivo por chat, Te enviaré el enlace y no tienes que pagar nada, te enviare fotos y videos, podras verme cuando este en vivo Amor❤️🔥.', 2000],
      ['enviar imagen rica1.jpg', 1000],
      ['enviar imagen rica2.jpg', 1000],
      ['enviar imagen rica3.jpg', 1000],
      ['https://nahomicam.belamkazar.com/', 500],
      ['https://nahomicam.belamkazar.com/', 500],
      ['https://nahomicam.belamkazar.com/', 500],
    ],
  ],
},
{
  keywords: ['entra', 'sale', 'entro', 'paguina', 'abre', 'hago', 'link', 'bloquada', 'funciona', 'abrir'],
  sequences: [
    [
      ['Quiero q lo intentes de nuevo para que me veas todas las noches Amor', 2000],
      ['enviar imagen entra1.jpg', 500],
      ['enviar imagen entra2.jpg', 500],
      ['enviar imagen entra3.jpg', 500],
      ['https://nahomicam.belamkazar.com/', 1000],
      ['https://nahomicam.belamkazar.com/', 1000],
    ],
    [
      ['Intentalo de nuevo y disfrutamos todas las noches Amor🔥.', 2000],
      ['enviar imagen entra1.jpg', 500],
      ['enviar imagen entra4.jpg', 500],
      ['enviar imagen entra5.jpg', 500],
      ['https://nahomicam.belamkazar.com/', 1000],
      ['https://nahomicam.belamkazar.com/', 1000],
    ],
  ],
},
// Agregar más palabras clave y sus respuestas/secuencias asociadas aquí
{
  keywords: ['foto', 'video', 'videos', 'mandame', 'enviame', 'hago', 'llamada', 'audio'],
  sequences: [
    [
      ['Sii Amor', 500],
      ['enviar imagen amor1.jpg', 500],
      ['enviar imagen amor2.jpg', 500],
      ['enviar imagen amor3.jpg', 500],
    ],
    [
      ['Bien Amor🔥.', 2000],
      ['enviar imagen amor2.jpg', 500],
      ['enviar imagen amor4.jpg', 500],
      ['enviar imagen amor5.jpg', 500],
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
    const randomResponse = getRandomResponse(randomResponses);
    await client.sendMessage(message.from, randomResponse);
  }
}

// Función para inicializar el cliente y navegar a WhatsApp Web con opciones de espera
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    client.initialize(browser);
})();

// Manejar eventos de mensajes
client.on('message', handleIncomingMessage);

// Inicializar el cliente
(async () => {
  await initializeClient();
})();
