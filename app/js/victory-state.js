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

	// make an array for celebratory cupcake sprites
	this.cupcakes = new Array()

    // create the cupcake sprites in the order of layering

	var yRow3 = 240
	var yRow2 = yRow3 + 70
	var yRow1 = yRow2 + 50	

    this.cupcakes[0] = game.add.sprite(game.world.centerX, yRow3, 'cupcake15') // blue
    this.cupcakes[1] = game.add.sprite(game.world.centerX - 75, yRow2, 'cupcake11') // yellow
    this.cupcakes[2] = game.add.sprite(game.world.centerX + 75, yRow2, 'cupcake7') // purple
    this.cupcakes[3] = game.add.sprite(game.world.centerX, yRow1, 'cupcake3') // pink

	// anchor all cupcake sprites by their center
	for (var i = 0; i < 4; ++i) {
		this.cupcakes[i].anchor.set(0.5, 0.5)
	}

	// scale the cupcake sprites to create sense of depth
	var scaleRow1 = 0.7
	var scaleRow2 = 0.6
	var scaleRow3 = 0.5
	this.cupcakes[0].scale.x = scaleRow3
	this.cupcakes[0].scale.y = scaleRow3
	this.cupcakes[1].scale.x = scaleRow2
	this.cupcakes[1].scale.y = scaleRow2
	this.cupcakes[2].scale.x = scaleRow2
	this.cupcakes[2].scale.y = scaleRow2
	this.cupcakes[3].scale.x = scaleRow1
	this.cupcakes[3].scale.y = scaleRow1

    this.startOverButton = UI.startOverButton(game, function() {
        game.score = 0
        game.state.start('main')
    })
}
