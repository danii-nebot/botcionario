const osmosis = require('osmosis')

module.exports = (word) => {
  return osmosis
  .get(`https://es.wiktionary.org/wiki/${word}`)
  .set({
    'defs': ['dl'],
    'thumbs': ['img.thumbimage@src'],
    'thumbIndexes': ['div.thumbcaption']
  })
//     .log(console.log)
//     .error(console.log)
//     .debug(console.log)
}
