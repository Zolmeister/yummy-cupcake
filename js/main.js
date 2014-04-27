// note that function calls within update are not optimized,
// and should be in-lined during some compile step
var config = {
  debug: true
}

var game = new Phaser.Game(360, 640, Phaser.AUTO, 'game')
game.score = 0

function getCupcakesText(n) {
  return n + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n + ' per second'
}

game.state.add('main', {

    preload: function() {
      loadMainStateAssets(game)
    },

    create: function() {

      // In debug mode, set the background color offset to see canvas
      game.stage.backgroundColor = config.debug ? '#71A9CF' : '#71c5cf'

      // Auto scaling
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      game.scale.setScreenSize(true)

      if (config.debug)
        game.stage.disableVisibilityChange = true


      // Add UI elements

      // Main score text
      game.scoreText = game.add.text(
        0,
        10,
        getCupcakesText(0), // 0 Cupcakes
        { font: '45px sansus', fill: '#fff' })
      game.scoreText.anchor.setTo(0.5, 0)

      // center text
      game.scoreText.x = game.world.centerX

      // Cupcakes-per-second text
      game.cpsText = game.add.text(
        0,
        55,
        getCupcakesPerSecondText(game.score), // 0 per second
        { font: '20px sansus', fill: '#fff' })
      game.cpsText.anchor.setTo(0.5, 0)

      // center text
      game.cpsText.x = game.world.centerX

      // The big cupcake
      game.cupcake = game.add.button(0, 0, 'cupcake', cupcakeClick)
      game.cupcake.anchor.setTo(0.5, 0.5)
      game.cupcake.x = game.world.centerX
      game.cupcake.y = game.world.centerY
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7

      // shop button
      game.shopButton = game.add.group()

      var shopButtonWidth = 170
      var shopButtonHeight = 60
      var shopButtonButton = game.add.button(
        -shopButtonWidth/2, -shopButtonHeight/2,
        'button', shop)
      shopButtonButton.width = shopButtonWidth
      shopButtonButton.height = shopButtonHeight

      game.shopButton.add(shopButtonButton)

      var shopButtonText = game.add.text(
        0,
        0,
        'Shop',
        { font: '30px sansus', fill: '#fff' })
      shopButtonText.x = -shopButtonText.width / 2
      shopButtonText.y = -shopButtonText.height / 2

      game.shopButton.add(shopButtonText)
      game.shopButton.y = 550
      game.shopButton.x = game.world.centerX

    },

    update: function() {
      loop()
    }
})

function shop() {
  console.log('SHOP')
}

function cupcakeClick(button, pointer) {
  game.score++
  game.scoreText.setText(game.score + ' Cupcakes')

  if (!game.cupcakeDown) {
    game.cupcakeDown =  game.time.events.loop(100, function() {
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7

      game.time.events.remove(game.cupcakeDown)
      game.cupcakeDown = null
    })
    game.cupcake.scale.x -= 0.05
    game.cupcake.scale.y -= 0.05
  }

  // spawn +1 near the mouse

  var plusOneStyle =  { font: '25px sansus', align: 'center', fill: '#fff' }
  // add some variance in the +1 position (but still near tap)
  var x = pointer.x + ( 0.5 - Math.random() ) * -60 // -30 to +30
  var y = pointer.y // probably don't need variance in the y
  var plusOne = game.add.text(x, y, '+1', plusOneStyle)
  game.add.tween(plusOne).to(
    { y: -50 },
    Math.random() * 1500 + 2000,
    Phaser.Easing.Cubic.Out, true)

}

function loop() {

}


