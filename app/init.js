'use strict'
var kik = require('kik')
var _ = require('lodash')
var config = require('./js/config.js')
var Phaser = require('phaser')
var ShopState = require('./js/shop-state.js')
var MainState = require('./js/main-state.js')
var VictoryState = require('./js/victory-state.js')
var SetupState = require('./js/setup.js').SetupState
var PreSetupState = require('./js/setup.js').PreSetupState
var WebFont = require('webfont')
var social = require('./js/social.js')
var connect = social.connect
var util = require('./js/util.js')
var updateScoreText = util.updateScoreText
var updateCPS = util.updateCPS
var loadUpgrades = util.loadUpgrades
var assets = require('./js/assets.js')

_.defaultsDeep = _.partialRight(_.merge, _.defaults)

if (config.debug) {
  window.onerror = function(msg, url, linenumber) {
    document.body.innerHTML += 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber
  }
}

var transparent = !config.debug
var game = new Phaser.Game(360, 640, Phaser.CANVAS, 'game', false, transparent)
window.game = game

game.state.add('shop', ShopState)
game.state.add('main', MainState)
game.state.add('victory', VictoryState)

// TODO figure out what to do with these state variables
game.score = 0
game.cupcakesPerSecond = 0
game.cupcakesPerClick = 1
game.upgrades = {}
game.cupcakeIndex = 0

game.loadCurrentCupcake = function () {
  return assets.loadCupcakeSprite(game, game.cupcakeIndex)
}

 // shop items
game.shopItemList = config.shopItemList

game.state.add('setup', SetupState)

// for loading bar since we're loading some assets through xhr & loading svgs through canvg
game.state.add('presetup', PreSetupState)
game.state.start('presetup')

game.loadProgress = 0 // 0 to game.loadSteps
game.loadSteps = 4
// LOAD STEPS
// webfont 
// initial cupcake (2)
// bar.svg

// Load fonts
WebFont.load({
  custom: {
    families: ['sansus']
  },
  active: function() {
    // load SVG assets
    game.loadProgress += 1 // inc loading bar for the font

    game.svgs = { 
      cupcakes: [ ] 
    }
      
    if (!game.cupcakeIndex) {
      game.cupcakeIndex = 0
    }

    // load the first cupcake sprite
    var promise = assets.loadCupcakeSprite(game, game.cupcakeIndex)

    promise.then(function() {
      // begin the game
      game.state.start('setup')
    }, function(err) {

      console.error(err) /*eslint no-console:0 */

    })
  }
})

 // Set global vars for Clay API (for Clay.ready())
var Clay = window.Clay = window.Clay || {}
Clay.gameKey = 'cupcake'
Clay.readyFunctions = []
 // inviteActions means the API checks onload for any invites from other users,
 // and gives them cupcakes accordingly
 Clay.options = {
  inviteActions: true
}
Clay.ready = function(fn) {
  Clay.readyFunctions.push(fn)
}

window.addEventListener('load', function() {
  // Load clay API
  function loadClayApi() {
    var clay = document.createElement('script')
    clay.async = true
    //clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api.js";
    clay.src = 'http://cdn.clay.io/api.js'
    // clay.src = "http://clay.io/api/src/bundle.js";
    var tag = document.getElementsByTagName('script')[0]
    tag.parentNode.insertBefore(clay, tag)
  }
  loadClayApi()


  // Load GA
  function googleAnalytics(i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r
    if (!i[r]) {
      i[r] = function() {
        (i[r].q = i[r].q || []).push(arguments)
      }
    }
    i[r].l = 1 * new Date()
    a = s.createElement(o)
    m = s.getElementsByTagName(o)[0]
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  }
  googleAnalytics(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga')

  /*global ga*/
  ga('create', 'UA-27992080-1', 'clay.io')
  ga('send', 'pageview')


  // high score
  Clay.ready(function() {
    connect() // prompt them to give us perms and log them in
    function shareThis() {
      Clay.Kik.post({
        message: 'Come play Yummy Cupcake to build your cupcake empire!',
        title: 'Yummy Cupcake',
        data: {}
      })
    }
    function giveFeedback() {
      kik.openConversation('clayteam')
    }
    Clay.UI.Menu.init({
      items: [{
        title: 'Share This',
        handler: shareThis
      }, {
        title: 'Give Feedback',
        handler: giveFeedback
      }]
    })
  })
})



/* data.js */

var saveData = (function() {

  // var so we can tell if data has changed (and only update if it has). Stored as string
  var lastDataSave = ''
  var lastScoreSave = -1

  return function saveData() {
    // save only the items the player owns, not their cost or other stats
    var inventory = new Array()

    for (var i = 0; i < game.shopItemList.length; ++i) {
      inventory[i] = game.shopItemList[i].owned
    }
    
    var data = {
      playerInventory: inventory
    }
    var dataString = JSON.stringify(data)

    if (lastDataSave !== dataString) {
      Clay.Player.saveUserData({
        key: 'data',
        data: data
      })
      console.log('Saving data...')
      lastDataSave = dataString
    }

    // separate from the rest for the invite stuff to work properly
    // (can only update on a per-key basis)
    if (lastScoreSave !== game.score) {
      Clay.Player.saveUserData({
        key: 'score',
        data: game.score
      })
      console.log('Saving score', game.score)
      lastScoreSave = game.score
    }
  }
})()

// LOAD SAVE DATA
Clay.ready(function() {
  setInterval(saveData, 10000) // save score/etc every 10 seconds
  
  // grab data
  Clay.Player.onLogin(function() {
    // grab score
    Clay.Player.fetchUserData({
      key: 'score'
    }, function(response) {
      if (response.data) {
        game.score = response.data 
      }
      if (config.debug) {
        game.score = config.debugState.startingScore
      }
      updateScoreText(game)
    })
    // grab other data
    Clay.Player.fetchUserData({
      key: 'data'
    }, function(response) {
      game.shopItemList = _.clone(config.shopItemList)
      if (config.debug && config.debugState.resetShop) {
        // don't load the inventory
        console.log('Resetting the shop')
      }
      else if (response.data && response.data.playerInventory) {
        var inventory = response.data.playerInventory
        
        for (var i = 0; i < game.shopItemList.length; ++i) {
          game.shopItemList[i].owned = inventory[i] // load inventory
        }
      }
      updateCPS(game) // uses inventory to calculate cps
      loadUpgrades(game) // calculate cpclick
    })
  })
})

game.cpsCalculation = function() {
  var oldScore = this.score
  this.score += this.cupcakesPerSecond
  var newScore = this.score

  var scoreIncrease = Math.floor(newScore) - Math.floor(oldScore) //find the whole number of cupcakes generated

  util.updateScoreText(this)

  if (this.state.current === 'main') {
    //then create cupcake score effects to show the increase
    this.state.getCurrentState().createScoreEffects(scoreIncrease)

    if (this.score >= config.cupcakeLimit) {
      // they beat the game
      this.state.start('victory')
    }
  }
  
  this.dirty = true // refresh the shop buttons
}

game.startCPSCalculation = function() {
  // start the core loop that gives players more cupcakes every second
  game.time.events.start()
  game.time.events.loop(Phaser.Timer.SECOND, game.cpsCalculation, this)
}

game.stopCPSCalculation = function() {
  // stop the core loop that gives players more cupcakes every second
  game.time.events.stop(false) // don't clear events
}
