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
  game.topBar = game.add.sprite(0, 0, 'bar')
  game.topBar.height = 100

  // Main score text
  game.scoreText = game.add.text(
    0,
    5,
    getCupcakesText(game.score), // 0 Cupcakes
    { font: '45px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 8 })
  game.scoreText.anchor.setTo(0.5, 0)

  // center text
  game.scoreText.x = game.world.centerX

  // Cupcakes-per-second text
  game.cpsText = game.add.text(
    0,
    60,
    getCupcakesPerSecondText(game.cupcakesPerSecond), // 0 per second
    { font: '20px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 5 })
  game.cpsText.anchor.setTo(0.5, 0)

  // center text
  game.cpsText.x = game.world.centerX

  // The big cupcake
  game.cupcake = game.add.button(0, 0, 'cupcake', cupcakeClick)
  game.cupcake.anchor.setTo(0.5, 0.5)
  game.cupcake.x = game.world.centerX
  game.cupcake.y = game.world.centerY

  // shop button
  game.shopButton = game.add.group()

  var shopButtonWidth = 360
  var shopButtonHeight = 60
  var shopButtonButton = game.add.button(
    -shopButtonWidth/2, -shopButtonHeight/2,
    'button-purple', shop)
  shopButtonButton.width = shopButtonWidth
  shopButtonButton.height = shopButtonHeight

  game.shopButton.add(shopButtonButton)

  var shopButtonText = game.add.text(
    0,
    0,
    'Buy Upgrades',
    { font: '30px sansus', fill: '#fff' })
  shopButtonText.x = -shopButtonText.width / 2
  shopButtonText.y = -shopButtonText.height / 2

  game.shopButton.add(shopButtonText)
  game.shopButton.y = 640 - 120 - 5
  game.shopButton.x = game.world.centerX


  // earn more cupcakes (share) button
  game.shareButton = game.add.group()

  var shareButtonWidth = 360
  var shareButtonHeight = 60
  var shareButtonButton = game.add.button(
    -shareButtonWidth/2, -shareButtonHeight/2,
    'button-green', invite)
  shareButtonButton.width = shareButtonWidth
  shareButtonButton.height = shareButtonHeight

  game.shareButton.add(shareButtonButton)

  var shareButtonText = game.add.text(
    0,
    0,
    'Earn More Cupcakes',
    { font: '30px sansus', fill: '#fff' })
  shareButtonText.x = -shareButtonText.width / 2
  shareButtonText.y = -shareButtonText.height / 2

  game.shareButton.add(shareButtonText)
  game.shareButton.y = 640 - 60
  game.shareButton.x = game.world.centerX

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
