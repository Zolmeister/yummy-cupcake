/*global window, document, kik*/
var _ = require('./lib/lodash.js')
var config = require('./js/config.js')
var Phaser = require('phaser')
var PhaserUI = require('./lib/phaser-ui.js')
var uiElements = require('./js/ui-elements.js')
var ShopState = require('./js/shop-state.js')
var MainState = require('./js/main-state.js')
var SetupState = require('./js/setup.js').SetupState
var PreSetupState = require('./js/setup.js').PreSetupState
var WebFont = require('webfont')
var assets = require('./js/assets.js')
var getSVGImageAssets = assets.getSVGImageAssets
var SVGstoPNGs = assets.SVGstoPNGs
var getCupcakeSVG = assets.getCupcakeSVG
var social = require('./js/social.js')
var connect = social.connect
var util = require('./js/util.js')
var updateScoreText = util.updateScoreText
var updateCPS = util.updateCPS

_.defaultsDeep = _.partialRight(_.merge, _.defaults)

 if (config.debug) {
  window.onerror = function(msg, url, linenumber) {
    document.body.innerHTML += 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber
  }
}

var transparent = !config.debug
var game = new Phaser.Game(360, 640, Phaser.CANVAS, 'game', false, transparent)
var UI = new PhaserUI(game)

window.game = game
window.UI = UI

UI.extend(uiElements)

game.state.add('shop', ShopState)
game.state.add('main', MainState)
game.score = 0
game.cupcakesPerSecond = 0
game.cupcakesPerClick = 1
game.upgrades = {}

 // shop items
game.shopItemList = config.shopItemList

 game.state.add('setup', SetupState)

 // for loading bar since we're loading some assets through xhr & loading svgs through canvg
 game.state.add('presetup', PreSetupState)
 game.state.start('presetup')

 game.loadProgress = 0 // 0 to game.loadSteps
 game.loadSteps = 6 // webfont + cupcake svg + 1 step per svg we load (just bar.svg currently) + 1 step per png we load (2) in 'setup'
 game.loadPNGs = 2 // how many pngs we're loading into phaser (game.load doesn't seem to give this #)
 // Load fonts
 WebFont.load({
  custom: {
    families: ['sansus']
  },
  active: function() {
    game.loadProgress+=1 // inc loading bar
    getSVGImageAssets()
      .then(SVGstoPNGs)
      .then(function(svgs) {
        game.svgs = svgs
      }).then(function() {
        return getCupcakeSVG({
          width: 228,
          height: 324,
          items: ['cherry', 'sprinkles']
        })
      }).then(function(cupcakeUri) {
        game.svgs.cupcake = cupcakeUri

      }).then(function() {
        return getCupcakeSVG({
          width: 228,
          height: 324,
          items: ['cherry', 'ribbon', 'sprinkles']
        })
      }).then(function(cupcakeUri) {
        game.loadProgress+=1 // inc loading bar
        game.svgs.cupcakeRibbon = cupcakeUri
      }).then(function() {
        // begin the game
        game.state.start('setup')
      }, function(err) {
        console.error(err)
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
  (function() {
    var clay = document.createElement('script');
    clay.async = true;
    //clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api.js";
    clay.src = 'http://cdn.clay.io/api.js';
    // clay.src = "http://clay.io/api/src/bundle.js";
    var tag = document.getElementsByTagName('script')[0];
    tag.parentNode.insertBefore(clay, tag);
  })();


  // Load GA
  /*jshint ignore:start*/
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-27992080-1', 'clay.io');
  ga('send', 'pageview');
  /*jshint ignore:end*/

  // high score
  Clay.ready(function() {
    connect() // prompt them to give us perms and log them in
    var shareThis = function() {
      Clay.Kik.post({
        message: 'Come play Yummy Cupcake to build your cupcake empire!',
        title: 'Yummy Cupcake',
        data: {}
      })
    }
    var giveFeedback = function() {
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
    var data = {
      shopItemList: game.shopItemList
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
        updateScoreText(game)
      }
    })
    // grab other data
    Clay.Player.fetchUserData({
      key: 'data'
    }, function(response) {
      if (response.data && response.data.shopItemList) {
        game.shopItemList = response.data.shopItemList
        updateCPS(game)
      }
    })
  })
})
