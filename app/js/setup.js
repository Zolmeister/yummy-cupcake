'use strict'
var drawLoadBar = require('./assets.js').drawLoadBar
var config = require('./config.js')
var Phaser = require('phaser')

// TODO split these up, or potentially merge them into one state

module.exports = {
  SetupState: SetupState,
  PreSetupState: PreSetupState
}

function SetupState() {}

SetupState.prototype.preload = function () {
  var game = this.game
  game.stage.disableVisibilityChange = true

  drawLoadBar(game)

  game.load.audio('point', '/assets/score.wav')
}

SetupState.prototype.create = function () {
  var game = this.game
  game.stage.backgroundColor = '#71c5cf'

  if (config.debug) {
    game.stage.disableVisibilityChange = true
  }

  game.state.start('main')
}

function PreSetupState() {}

PreSetupState.prototype.preload = function () {
  var game = this.game
  // Auto scaling
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.setScreenSize(true)

  game.load.image('bar', '/assets/bar.png')
}

PreSetupState.prototype.create = function () {
  drawLoadBar(this.game)
}
