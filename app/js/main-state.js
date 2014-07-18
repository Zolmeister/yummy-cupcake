'use strict'
var config = require('./config.js')
var Phaser = require('phaser')
var util = require('./util.js')
var updateScoreText = util.updateScoreText
var invite = require('./social.js' ).invite

module.exports = MainState

function MainState() {}

MainState.prototype.create = function() {
  var game = this.game
  var self = this

  var UI = require('./ui.js')(game)
  if (config.debug) {
    game.stage.disableVisibilityChange = true
  }

  // Add UI elements

  //game.topBar = UI.topBar(game)

  // Main score text
  game.scoreText = UI.scoreText(game)
  // Update the main score text to force resizing if necessary
  updateScoreText(game)

  // Cupcakes-per-second text
  game.cpsText = UI.cpsText(game)

  // Cupcakes-per-second calculation
  game.startCPSCalculation()

  // The big cupcake
  game.cupcake = UI.cupcake(game, null)

  var tween = {}

  game.cupcake.events.onInputDown.add(function(el, pointer) {
    if (!tween.isRunning) {
      tween = game.add.tween(game.cupcake.scale)
        .to({x: 0.93, y: 0.93}, 100, Phaser.Easing.Cubic.Out, true, 0, 1, true)
    }

    // increment score
    game.score += game.cupcakesPerClick
    updateScoreText(game)
    self.createScoreEffect(pointer, game.cupcakesPerClick)
  })

  // shop button
  game.shopButton = UI.shopButton(game, function() {
    game.state.start('shop')
  })

  // earn more cupcakes (share) button
  game.shareButton = UI.shareButton(game, function(){
    invite(game)
  })
}

MainState.prototype.createScoreEffect = function(position, cupcakes) {
    var game = this.game

    var x = position.x
    var y = position.y
    var plusOne = game.add.text(
      x, y, '+' + cupcakes,
      {font: '25px sansus', align: 'center', fill: '#fff'})

    var cupcake = game.add.sprite(x, y, 'cupcake' + game.cupcakeIndex)
    cupcake.anchor.setTo(0.5,0.5)
    cupcake.scale.x = 0.3
    cupcake.scale.y = 0.3
    cupcake.alpha = 0.7

    var cupcakeTime = Math.random() * 1500 + 1000
    var tween = game.add.tween(cupcake)
    tween.to(
      {y: 200 * Math.random() + y - 100, x: 200 * Math.random() + x - 100, angle: Math.random() * 360 - 180, alpha: 0},
      cupcakeTime,
      Phaser.Easing.Cubic.Out, true)
      .onComplete.add(function () {
        if (cupcake.remove) {
          cupcake.remove()
        }
      })
    tween.start()

    // slight random rotation
    plusOne.angle = -Math.random() * 10 + 5
    tween = game.add.tween(plusOne)
    tween.to(
      {y: -50},
      Math.random() * 1500 + 2000,
      Phaser.Easing.Cubic.Out, true)
      .onComplete.add(function () {
        if (plusOne.remove) {
          plusOne.remove()
        }
      })
    tween.start()
}

MainState.prototype.createScoreEffects = function(cupcakes) {
    if (cupcakes < 1) {
        return
    }

    var game = this.game

    var maxEffects = 7 //we don't want too many cupcakes flying around the screen, but enough to be satisfying

    var baseNumPerEffect = Math.floor(cupcakes / maxEffects)
    var remainder = cupcakes % maxEffects

    for (var i = 0; i < Math.min(cupcakes, maxEffects); ++i) {
        var effectCupcakes = baseNumPerEffect

        if (i < remainder) {
            //add one to this effect's number to account for the remainder
            ++effectCupcakes
        }

        var position = new Phaser.Point(game.world.centerX, game.world.centerY)

        //place the cupcake effects outward from the center at random angle, distance
        var distance = Math.random() * 128
        var angle = Math.random() * Math.PI * 2

        var offset = new Phaser.Point(Math.cos(angle), Math.sin(angle))

        offset.multiply(distance, distance)

        position = position.add(offset.x, offset.y)

        this.createScoreEffect(position, effectCupcakes)
    }
}
