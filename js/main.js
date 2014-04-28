// note that function calls within update are not optimized,
// and should be in-lined during some compile step
var config = {
  debug: false
}

var game = new Phaser.Game(360, 640, Phaser.CANVAS, 'game', false, transparent = !config.debug)
game.score = 0
game.cupcakesPerSecond = 0
game.cupcakesPerClick = 1

function getCupcakesText(n) {
  return n + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n + ' per second'
}

game.state.add('setup', {
  create: function() {
      // In debug mode, set the background color offset to see canvas
     //if(config.debug)
      	game.stage.backgroundColor = '#71c5cf'

      // Auto scaling
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      game.scale.setScreenSize(true)

      if (config.debug)
        game.stage.disableVisibilityChange = true

			grabImageAssets( function() {
	      //game.state.start('main')
	      game.state.start('shop')
			})
    }
})

game.state.add('main', {

    preload: function() {
      loadMainStateAssets(game)
    },

    create: function() {


      if (config.debug)
        game.stage.disableVisibilityChange = true


      // Add UI elements
      
      // Main score background bar
      game.topBar = game.add.sprite(0, 0, 'bar')

      // Main score text
      game.scoreText = game.add.text(
        0,
        -10,
        getCupcakesText(game.score), // 0 Cupcakes
        { font: '45px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 8 })
      game.scoreText.anchor.setTo(0.5, 0)

      // center text
      game.scoreText.x = game.world.centerX

      // Cupcakes-per-second text
      game.cpsText = game.add.text(
        0,
        38,
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

    },

    update: function() {
      loop()
    }
})

game.state.add('shop', {
  preload: function() {
    game.load.image('button-green', 'assets/button-green.png')
    game.load.image('button-purple', 'assets/button-purple.png')
  },
  create: function() {

    // shop items
    var bmd = game.add.bitmapData(200, 50);

    bmd.context.fillStyle = 'rgba(0, 250, 180, 1)'
    bmd.context.fillRect(0,0,200, 50)

    //	Add the bmd as a texture to an Image object.
    //	If we don't do this nothing will render on screen.
    //game.add.sprite(0, 0, bmd);

    game.buttons = []
    var buttons = game.buttons
    for (var i=0; i < 12; i++) {
      buttons.push(game.add.button(
      90, 80+i*52,
      bmd, function() {
        // TODO: disable if button is not actually visible (masked)
        // buy item
        if (!game.tracked)
        console.log('buying', i)

        game.tracked = false

      }))
    }
    game.items = game.add.group()
    var items = game.items
    buttons.map(function(btn) {
      btn.anchor.setTo(0.5, 0)
      btn.x = game.world.centerX
      btn.input.enableDrag()
      var origX = btn.x
      var origY = btn.y
      btn.events.onDragStart.add(function(btn, pointer){
        game.tracking = true
        game.trackingOrigX = pointer.x
        game.trackingOrigY = pointer.y
        game.trackingElX = btn.x
        game.trackingElY = btn.y
        game.trackingEl = btn
        game.trackingStart = true
      })
      btn.events.onDragStop.add(function(btn, pointer){
        game.tracking = false
        game.trackingEl.x = game.trackingElX
        game.trackingEl.y = game.trackingElY
      })
      items.add(btn)
    })

    // This is a mask so that the buttons are hidden
    // if they are outside the 'shop' bounding box
    var graphics = game.add.graphics(0, 0)
    graphics.moveTo(game.world.centerX - 100, 80)
    graphics.lineTo(game.world.centerX - 100, 450)
    graphics.lineTo(game.world.centerX + 100, 450)
    graphics.lineTo(game.world.centerX + 100, 80)

    items.mask = graphics


    // Title text
    game.scoreText = game.add.text(
      0,
      10,
      'Store',
      { font: '45px sansus', fill: '#fff' })
    game.scoreText.anchor.setTo(0.5, 0)
    game.scoreText.x = game.world.centerX



    // back button
    game.shopButton = game.add.group()

    var shopButtonWidth = 170
    var shopButtonHeight = 60
    var shopButtonButton = game.add.button(
      -shopButtonWidth/2, -shopButtonHeight/2,
      'button-green', function() {
        game.state.start('main')
      })
    shopButtonButton.width = shopButtonWidth
    shopButtonButton.height = shopButtonHeight

    game.shopButton.add(shopButtonButton)

    var shopButtonText = game.add.text(
      0,
      0,
      'Back',
      { font: '30px sansus', fill: '#fff' })
    shopButtonText.x = -shopButtonText.width / 2
    shopButtonText.y = -shopButtonText.height / 2

    game.shopButton.add(shopButtonText)
    game.shopButton.y = 550
    game.shopButton.x = game.world.centerX
  },
  update: function() {
    if (game.tracking && game.input.activePointer.isDown) {
      if (game.trackingStart &&
          (game.input.activePointer.y > game.trackingOrigY + 5 ||
           game.input.activePointer.y < game.trackingOrigY - 5 )) {
        game.trackingStart = false
        game.tracked = true
      } else if (!game.trackingStart) {
        var y = game.input.activePointer.y

        var dy = y - game.trackingOrigY
        game.trackingOrigY = y
        game.items.y+=dy

        if (game.items.y >  0) {
          game.items.y = 0
        }
        if (game.items.y <  -(game.buttons.length*52 - 370)) {
          game.items.y = -(game.buttons.length*52 - 370)
        }

      }

      game.trackingEl.x = game.trackingElX
      game.trackingEl.y = game.trackingElY
    }
  }
})

function incrementScore() {
	game.score += game.cupcakesPerClick
  game.scoreText.setText(game.score + ' Cupcakes')
}

function shop() {
  console.log('SHOP')
  game.state.start('shop')
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

function loop() {

}

