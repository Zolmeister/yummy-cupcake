function ShopState() {}

ShopState.prototype.preload = function() {
  game.load.image('button-green', 'assets/button-green.png')
  game.load.image('bar', game.svgs.bar)
  game.load.image('cupcake', game.svgs.cupcake)
}

ShopState.prototype.create = function() {

    // Main score background bar
    game.topBar = UI.topBar(game)

    var shopBg = game.add.bitmapData(280, 410)
    shopBg.context.fillStyle = 'rgba(240, 172, 55, 1)'
    shopBg.context.fillRect(0,0, 280, 410)
    var shopBgSprite = game.add.image(40, 105, shopBg)

    game.shopItemButtons = []
    var buttons = game.shopItemButtons

    game.items = game.add.group()
    var items = game.items
    var nextHidden = false

    for(var i = 0; i < game.shopItemList.length; i++) {
      if (nextHidden) break

      ;(function(i) {
        var item = game.shopItemList[i]

        if (game.score >= getItemCost(item)) {
          item.visible = true
        }
        if (!item.visible && !nextHidden) {
          item = _.clone(item)
          item.name = '???'
          nextHidden = true
        }

        var btn = UI.shopItemButton(
          item,
          function(btn, pointer) {
            game.tracking = true
            game.trackingOrigX = pointer.x
            game.trackingOrigY = pointer.y
            game.trackingElX = btn.x
            game.trackingElY = btn.y
            game.trackingEl = btn
            game.trackingStart = true
          },
          function(btn, pointer) {
            game.tracking = false
            game.trackingEl.x = game.trackingElX
            game.trackingEl.y = game.trackingElY
          },
          game, game.world.centerX,
          120+i*52, function(button, pointer, elements) {
            var costText = elements.costText

          // TODO: disable if button is not actually visible (masked)
          // buy item
          if (!game.tracked) {
            console.log('buying', item.name)

            if (game.score >= getItemCost(item)) {
              item.owned += 1
              game.cupcakesPerSecond += item.cps

              costText.setText(getItemCost(item))
              game.cpsText.setText(getCupcakesPerSecondText(game.cupcakesPerSecond))
              game.dirty = true
            }
          }

          game.tracked = false
        })

        items.add(btn)

        buttons.push(btn)
      })(i)
    }


    // This is a mask so that the buttons are hidden
    // if they are outside the 'shop' bounding box
    var graphics = game.add.graphics(0, 0)
    graphics.moveTo(game.world.centerX - 125, 120)
    graphics.lineTo(game.world.centerX - 125, 500)
    graphics.lineTo(game.world.centerX + 125, 500)
    graphics.lineTo(game.world.centerX + 125, 120)

    items.mask = graphics


    // Main score text
    game.scoreText = UI.scoreText(game)

    // Cupcakes-per-second text
    game.cpsText = UI.cpsText(game)


    // back button
    game.backButton = UI.button(
      'Back',
      game,
      game.world.centerX,
      550,
      'button-green',
      function() {
        game.state.start('main')
      }
    )

    game.backButton._buttonButton.width = game.world.width
    game.backButton._buttonButton.height = 60

}

ShopState.prototype.update = function() {
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
      if (game.items.y <  -(game.shopItemButtons.length*52 - 370)) {
        game.items.y = -(game.shopItemButtons.length*52 - 370)
      }

    }

    game.trackingEl.x = game.trackingElX
    game.trackingEl.y = game.trackingElY
  }
}
