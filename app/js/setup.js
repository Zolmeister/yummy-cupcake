/*global game*/
'use strict';
var drawLoadBar = require('./assets.js').drawLoadBar
var config = require('./config.js')
var updateScoreText = require('./util.js').updateScoreText
var Phaser = require('phaser')


module.exports = {
  SetupState: SetupState,
  PreSetupState: PreSetupState
}

function SetupState() {}

SetupState.prototype.preload = function () {
  drawLoadBar()
  game.load.image('bar', game.svgs.bar)
  game.load.image('cupcake', game.svgs.cupcake)
  game.load.image('cupcake-ribbon', game.svgs.cupcakeRibbon)
}
SetupState.prototype.create = function () {
  game.stage.backgroundColor = '#71c5cf'

  if (config.debug) {
    game.stage.disableVisibilityChange = true
  }

  game.state.start('main')

  // core loop that gives players more cupcakes every second
  ;
  (function cpsCalculation() {
    game.score += game.cupcakesPerSecond
    updateScoreText(game)
    setTimeout(cpsCalculation, 1000)
  })()
}

function PreSetupState() {}

PreSetupState.prototype.preload = function () {
  // Auto scaling
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.setScreenSize(true)

  drawLoadBar()
}
