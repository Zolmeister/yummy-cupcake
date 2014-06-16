'use strict'
var config = require('./config.js')
var Phaser = require('phaser')
var util = require('./util.js')

module.exports = VictoryState

function VictoryState() {}

VictoryState.prototype.create = function() {
    var game = this.game
    
    var UI = require('./ui.js')(game)

    this.victoryText = UI.victoryText(game)
    this.victorySubtitle = UI.victorySubtitle(game)

    this.startOverButton = UI.startOverButton(game, function() {
        game.score = 0
        game.state.start('main')
    })
}
