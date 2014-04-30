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

    // TODO: use opts param
    button: function(text, game, x, y, img, onclick) {
      var button = game.add.group()

      var buttonButton = game.add.button(
        0, 0,
        img, onclick)
      buttonButton.anchor.setTo(0.5, 0.5)

      var buttonText = game.add.text(
        0, 0,
        text,
        { font: '30px sansus', fill: '#fff' })
      buttonText.anchor.setTo(0.5, 0.5)

      button.add(buttonButton)
      button.add(buttonText)
      button._buttonButton = buttonButton
      button._buttonText = buttonText
      button.x = x
      button.y = y

      return button

    },
    shopButton: function(game, onclick) {
      var button = UI.button('Buy Upgrades', game, game.world.centerX, 640 - 120 - 5, 'button-purple', onclick)
      button._buttonButton.width = 360
      button._buttonButton.height = 60

      return button
    },
    shareButton: function(game, onclick) {
      var button = UI.button('Earn More Cupcakes', game, game.world.centerX, 640 - 60, 'button-green', onclick)
      button._buttonButton.width = 360
      button._buttonButton.height = 60

      return button
    }
  }
})()
