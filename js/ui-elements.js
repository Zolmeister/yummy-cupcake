var UI = (function() {
  return {
    topBar: function(game) {

      // Main score background bar
      var bar = game.add.sprite(0, 0, 'bar')
      bar.height = 100

      return bar
    },
    scoreText: function(game) {
      var text = game.add.text(
        game.world.centerX,
        5,
        getCupcakesText(game.score), // 0 Cupcakes
        { font: '45px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 8 })
      text.anchor.setTo(0.5, 0)
      return text
    },
    cpsText: function(game) {
      var text = game.add.text(
        game.world.centerX,
        60,
        getCupcakesPerSecondText(game.cupcakesPerSecond), // 0 per second
        { font: '20px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 5 })
      text.anchor.setTo(0.5, 0)

      return text
    },
    cupcake: function(game, onclick) {
      var cupcake = game.add.button(game.world.centerX, game.world.centerY, 'cupcake', onclick)
      cupcake.anchor.setTo(0.5, 0.5)

      return cupcake
    },
    shopButton: function(game, onclick) {
      var shopButton = game.add.group()

      var shopButtonWidth = 360
      var shopButtonHeight = 60
      var shopButtonButton = game.add.button(
        -shopButtonWidth/2, -shopButtonHeight/2,
        'button-purple', onclick)
      shopButtonButton.width = shopButtonWidth
      shopButtonButton.height = shopButtonHeight

      shopButton.add(shopButtonButton)

      var shopButtonText = game.add.text(
        0,
        0,
        'Buy Upgrades',
        { font: '30px sansus', fill: '#fff' })
      shopButtonText.x = -shopButtonText.width / 2
      shopButtonText.y = -shopButtonText.height / 2

      shopButton.add(shopButtonText)
      shopButton.y = 640 - 120 - 5
      shopButton.x = game.world.centerX

      return shopButton
    },
    shareButton: function(game, onclick) {
      var shareButton = game.add.group()

      var shareButtonWidth = 360
      var shareButtonHeight = 60
      var shareButtonButton = game.add.button(
        -shareButtonWidth/2, -shareButtonHeight/2,
        'button-green', onclick)
      shareButtonButton.width = shareButtonWidth
      shareButtonButton.height = shareButtonHeight

      shareButton.add(shareButtonButton)

      var shareButtonText = game.add.text(
        0,
        0,
        'Earn More Cupcakes',
        { font: '30px sansus', fill: '#fff' })
      shareButtonText.x = -shareButtonText.width / 2
      shareButtonText.y = -shareButtonText.height / 2

      shareButton.add(shareButtonText)
      shareButton.y = 640 - 60
      shareButton.x = game.world.centerX
    }
  }
})()
