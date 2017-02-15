const builder = require('botbuilder')

const getHeroCards = (session, data, word) => {
  const cards = []
  console.log(data)
  data.defs.forEach((def) => {
    /* Example dataset:
    { defs:
   [ '1 Zoología.\nReptiles del orden de los Quelonios caracterizados por tener un tronco ancho y corto, protegido por un caparazón que está formado, generalmente, por placas óseas revestidas de placas córneas.\n\nHipónimo: galápago.',
     '2 Milicia.\nCubierta defensiva formada por las tropas levantando sus escudos.\n\nSinónimo: testudo.',
     '3\nLo que es muy lento.\n\nUso: coloquial, se aplica más a personas.',
     '4 Historia.\nAntiguo método de tortura en el cual el interrogado es tumbado en el suelo, poniéndole un tablón rectangular encima. En dicho tablón se coloca peso gradualmente, produciendo aplastamiento paulatino.',
     '1 Zoología.\nTortuga.' ],
  thumbs:
   [ '//upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Egyptian_tortoise.JPG/220px-Egyptian_tortoise.JPG',
     '//upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Testudo_formation.jpg/220px-Testudo_formation.jpg',
     '//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Giles_Corey.jpg/220px-Giles_Corey.jpg' ],
  thumbIndexes: [ '[1]', '[2]', '[4]' ] }
    */
    const [defText, auxText] = def.split('\n\n')
    console.log(defText, auxText)
    const card = new builder.HeroCard(session)
      .title(word)
      .subtitle(defText)
      .text(defText)
      .images([
        builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
      ])
    cards.push(card)
  })
  return cards
}

module.exports = {
  getHeroCards
}
