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
    "keywords": ["hello", "hl", "nights", "good", "greetings", "days", "afternoon", "morning", "hla", "ola"],
    "responses": ["Hello love", "Hello daddy", "Hello, how are you", "Hello", "Hello King", "How are you my life", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King", "Hello King"],
  },
  {
    "keywords": ["how", "are you", "how are you", "this", "how", "is"],
    "responses": ["I'm fine, thank you", "Quite well.", "Very well, thank you", "Fine, thank you.", "I'm doing great, my love ❤️."],
  },
  {
    "keywords": ["where", "part", "live", "city", "place", "country", "where", "where", "country", "site"],
    "responses": ["I'm Venezuelan and I'm here in Bogotá, on 127th Street with Villas Avenue, in front of Niza Boulevard, my love"],
  },
  {
    "keywords": ["single", "engaged", "married", "husband", "boyfriend", "husband", "partner"],
    "responses": ["I'm a mother of 2 girls, I've been separated from my daughters' father for several years and I've dedicated myself to them 100%"],
  },
  {
    "keywords": ["queen", "attractive", "beautiful", "beauty", "love", "bb", "beautiful", "precious", "I love you", "I love", "adore", "I want you", "beauty", "beauty", "beauty", "charming", "fascinating", "attractive", "beautiful", "wonderful", "charismatic", "splendid", "elegant", "pleasant", "dazzling", "dazzling", "charmingly", "attractively", "fascinatingly", "pretty", "charm", "adorable", "adoration", "affectionate", "loving"],
    "responses": ["Thank you my love", "Really", "Yes, all natural, my love", "You're really handsome", "You're so handsome, really", "I really like you a lot", "Thank you, my love 💞", "Thank you my dear", "And that's even though you don't know me", "You're very kind.", "Thank you, king", "Thank you for being so beautiful", "Thank you, my love", "Thank you, baby", "You're also beautiful, my love", "Already handsome 🤩", "Thanks 🥴", "Beautiful, my love", "Oh, baby, you're the best person 💗", "You're perfect", "Everything's beautiful, my baby ❣️", "Beautiful 🤩, I love you", "❤️ so beautiful", "Thank you, king", "Thank you, sweetheart ❤️", "Oh, love, how beautiful 😻", "Thank you, my life", "So lovely, I really like you", "Oh, sweetheart, how beautiful", "Kisses, my love", "Oh, love, so lovely 😍", "I send you a big kiss and a hug", "So beautiful, my love", "Thank you, I adore you, my love", "You're very lovely", "I love you more, my baby", "I really, really care about you a lot", "Yes, I know, my king", "Well, my life, there can be many more beautiful ones", "And thank you, my love 😍😍❤️💘", "And thank you", "I love you", "If there's one thing you can be sure of, it's that I love you more", "I love you💘", "❤️💘 I love him more", "I also love you 😘", "I love you 💖"],
  },
  {
    "keywords": ["age", "years"],
    "responses": ["I'm 47 years old"],
  },


  {
         keywords: ["suck", "cunt", "ass", "fuck", "tits", "excites", "hard", "I stop", "vagina", "big masturbate", "suck it", "suck it" , "panocha", "mamarcela", "anal", "penetrarte", "eat", "dick", "pechospene", "culito", "put it in", "oral", "cock", "suck", " sex", "come", "handjob", "cenosmamar", "cuca", "ass", "cojerte", "tits", "excites", "hard", "stop", "vagina", "big masturbate" , "suck it", "suck it", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito","puterelo", "oral", " cock", "suck", "sex", "come", "straw", "cenosmamar", "cuca", "ass", "cojerte", "tits", "excites", "hard", "I stop" , "vagina", "big masturbate", "suck it", "suck it", "panocha", "mamarcela", "anal", "penetrarte", "comerte", "verga", "pechospene", "culito", " put it in", "oral", "cock", "suck", "sex", "come", "straw off", "cenos"],
         responses: ['Thats how I love rich egg 🤤 I like it a lot', 'Oh I Dont Know What To Say🤭', 'I Love That Rich', 'Oh I Dont Know What To Say🤭', 'Super yummy❤️❤️', 'divine papasito', 'Ugh, how delicious. Id love to. 😋😋😋😋', 'Ayyy Q RiKo yes', 'What a delight 😘😘❤😍😍😍', 'Tell me what you would do to me', 'How rich it would be love 😍😍❤️🤤😈', 'Huuuuy what a rich Mii bb' , 'I love how delicious my love', '😋😋😋 how delicious I love it', 'yaaa I want to feel it', 'Aaaaahh uufhssss how delicious', 'Riiicooo 😋😋👅', 'Ricooo riicooo ricooo', 'Uufhss dioosss sss what ricooooooo 😍😍😍😍😍😈😈😈', 'that leaves my legs shaking rough sex with you love would be perfect', 'Wow that riiiicooo uffhsss', 'I want that for me, feel it inside me 😍😍😍😍', ' How yummy it would be super😈😋😋😋', 'I would love to feel it inside of me 😈😋😋', '😋😋😋 it would be yummy', 'I want to 😈😈', 'yeah Baby and send me videos I want to see 😋😋😋 😈😍😍', 'Waooo yummy bb', 'Yummy bb I love it', 'huy yummy bb', 'Ugh yummy I would love your penis😋😋😋😋', '😋😋😋 ufsss yummy', ' huy yummy', '😮😮😋😋😋😈 yummy I love it'],
       },

{
  keywords: ['rich', 'rich', 'provocative', 'ricotta', 'milk', 'you do', 'naked', 'dedicate', 'what do you do', 'delicious'],
  sequences: [
    [
      ['Love send me what your heart tells you to my PayPal belamkazar@gmail.com and we will do everything you want love', 6000],
      ['Love you can video call me whenever you want, I will do everything you tell me, I will send you photos and videos as you want them love💋🔥. ', 6000],
      ['I will be yours love', 6000],
      ['enviar imagen rica1.jpg', 6000],
      ['enviar imagen rica2.jpg', 6000],
      ['enviar imagen rica3.jpg', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
    ],
    [
      ['Love send me what you want to my paypal belamkazar@gmail.com and I will be all yours love I will make you the videos you want and you can video call me when you want to ask me what you want I will please you in what you want love I will do everything to be your woman love', 6000],
      ['enviar imagen rica1.jpg', 6000],
      ['enviar imagen rica2.jpg', 6000],
      ['enviar imagen rica3.jpg', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
    ],
  ],
},
{
  keywords: ['enter', 'exit', 'enter', 'page', 'open', 'do', 'link', 'blocked', 'works', 'open', 'paypal', 'money', 'cash'],
  sequences: [
    [
      ['Love send me to my paypal belamkazar@gmail.com and enjoy rich I can please you with video calls and you can ask me whatever you want I will be everything to please you love', 6000],
      ['I will be available at any time to please you love🔥.', 6000],
      ['enviar imagen entra1.jpg', 6000],
      ['enviar imagen entra2.jpg', 6000],
      ['enviar imagen entra3.jpg', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
    ],
    [
      ['Send me to my paypal I will be your woman I will do everything you tell me to be your woman love that way you show me that you really love me love🤤.', 6000],
      ['enviar imagen entra1.jpg', 6000],
      ['enviar imagen entra4.jpg', 6000],
      ['enviar imagen entra5.jpg', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
      ['https://www.paypal.com/paypalme/belamkazar?country.x=CO&locale.x=es_XC&fbclid=IwAR1yx4h2yHdlZ4GgFQx9K6qg7bjlGp4Bgcv5C3tS5BGez6OmzFp7gJZOtyo', 6000],
    ],
  ],
},
// Agregar más palabras clave y sus respuestas/secuencias asociadas aquí
{
  keywords: ['photo', 'video', 'videos', 'send me', 'send me', 'do', 'call', 'audio'],
  sequences: [
    [
      ['Yes Love', 6000],
      ['enviar imagen amor1.jpg', 6000],
      ['enviar imagen amor2.jpg', 6000],
      ['enviar imagen amor3.jpg', 6000],
    ],
    [
      ['Well Love🔥.', 6000],
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
    '❤️',
  '🤗🤗',
  '😍',
  '🤗🤗',
  'Yes love',
  'Shiiii 🥰❤️',
  'Ok love',
  '❤️super rich 🤤',
  'Good to know that 😊',
  'Ok thats good',
  'Woow',
  'Okay',
  'Yep',
  'Yeah sure',
  'I get it',
  'Ok sounds good to me',
  'Unnm thats good',
  'Very good',
  'Yes King',
  'Thats very good',
  'Thats good',
  'Yeah',
  'Good Amor❤️',
  'Cute',
  'Youre mine Amor',
  'Im glad',
  'Un ya honey',
  'Okay honey its okay',
  'Okay my love ❤️😍',
  'Okay ☺️',
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

async function handleIncomingMessage(message) {
  console.log(message.body);
  const matchedResponse = findSequence(message.body);
  if (matchedResponse) {
    if (matchedResponse.responses) {
      const randomResponse = getRandomResponse(matchedResponse.responses);
      await sendDelayedMessage(message.from, randomResponse);
    } else if (matchedResponse.sequences) {
      const sequences = matchedResponse.sequences;
      await sendSequenceMessages(message.from, sequences);
    }
  } else {
    const randomResponse = getRandomResponse(randomResponses);
    await sendDelayedMessage(message.from, randomResponse);
  }
}

// Función para enviar un mensaje con una demora aleatoria antes de enviarlo
async function sendDelayedMessage(chatId, message) {
  const delay = Math.floor(Math.random() * 8000) + 4000; // Delay entre 1 y 5 segundos
  await new Promise(resolve => setTimeout(resolve, delay));
  await client.sendMessage(chatId, message);
}



// Manejar eventos de mensajes
client.on('message', handleIncomingMessage);

// Función para inicializar el cliente y navegar a WhatsApp Web con opciones de espera
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    client.initialize(browser);
})();
