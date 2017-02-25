'use strict'
const builder = require('botbuilder')

const getHeroCards = (session, data, word) => {
  const cards = []
  const indexes = []

  data.defs.forEach((def) => {
    const index = def[0] // we'll just ignore defs beyond the 9th
    if (indexes.indexOf(index) === -1) {
      indexes.push(index)
      let lineBreak = def.indexOf('\n')
      let doubleBreak = def.indexOf('\n\n')
      if (lineBreak === -1) lineBreak = def.length
      if (doubleBreak === -1) doubleBreak = def.length
      const context = (lineBreak > 3) ? `(${def.substring(2, lineBreak - 1)})` : ''
      const defText = def.substring(lineBreak, doubleBreak)
      const extra = def.substring(doubleBreak)
      let image

      data.thumbIndexes.find((thumbIndex, i) => {
        if (thumbIndex[1] === index) {
          image = 'https:' + data.thumbs[i]
          return true
        }
      })

      const card = new builder.HeroCard(session)
        .title(`${index} ${context}`)
        .subtitle(extra)
        .text(defText)

      if (image) {
        card.images([
          builder.CardImage.create(session, image)
        ])
      }
      cards.push(card)
    }
  })
  return cards
}

module.exports = {
  getHeroCards
}
