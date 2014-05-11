var _ = require('lodash')

module.exports = {
  getCupcakesText: getCupcakesText,
  getCupcakesPerSecondText: getCupcakesPerSecondText,
  getItemCost: getItemCost,
  updateScoreText: updateScoreText,
  updateCPS: updateCPS
}

function getCupcakesText(n) {
  return Math.floor(n) + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n.toFixed(1) + ' per second'
}

function getItemCost(item) {
  return Math.round(item.cost * Math.pow(1.15, item.owned))
}

function updateScoreText(game) {
  if(game.scoreText) {
    game.scoreText.setText(getCupcakesText(game.score))
    if (Math.floor(game.score).toString().length > 8) {
      game.scoreText.setStyle({
        font: '35px sansus',
        fill: '#fff',
        stroke: '#ee508c',
        strokeThickness: 5
      })
    }
  }
}

function updateCPS(game) {
  var cps = 0
  _.forEach(game.shopItemList, function(item) {
    cps += item.cps * item.owned
    if (item.type === 'upgrade' && item.owned && !game.upgrades[item.name]) {
      if (item.action === '+1 tap') {
        game.cupcakesPerClick+=1
      }

      game.upgrades[item.name] = true

      if (game.cupcake) {
        game.cupcake.loadTexture(game.upgrades['ribbon :)'] ? 'cupcake-ribbon' : 'cupcake')
      }

    }
  })

  game.cupcakesPerSecond = cps
  if (game.cpsText) {
    game.cpsText.setText(getCupcakesPerSecondText(cps))
  }
}
