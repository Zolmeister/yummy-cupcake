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

      // Auto scaling
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      game.scale.setScreenSize(true)

      if (config.debug)
        game.stage.disableVisibilityChange = true


      // Add UI elements

      // Main score text
      game.scoreText = game.add.text(
        game.world.centerX -
        100,
        10,
        getCupcakesText(0), // 0 Cupcakes
        { font: '45px sansus', fill: '#fff' })


      // Cupcakes-per-second text
      game.cpsText = game.add.text(
        game.world.centerX -
        30,
        50,
        getCupcakesPerSecondText(game.score), // 0 per second
        { font: '25px sansus', fill: '#fff' })

      // The big cupcake
      game.cupcake = game.add.button(250, 320, 'cupcake', cupcakeClick, this, 2, 1, 0)
      game.cupcake.anchor.setTo(0.5, 0.5)
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7

      // shop button
      game.shopButton = game.add.group()
      var shopButtonButton = game.add.button(0, 0, 'button', shop, 2, 1, 0)
      shopButtonButton.width = 170
      shopButtonButton.height = 60

      game.shopButton.add(shopButtonButton)

      var shopButtonText = game.add.text(
        30,
        0,
        'Shop',
        { font: '30px sansus'})

      game.shopButton.add(shopButtonText)
      game.shopButton.x = 160
      game.shopButton.y = 500

    },

    update: function() {
      loop()
    }
})

function shop() {
  console.log('SHOP')
}

function cupcakeClick(button, pointer) {
  game.cupcakeCount++
  game.scoreText.setText(game.cupcakeCount + ' Cupcakes')

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


