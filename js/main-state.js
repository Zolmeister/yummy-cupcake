function MainState() {}

MainState.prototype.preload = function() {
  game.load.image('cupcake', game.svgs.cupcake)
  game.load.image('bar', game.svgs.bar)
  game.load.image('button-green', 'assets/button-green.png')
  game.load.image('button-purple', 'assets/button-purple.png')
}

MainState.prototype.create = function() {
  if (config.debug) {
    game.stage.disableVisibilityChange = true
  }

  // Add UI elements
  // Main score background bar
  game.topBar = UI.topBar(game)

  // Main score text
  game.scoreText = UI.scoreText(game)

  // Cupcakes-per-second text
  game.cpsText = UI.cpsText(game)

  // The big cupcake
  game.cupcake = UI.cupcake(game, cupcakeClick)

  // shop button
  game.shopButton = UI.shopButton(game, shop)

  // earn more cupcakes (share) button
  game.shareButton = UI.shareButton(game, invite)

}

MainState.prototype.update = function() {
  // nothing here
}

function cupcakeClick(button, pointer) {
  incrementScore()

  if (!game.cupcakeDown) {
    game.cupcakeDown =  game.time.events.loop(100, function() {
      game.cupcake.scale.x = 1
      game.cupcake.scale.y = 1

      game.time.events.remove(game.cupcakeDown)
      game.cupcakeDown = null
    })
    game.cupcake.scale.x -= 0.05
    game.cupcake.scale.y -= 0.05
  }

  // spawn +1 near the mouse

  // add some variance in the +1 position (but still near tap)
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

}

function shop() {
  game.state.start('shop')
}

function incrementScore() {
	game.score += game.cupcakesPerClick
  updateScoreText(game)
}
