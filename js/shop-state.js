function ShopState() {}

ShopState.prototype.preload = function() {
  game.load.image('button-green', 'assets/button-green.png')
  game.load.image('bar', game.svgs.bar)
  game.load.image('cupcake', game.svgs.cupcake)
}

ShopState.prototype.create = function() {

    // Main score background bar
    game.topBar = game.add.sprite(0, 0, 'bar')
    game.topBar.height = 100

    var bmd = game.add.bitmapData(250, 50)

    bmd.context.fillStyle = 'rgba(255, 232, 247, 1)'
    bmd.context.fillRect(0,0, 250, 50)

    var bg = game.add.bitmapData(280, 410)
    bg.context.fillStyle = 'rgba(240, 172, 55, 1)'
    bg.context.fillRect(0,0, 280, 410)
    var backgroundSprite = game.add.image(40, 105, bg)



    //	Add the bmd as a texture to an Image object.
    //	If we don't do this nothing will render on screen.
    //game.add.sprite(0, 0, bmd);

    game.buttons = []
    var buttons = game.buttons

    game.items = game.add.group()
    var items = game.items
    var nextHidden = false;

    for(var i=0; i < game.shopItemList.length; i++) {
      if (nextHidden) break

      ;(function(i){
        var item = game.shopItemList[i]
        var btn = game.add.group()

        var button = game.add.button(
        0, 0,
        bmd, function() {
            var item = game.shopItemList[i]
            // TODO: disable if button is not actually visible (masked)
            // buy item
            if (!game.tracked) {
              console.log('buying', item.name)

              if (game.score >= getItemCost(item)) {
                item.owned += 1
                game.cupcakesPerSecond += item.cps

                cost.setText(getItemCost(item))
                game.cpsText.setText(getCupcakesPerSecondText(game.cupcakesPerSecond))
                game.dirty = true
              }
            }

            game.tracked = false
          })

        button.anchor.setTo(0.5, 0)

        var name = game.add.text(
        -115, 15,
        item.name,
          {font: '20px sansus'})
        name.anchor.setTo(0, 0)
        if (game.score >= getItemCost(item)) {
          item.visible = true
        }
        if (!item.visible && !nextHidden) {
          name.setText('???')
          nextHidden = true
        }

        /*var count = game.add.text(
        0, 0,
        game.shopItemList[i].owned+'',
          {font: '20px sansus'})
        count.anchor.setTo(0, 0)
        count.x = 40
        count.y = 12*/

        var cost = game.add.text(
        0, 0,
        getItemCost(game.shopItemList[i])+'',
          {font: '20px sansus'})
        cost.anchor.setTo(0, 0)
        cost.x = 30
        cost.y = 5

        var cupcake = game.add.sprite(15, 5, 'cupcake')
        cupcake.width = 12
        cupcake.height = 16

        var cps = game.add.text(
        15, 25,
        '+'+game.shopItemList[i].cps,
          {font: '20px sansus'})


        if (game.shopItemList[i].cost.toString().length > 9) {
          cost.setStyle({
            font: '16px sansus'
          })
          cps.setStyle({
            font: '16px sansus'
          })
        }


        btn.add(button)
        btn.add(name)
        //btn.add(count)
        btn.add(cost)
        btn.add(cps)
        btn.add(cupcake)

        btn.x = game.world.centerX
        btn.y = 120+i*52

        button.input.enableDrag()
        var origX = btn.x
        var origY = btn.y
        button.events.onDragStart.add(function(btn, pointer){
          game.tracking = true
          game.trackingOrigX = pointer.x
          game.trackingOrigY = pointer.y
          game.trackingElX = btn.x
          game.trackingElY = btn.y
          game.trackingEl = btn
          game.trackingStart = true
        })
        button.events.onDragStop.add(function(btn, pointer){
          game.tracking = false
          game.trackingEl.x = game.trackingElX
          game.trackingEl.y = game.trackingElY
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
    game.scoreText = game.add.text(
      0,
      5,
      getCupcakesText(game.scoreTextScore), // 0 Cupcakes
      { font: '45px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 8 })
    game.scoreText.anchor.setTo(0.5, 0)
    game.scoreText.x = game.world.centerX

    // Title text
    game.cpsText = game.add.text(
        0,
        60,
        getCupcakesPerSecondText(game.cupcakesPerSecond), // 0 per second
        { font: '20px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 5 })
      game.cpsText.anchor.setTo(0.5, 0)

      // center text
      game.cpsText.x = game.world.centerX



    // back button
    game.shopButton = game.add.group()

    var shopButtonWidth = game.world.width
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
      if (game.items.y <  -(game.buttons.length*52 - 370)) {
        game.items.y = -(game.buttons.length*52 - 370)
      }

    }

    game.trackingEl.x = game.trackingElX
    game.trackingEl.y = game.trackingElY
  }
}
