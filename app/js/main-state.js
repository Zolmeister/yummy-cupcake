/*global game, UI*/
var config = require('./config.js')
var Phaser = require('phaser')
var util = require('./util.js')
var updateScoreText = util.updateScoreText
var invite = require('./social.js').invite

module.exports = MainState

function MainState() {}

MainState.prototype.preload = function() {}

MainState.prototype.create = function() {
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

    incrementScore()

    var x = pointer.x + ( 0.5 - Math.random() ) * -60 // -30 to +30
    var y = pointer.y // probably don't need variance in the y
    var plusOne = game.add.text(
      x, y, '+' + game.cupcakesPerClick,
      { font: '25px sansus', align: 'center', fill: '#fff' })

    // slight random rotation
    plusOne.angle = -Math.random() * 10 + 5
    game.add.tween(plusOne).to(
      { y: -50 },
      Math.random() * 1500 + 2000,
      Phaser.Easing.Cubic.Out, true)
  })

  // shop button
  game.shopButton = UI.shopButton(game, shop)

  // earn more cupcakes (share) button
  game.shareButton = UI.shareButton(game, invite)

}

MainState.prototype.update = function() {
  // nothing here
}

function shop() {
  game.state.start('shop')
}

function incrementScore() {
	game.score += game.cupcakesPerClick
  updateScoreText(game)
}
