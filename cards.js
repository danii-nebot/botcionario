const builder = require('botbuilder')

const getHeroCards = (session, data) => {
  const cards = []
  const card = new builder.HeroCard(session)
    .title('BotFramework Hero Card')
    .subtitle('Your bots — wherever your users are talking')
    .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
    .images([
      builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
    ])
  cards.push(card)
  return cards
}

module.exports = {
  getHeroCards
}
