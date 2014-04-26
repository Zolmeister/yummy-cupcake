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
      game.load.image('cupcake', this.url)
      game.load.image('button', 'assets/button.png')

      game.stage.backgroundColor = '#71c5cf'
    },

    create: function() {
    	
      // This function will be called after the preload function. Here we set up the game, display sprites, add labels, etc.
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

      game.scale.setScreenSize(true);

      if (debug)
        this.stage.disableVisibilityChange = true;

      var scoreText = '0 Cupcakes'
      var scoreTextStyle = { font: '45px sansus', align: 'center', fill: '#fff' }
      var cpsText = '0 per second'
      var cpsStyle =  { font: '25px sansus', align: 'center', fill: '#fff' }

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


      game.shopButton = game.add.button(100, 400, 'button', shop, 2, 1, 0);
      game.shopButton.width = 170
      game.shopButton.height = 60
      game.shopButton.x += 60
      game.shopButton.y += 100

      var shopButtonStyle = { font: '30px sansus', align: 'center' }
      game.shopButtonText = game.add.text(game.shopButton.position.x + game.shopButton.width / 2 - 30, // 30 is what i'm guessing 'Shop' width is. not calculating 
                                          game.shopButton.y + 10, 'Shop', shopButtonStyle);
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

  var plusOneStyle =  { font: '25px sansus', align: 'center', fill: '#fff' }
  // add some variance in the +1 position (but still near tap)
  var x = pointer.x + ( 0.5 - Math.random() ) * -60 // -30 to +30
  var y = pointer.y // probably don't need variance in the y
  var plusOne = game.add.text(x, y, '+1', plusOneStyle)
  game.add.tween(plusOne).to({ y: -50 }, Math.random() * 1500 + 2000, Phaser.Easing.Cubic.Out, true);

}

function loop() {


}

function invite() {
	// TODO: Clay.Social.smartInvite()?
	Clay.Kik.invite()
}

// TODO: probably should have some sort of class/obj we can attach things to
// all possible items. guessing you're going to re-implement this somewhere
var items = ['cherry', 'ribbon', 'straw', 'sprinkles']
function grabCupcakeSVG(options, callback) {
	var width = options.width
	var height = options.height
	// Necessary to grab the XML of the svg
	var xhr = new XMLHttpRequest()
	xhr.onload = function() {
		// parse as XML instead of a string
		var svgAsXml = xhr.responseXML
		// find the elements we want to remove
		var shownItems = options.items
		for (var i = 0, j = items.length; i < j; i++) {
			var item = items[i]
			if(shownItems.indexOf(item) !== -1)
				continue // skip hiding any item we specified
			var $toHide = svgAsXml.getElementById(item)
			$toHide.style.display = 'none'
		}
		// change xml back to string
		var svgAsString = new XMLSerializer().serializeToString(svgAsXml)
		var svgBlob = new Blob([svgAsString], {type: 'image/svg+xml;charset=utf-8'})
		// since phaser doesn't support svg, we have to convert to a png of the right size
		var canvas = document.createElement('canvas')
		canvas.width = width * window.devicePixelRatio
		canvas.height = height * window.devicePixelRatio
		canvas.style.width = width + 'px'
		canvas.style.height = height + 'px'
		var ctx = canvas.getContext('2d')
		var img = new Image()
		// set the img src to the xml string
		img.src = window.URL.createObjectURL(svgBlob)
		img.onload = function() {
			// draw svg to canvas
			ctx.drawImage(img, 0, 0, width, height)
			// canvas to png
			callback(canvas.toDataURL('images/png'))			
		}
	}
	xhr.open('GET', '/assets/pink.svg')
	xhr.responseType = 'document'
	xhr.send()
}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state)

grabCupcakeSVG({ width: 326, height: 463, items: ['cherry', 'straw', 'sprinkles'] }, function(url) {
	main_state.url = url
	game.state.start('main')
})