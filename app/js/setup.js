'use strict'
var drawLoadBar = require('./assets.js').drawLoadBar
var config = require('./config.js')
var Phaser = require('phaser')
var util = require('./util.js')

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
  game.load.image('bar', game.svgs.bar)

  for (var i = 0; i < config.cupcakeSprites.svgOptions.length; ++i) {
    game.load.image('cupcake' + i, game.svgs.cupcakes[i])
  }
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

  drawLoadBar(game)
}
