'use strict'
var _ = require('lodash')
var config = require('./config.js')

// TODO surely this file can be cleaned up, and potentially removed
module.exports = {
  getCupcakesText: getCupcakesText,
  getCupcakesPerSecondText: getCupcakesPerSecondText,
  getItemCost: getItemCost,
  updateScoreText: updateScoreText,
  updateCPS: updateCPS
}

function getCupcakesText(n) {
    var count = Math.floor(n)

    if (n >= 1000000000000000) {
        //express in GAZILLIONS of cupcakes
        var gazillions = (count / 1000000000000000).toFixed(2)

        return gazillions + ' GAZILLION CUPCAKES!!!'
    }
    if (n >= 1000000000000) {
        //express in trillions of cupcakes
        var trillions = (count / 1000000000000).toFixed(2)

        return trillions + ' Trillion Cupcakes!!'
    }
    if (n >= 1000000000) {
        //express in billions of cupcakes
        var billions = (count / 1000000000).toFixed(2)

        return billions + ' Billion Cupcakes!'
    }
    if (n >= 1000000) {
        //express in millions of cupakes
        var millions = (count / 1000000).toFixed(2)

        return millions + ' Million Cupcakes'
    }
    if (count === 1) {
        return '1 Cupcake'
    }
    return count + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n.toFixed(1) + ' per second'
}

function getItemCost(item) {
  return Math.round(item.cost * Math.pow(config.itemCostScale, item.owned))
}

function updateScoreText(game) {
  if(game.scoreText) {
    console.log('Updating score text')
    
    var text = getCupcakesText(game.score)

    game.scoreText.setText(text)
    
    //shrink the text so it always fits
    var length = text.length

    if (length >= 16) {
        console.log('Shrinking score text')
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
        game.cupcakesPerClick += 1
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
