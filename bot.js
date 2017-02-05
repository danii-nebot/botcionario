const builder = require('botbuilder')
const restify = require('restify')
const secret = require('./secret.json')

const server = restify.createServer()
server.listen(3978, () => {
    console.log(`${server.name} listening to ${server.url}`)
})

const connector = new builder.ChatConnector({
    appId: secret.MICROSOFT_APP_ID,
    appPassword: secret.MICROSOFT_APP_PASSWORD
})

const bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())

const luisUrl = 'westus.api.cognitive.microsoft.com/luis/v2.0'
const luisEndpointUrl = `https://${luisUrl}/apps/${secret.LUIS_APP_ID}?subscription-key=${secret.LUIS_API_KEY}`

const recognizer = new builder.LuisRecognizer(luisEndpointUrl)
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

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
])
.matches('definition', [
    (session, args) => {
        const keyword = builder.EntityRecognizer.findEntity(args.entities, 'keyword').entity
        console.log(keyword)
        session.send(`quieres que te defina ${keyword}`)
        session.dialogData.keyword = keyword
        session.beginDialog('/define')
    },
    (session, results) => {
        console.log(results)
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

bot.dialog('/define', [
    session => {
        session.send(`OK, Esta es la palabra que te voy a definir: ${session.dialogData.keyword}`)
        // TODO: session.sendTyping()
        // TODO: lookup word in async service
        session.endDialogWithResult({ })
    }
])
