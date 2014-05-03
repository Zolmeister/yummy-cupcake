var UI = (function() {
  return {
    topBar: function(game) {

      // Main score background bar
      var bar = game.add.sprite(0, 0, 'bar')
      bar.height = 100
      bar.width = 360

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
    cupcake: function(game, onclick, image) {
      var cupcake = game.add.button(game.world.centerX, game.world.centerY, image || 'cupcake', onclick)
      cupcake.anchor.setTo(0.5, 0.5)

      return cupcake
    },

    // TODO: use opts param
    button: function(text, game, x, y, img, onclick) {
      var button = game.add.group()

      var buttonButton = game.add.button(
        0, 0,
        img, onclick, game, 0, 0, 1)
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
    shopItemButton: function(item, onDragStart, onDragEnd, game, x, y, onclick) {

      // button background
      var itemBg = game.add.bitmapData(250, 50)
      itemBg.context.fillStyle = 'rgba(255, 232, 247, 1)'
      itemBg.context.fillRect(0,0, 250, 50)

      var itemOverBg = game.add.bitmapData(250, 50)
      itemOverBg.context.fillStyle = 'rgba(255, 230, 230, 1)'
      itemOverBg.context.fillRect(0,0, 250, 50)

      var itemDownBg = game.add.bitmapData(250, 50)
      itemDownBg.context.fillStyle = 'rgba(244, 220, 220, 1)'
      itemDownBg.context.fillRect(0,0, 250, 50)

      // The button group that elements will be added to
      var btn = game.add.group()

      var button = game.add.button(
        0, 0,
        itemBg)
      button.anchor.setTo(0.5, 0)

      var name = game.add.text(
        -115, 15,
        item.name,
        {font: '20px sansus'})
      name.anchor.setTo(0, 0)

      var cost = game.add.text(
        30, 5,
        getItemCost(item)+'',
        {font: '20px sansus'})
      cost.anchor.setTo(0, 0)

      var cupcake = game.add.sprite(15, 5, 'cupcake')
      cupcake.width = 12
      cupcake.height = 16

      var cps = item.cps ? game.add.text(
        15, 25,
        '+'+item.cps,
        {font: '20px sansus'}) : game.add.text(
        15, 25,
        item.action,
        {font: '20px sansus'})


      if (item.cost.toString().length > 9) {
        cost.setStyle({
          font: '16px sansus'
        })
        cps.setStyle({
          font: '16px sansus'
        })
      }

      btn.add(button)
      btn.add(name)
      btn.add(cost)
      btn.add(cps)
      btn.add(cupcake)

      btn.x = x
      btn.y = y

      button.input.enableDrag()
      button.events.onInputUp.add(function(el, pointer) {
        button.loadTexture(itemBg)
        onclick && onclick(el, pointer, {
          costText: cost
        })
      })

      btn.c_reset = function() {
        button.loadTexture(itemBg)
      }
      button.events.onInputOver.add(function(el, pointer) {
        button.loadTexture(itemOverBg)
      })
      button.events.onInputDown.add(function(el, pointer) {
        button.loadTexture(itemDownBg)
      })
      button.events.onInputOut.add(function(el, pointer) {
        btn.c_reset()
      })
      button.events.onDragStart.add(onDragStart)
      button.events.onDragStop.add(onDragEnd)

      return btn
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
