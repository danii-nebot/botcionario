const vantagePoint = require('vantage-point-tree')
const spanishWords1k = require('../../data/words.json')

const vpTree = new vantagePoint.VPTree(spanishWords1k, vantagePoint.distancesLibrary.levenshteinDistance)
const findWord = (word) => {
  return vpTree.find(word, 5)
}

module.exports = {
  findWord
}
