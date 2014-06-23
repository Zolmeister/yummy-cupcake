'use strict'
var _ = require('lodash')
var config = require('./config.js')

// TODO surely this file can be cleaned up, and potentially removed
module.exports = {
  getCupcakesText: getCupcakesText,
  getCupcakesPerSecondText: getCupcakesPerSecondText,
  getItemCost: getItemCost,
  updateScoreText: updateScoreText,
  updateCPS: updateCPS,
  canBuy: canBuy
}

function getCupcakesText(n) {
    var count = Math.floor(n)
    
    //Use a descriptive text if any applies
    for (var key in config.cupcakeText.descriptiveTexts) {
        var descriptiveText = key
        var descriptiveMin = config.cupcakeText.descriptiveTexts[key]
        
        if (count >= descriptiveMin) {
            // obtain the number with the desired precision without using toFixed() to avoid rounding
            var precisionMultiple = Math.pow(10, config.cupcakeText.descriptiveDecimalPlaces)
            
            var modifiedCount = Math.floor((count / descriptiveMin) * precisionMultiple) / precisionMultiple
            return modifiedCount + ' ' + descriptiveText
        }
    }

    //only one cupcake
    if (count === 1) {
        return count + ' Cupcake'
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
    var text = getCupcakesText(game.score)

    game.scoreText.setText(text)
    
    //shrink the text so it always fits
    var length = text.length

    if (length >= 16) {
        //console.log('Shrinking score text')
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
    }
  })

  game.cupcakesPerSecond = cps
  if (game.cpsText) {
    game.cpsText.setText(getCupcakesPerSecondText(cps))
  }
}

function canBuy(item, game) {
    return getItemCost(item) <= game.score && item.owned < config.maxItems
}
