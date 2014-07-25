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
  canBuy: canBuy,
  estimateTotalGameTime: estimateTotalGameTime,
  loadUpgrades: loadUpgrades,
  buyItem: buyItem
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
  return n.toFixed(1) + ' / sec'
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

// runs a contained simuation of the game, to deterimine approximately how long it might take to reach the "ending"
function estimateTotalGameTime() {
  var cupcakes = 0
  var cupcakesPerSec = 0
  var cupcakesPerTap = 1
  var tapsPerSec = 5
  var maxItems = config.maxItems - 5 // when to stop buying
  
  var shopItems = new Array()
  for (var i = 0; i < config.shopItemList.length; ++i) {
    shopItems[i] = {
      cost: config.shopItemList[i].cost,
      owned: 0    
      // copy these two properties because we don't want to change them for the actual game
    }
  }

  var t = 0

  // simulate a second at a time until the game is won
  while (cupcakes < config.cupcakeLimit) {
    sec()
    ++t

    // every 10 minutes, give a progress report
    if (t % 600 === 0) {
      console.log((t / 60) + ' minutes into the game.')
      console.log('Cupcakes: ' + cupcakes)
      console.log('Cupcakes per second: ' + cupcakesPerSec)
      console.log('Cupcakes per tap: ' + cupcakesPerTap)
    }
  }

  console.log('It took the simulation ' + t + ' seconds to beat Yummy Cupcake')
  console.log('Minutes: ' + (t / 60))
  console.log('Hours: ' + (t / 3600))
  console.log('Prisms purchased: ' + shopItems[shopItems.length - 1].owned)

  // simulate one second
  function sec() {
    cupcakes += cupcakesPerSec // cupcake generation
    cupcakes += cupcakesPerTap * tapsPerSec // cupcake tapping

    // buy whatever we can
    for (var j = 0; j < shopItems.length; ++j) {
      if (canBuyItem(j)) {
        buy(j)
      }
    }
  }

  function buy(i) {
    cupcakes -= shopItems[i].cost // deduct the price

    shopItems[i].owned++ // give the reward
    shopItems[i].cost = Math.round(config.shopItemList[i].cost * Math.pow(config.itemCostScale, shopItems[i].owned)) // ramp up the price

    if (config.shopItemList[i].type === 'upgrade') {
      var action = config.shopItemList[i].action
      var bonus = action.split(' ')[1].substring(1)
      var cpt = parseInt(bonus)

      cupcakesPerTap += cpt // apply the upgrade
    }
    else {
      cupcakesPerSec += config.shopItemList[i].cps
    }
  }

  function canBuyItem(i) {
    if (config.shopItemList[i].type === 'upgrade') {
      if (shopItems[i].owned > 0) {
        return false // can't buy more than one
      }
    }

    return shopItems[i].cost <= cupcakes && shopItems[i].owned < maxItems // otherwise, just check like normal
  }
}

function loadUpgrades(game) {
  _.forEach(game.shopItemList, function(item) {
    if (item.type === 'upgrade') {
      if (item.owned) {
        give(item, game)
      }
    }
  })

  game.loadCurrentCupcake() // load the proper sprite
}

function updateCPS(game) {
  var cps = 0
  _.forEach(game.shopItemList, function(item) {
    if (item.type !== 'upgrade') {
      cps += item.cps * item.owned
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

function buyItem(item, game) {
  game.score -= getItemCost(item)
  updateScoreText(game)

  give(item, game)
}

// gives the player an item
function give(item, game) {
  item.owned += 1

  if (item.type === 'upgrade') {
    item.visible = false

    // handle tap upgrades
    if (item.action.indexOf('taps') !== -1) {
      var taps = parseInt(item.action.substring(item.action.indexOf('+') + 1, item.action.length))

      game.cupcakesPerClick += taps
    }

    // upgrade the cupcake sprite
    game.cupcakeIndex++
  } else {
    updateCPS(game)
  }
}
