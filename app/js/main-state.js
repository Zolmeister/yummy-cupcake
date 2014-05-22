'use strict';
var config = require('./config.js')
var Phaser = require('phaser')
var util = require('./util.js')
var updateScoreText = util.updateScoreText
var invite=require('./social.js' ).invite

module.exports = MainState

function MainState() {}

MainState.prototype.create = function() {
  var game = this.game

  var UI = require('./ui.js')(game)
  if (config.debug) {
    game.stage.disableVisibilityChange = true
  }

  // Add UI elements

  //game.topBar = UI.topBar(game)

  // Main score text
  game.scoreText = UI.scoreText(game)

  // Cupcakes-per-second text
  game.cpsText = UI.cpsText(game)

  // The big cupcake
  game.cupcake = UI.cupcake(game, null, game.upgrades['ribbon :)'] ? 'cupcake-ribbon' : 'cupcake')

  var tween = {}

  game.cupcake.events.onInputDown.add(function(el, pointer) {
    if (!tween.isRunning) {
      tween = game.add.tween(game.cupcake.scale)
        .to({ x: 0.93, y: 0.93 }, 100, Phaser.Easing.Cubic.Out, true, 0, 1, true)
    }

    // increment score
    game.score += game.cupcakesPerClick
    updateScoreText(game)

    var x = pointer.x + ( 0.5 - Math.random() ) * -60 // -30 to +30
    var y = pointer.y // probably don't need variance in the y
    var plusOne = game.add.text(
      x, y, '+' + game.cupcakesPerClick,
      { font: '25px sansus', align: 'center', fill: '#fff' })

    var cupcake = game.add.sprite(200 * Math.random() + x - 100, 200 * Math.random() + y - 100, 'cupcake')
    cupcake.anchor.setTo(0.5,0.5)
    cupcake.scale.x = 0.3
    cupcake.scale.y = 0.3
    cupcake.alpha = 0.7

    var cupcakeTime = Math.random() * 1500 + 1000
    game.add.tween(cupcake).to(
      { y: 200 * Math.random() + y - 100, x: 200 * Math.random() + x - 100, angle: Math.random() * 360 - 180, alpha: 0},
      cupcakeTime,
      Phaser.Easing.Cubic.Out, true)
      .onComplete.add(function () {
        if (cupcake.remove) {
          cupcake.remove()
        }
      })

    // slight random rotation
    plusOne.angle = -Math.random() * 10 + 5
    game.add.tween(plusOne).to(
      { y: -50 },
      Math.random() * 1500 + 2000,
      Phaser.Easing.Cubic.Out, true)
      .onComplete.add(function () {
        if (plusOne.remove) {
          plusOne.remove()
        }
      })
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
