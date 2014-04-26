// not that function calls within update are not optimized,
// and should be in-lined during some compile step
var debug = true

// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game')

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {

    preload: function() {
      // Everything in this function will be executed at the beginning. That’s where we usually load the game’s assets (images, sounds, etc.)

      // Load a sprite in the game
      // Parameters: name of the sprite, path to the image
      game.load.image('cupcake', 'assets/cupcake.png')
      game.load.image('button', 'assets/button.png')

      game.stage.backgroundColor = '#71c5cf'
    },

    create: function() {
      // This function will be called after the preload function. Here we set up the game, display sprites, add labels, etc.
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

      game.scale.setScreenSize(true);

      if (debug)
        this.stage.disableVisibilityChange = true;

      var scoreText = "0 Cupcakes"
      var scoreTextStyle = { font: "45px Arial", align: "center" }
      var cpsText = '0 per second'
      var cpsStyle =  { font: "25px Arial", align: "center" }

      game.cupcakeCount = 0
      game.scoreText = game.add.text(game.world.centerX-300, 10, scoreText, scoreTextStyle)
      game.cpsText = game.add.text(game.world.centerX-300, 50, cpsText, cpsStyle);

      game.scoreText.x=game.world.centerX-100
      game.cpsText.x = game.world.centerX-100

      game.cupcake = game.add.button(100, 400, 'cupcake', cupcakeClick, this, 2, 1, 0);
      game.cupcake.anchor.setTo(.5,.5)
      game.cupcake.y = 320
      game.cupcake.x = 250
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7


      game.shopButtom = game.add.button(100, 400, 'button', shop, 2, 1, 0);
      game.shopButtom.width = 170
      game.shopButtom.height = 60
      game.shopButtom.x += 60
      game.shopButtom.y += 100

      game.shopButtonText = game.add.text(game.shopButtom.x + 50,
                                          game.shopButtom.y +10, 'Shop', {});
    },

    update: function() {
      loop()
    }
}
function shop() {
  console.log('SHOP')

}
function cupcakeClick(button, pointer) {
  game.cupcakeCount++
  game.scoreText.setText(game.cupcakeCount + ' Cupcakes')

  if (!game.cupcakeDown) {
    game.cupcakeDown =  game.time.events.loop(100, function(){
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7

      game.time.events.remove(game.cupcakeDown);
      game.cupcakeDown = null
    });
    game.cupcake.scale.x -= 0.05
    game.cupcake.scale.y -= 0.05
  }

  // spawn +1 near the mouse
  //pointer.x

  var plusOneStyle =  { font: "25px Arial", align: "center" }
  var plusOne = game.add.text(pointer.x, pointer.y, '+1', plusOneStyle)
  game.add.tween(plusOne).to({ y: -50 }, Math.random() * 1500 + 2000, Phaser.Easing.Cubic.Out, true);

}

function loop() {


}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state)
game.state.start('main')
