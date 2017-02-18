'use strict'
const builder = require('botbuilder')

const getHeroCards = (session, data, word) => {
  const cards = []
  const indexes = []

  // // Example dataset:
  // index.js
  // const cards = require('./cards').getHeroCards
  // cards()
  //
  // const word = 'tortuga'
  // const data = {
  //   defs: [
  //     '1 Zoología.\nReptiles del orden de los Quelonios caracterizados por tener un tronco ancho y corto, protegido por un caparazón que está formado, generalmente, por placas óseas revestidas de placas córneas.\n\nHipónimo: galápago.',
  //     '2 Milicia.\nCubierta defensiva formada por las tropas levantando sus escudos.\n\nSinónimo: testudo.',
  //     '3\nLo que es muy lento.\n\nUso: coloquial, se aplica más a personas.',
  //     '4 Historia.\nAntiguo método de tortura en el cual el interrogado es tumbado en el suelo, poniéndole un tablón rectangular encima. En dicho tablón se coloca peso gradualmente, produciendo aplastamiento paulatino.',
  //     '1 Zoología.\nTortuga.'
  //   ],
  //   thumbs: [
  //     '//upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Egyptian_tortoise.JPG/220px-Egyptian_tortoise.JPG',
  //     '//upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Testudo_formation.jpg/220px-Testudo_formation.jpg',
  //     '//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Giles_Corey.jpg/220px-Giles_Corey.jpg'
  //   ],
  //   thumbIndexes: [ '[1]', '[2]', '[4]' ]
  // }

  data.defs.forEach((def) => {
    const index = def[0] // we'll just ignore defs beyond the 9th
    if (indexes.indexOf(index) === -1) {
      indexes.push(index)
      const context = def.substring(1, def.indexOf('\n'))
      const defText = def.substring(def.indexOf('\n'))
      let image = 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Wiktionary-logo_wpstyle-en-old.png' //  default image

      data.thumbIndexes.find((thumbIndex, i) => {
        if (thumbIndex[1] === index) {
          image = 'https:' + data.thumbs[i]
          return true
        }
      })

      console.log(word)
      console.log(`${index} ${context}`)
      console.log(defText)
      console.log(image)

      // TODO: text formatting?
      const card = new builder.HeroCard(session)
        .title(word)
        .subtitle(context)
        .text(defText)
        .images([
          builder.CardImage.create(session, image)
        ])
      cards.push(card)
    }
  })
  return cards
}

module.exports = {
  getHeroCards
}
