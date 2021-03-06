const builder = require('botbuilder')
const scraper = require('./scraper')
const corrector = require('./corrector')
const { getHeroCards } = require('./cards')
const secret = require('../secret.json')

const connector = new builder.ChatConnector({
  appId: secret.MICROSOFT_APP_ID,
  appPassword: secret.MICROSOFT_APP_PASSWORD
})

const bot = new builder.UniversalBot(connector)
module.exports = { connector }

const luisUrl = 'westus.api.cognitive.microsoft.com/luis/v2.0'
const luisEndpointUrl = `https://${luisUrl}/apps/${secret.LUIS_APP_ID}?subscription-key=${secret.LUIS_API_KEY}`

const recognizer = new builder.LuisRecognizer(luisEndpointUrl)
const intents = new builder.IntentDialog({ recognizers: [recognizer] })

bot.dialog('/', intents)

intents.onDefault([
  (session, args, next) => {
    session.send('Hola soy el botcionario, escríbeme una palabra y te daré la definición según el diccionario de la RAE :)')
    next()
  },
  session =>
    session.send('También puedo darte sinónimos y antónimos, si los necesitas')
])
  .matches('greeting', [
    session =>
      session.send('es un greeting')
    // TODO: fallback to default dialog
  ])
  .matches('definition', [
    (session, args) => {
      const found = builder.EntityRecognizer.findEntity(args.entities, 'keyword')
      if (found && found.entity) {
        const keyword = found.entity
        session.beginDialog('/correct', { keyword })
      } else {
        session.send('Vaya parece que no te he entendido bien')
        // TODO: fallback to default dialog
      }
    },
    (session, results) => {
      session.beginDialog('/define', { keyword: results.keyword })
    },
    (session, results) => {
      if (results.response) {
        session.send(results.response)
      } else {
        session.send('Lo siento parece que no conozco esa palabra :(')
        // TODO: fallback to default dialog
      }
    }
  ])
  .matches('synonym', [
    (session, args) => {
      const keyword = builder.EntityRecognizer.findEntity(args.entities, 'keyword').entity
      session.send(`quieres sinónimos de ${keyword}`)
    }
  ])
  .matches('antonym', [
    (session, args) => {
      const keyword = builder.EntityRecognizer.findEntity(args.entities, 'keyword').entity
      session.send(`quieres antónimos de ${keyword}`)
    }
  ])
// don't need this?
// .matches(/^(\S+)$/i), [
//     (session, args) => {
//         console.log('quieres que defina: ', args)
//         session.send(`quieres que te defina ${args}`)
//         session.dialogData.keyword = 'check_console!'
//         bot.beginDialog('/define')
//     }
// ]

bot.dialog('/correct', [
  (session, args) => {
    session.send(`quieres que te defina ${args.keyword}`)
    session.sendTyping()
    const closestWords = corrector.findWord(args.keyword)
    let correctedWord
    if (closestWords[0].dist <= 1) { // match on distance 1 for testing...
      correctedWord = closestWords[0].id
    } else {
      // TODO: show quick reply matches
    }
    session.endDialogWithResult({ keyword: correctedWord })
  }
])
bot.dialog('/define', [
  (session, args) => {
    session.send(`OK, Esta es la palabra que te voy a definir: ${args.keyword}`)
    session.sendTyping()
    scraper.getdata(args.keyword)
      .then((context, data) => {
        if (!data || !data.defs) {
          throw new Error('404 no dataset')
        }

        // unkown word
        if (data.defs.length === 1 && data.defs[1] === '1\nNo definido') {
          throw new Error('404 no definition')
        }

        var cards = getHeroCards(session, data, args.keyword)

        // create reply with Carousel AttachmentLayout
        const reply = new builder.Message(session)
          .attachmentLayout(builder.AttachmentLayout.carousel)
          .attachments(cards)

        session.endDialogWithResult({ response: reply })
      })
      .error((err) => {
        session.endDialogWithResult({ error: err })
      })
  }
])
