const restify = require('restify')
const { connector } = require('./bot')

const server = restify.createServer()
server.listen(3978, () => {
  console.log(`${server.name} listening to ${server.url}`)
})

server.post('/api/messages', connector.listen())
