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

    // TODO: nested element support, and multiple of same type support
    element: function(game, x, y, opts) {

      var el = game.add.group()
      el.x = x
      el.y = y

      var defaults = {
        button: {
          __constructor: ['x', 'y', 'key', 'callback', 'callbackContext',
                          'overFrame', 'outFrame', 'downFrame', 'upFrame'],
          x: 0,
          y: 0,
          key: null,
          callback: _.noop,
          callbackContext: null,
          overFrame: 0,
          outFrame: 0,
          downFrame: 0,
          upFrame: 0
        },
        text: {
          __constructor: ['x', 'y', 'text', 'style'],
          x: 0,
          y: 0,
          text: '',
          style: {}
        }
      }

      // TODO: clean this up...
      var skipKeys = ['anchor']

      _.forEach(_.keys(opts), function(key) {
        var objectOpts = _.defaultsDeep(opts[key], defaults[key])

        var constructorParams = _.map(objectOpts.__constructor, function(constructorKey) {
          return objectOpts[constructorKey]
        })

        var object = game.add[key].apply(game.add, constructorParams)

        var nonConstructorKeys = _.omit(_.keys(objectOpts), objectOpts.__constructor.concat('__constructor'))

        _.forEach(nonConstructorKeys, function(key) {
          if (_.contains(skipKeys, key)) {
            return
          }
          object[key] = objectOpts[key]
        })

        if (objectOpts.anchor) {
          object.anchor.setTo.apply(object.anchor, objectOpts.anchor)
        }

        el.add(object)
        el['_' + key] = object
      })

      return el

    },

    button2: function(game, x, y, itemBg, itemDownBg, opts) {
      var defaults = {
        button: {
          x: 0,
          y: 0,
          anchor: [0.5, 0.5],
          width: 360,
          height: 60
        },
        text: {
          text: '',
          anchor: [0.5, 0.5],
          style: { font: '30px sansus', fill: '#fff' }
        }
      }

      var button = UI.element(game, x, y, _.defaultsDeep(opts, defaults))

      button._button.events.onInputDown.add(function(el, pointer) {
        button._button.loadTexture(itemDownBg)
      })
      button._button.events.onInputOut.add(function(el, pointer) {
        button._button.loadTexture(itemBg)
      })
      button._button.events.onInputUp.add(function(el, pointer) {
        button._button.loadTexture(itemBg)
      })

      return button
    },

    // TODO: use opts param
    button: function(text, game, x, y, img, onclick) {

      return UI.element(game, x, y, {
        button: {
          x: 0,
          y: 0,
          key: img,
          callback: onclick,
          anchor: [0.5, 0.5],
          width: 360,
          height: 60
        },
        text: {
          text: text,
          anchor: [0.5, 0.5],
          style: { font: '30px sansus', fill: '#fff' }
        }
      })
    },
    shopItemButton: function(item, onDragStart, onDragEnd, game, x, y, onclick) {

      // button background
      var itemBg = game.add.bitmapData(250, 50)
      itemBg.context.fillStyle = '#ecf0f1'
      itemBg.context.fillRect(0,0, 250, 50)

      var itemDownBg = game.add.bitmapData(250, 50)
      itemDownBg.context.fillStyle = '#bdc3c7'
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
    rect: function(game, width, height, color) {
      var itemBg = game.add.bitmapData(width, height)
      itemBg.context.fillStyle = color
      itemBg.context.fillRect(0, 0, width, height)
      return itemBg
    },
    shopButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0')
      var itemDownBg = UI.rect(game, 250, 50, '#16A085')

      var button = UI.button2(game, game.world.centerX, 640 - 120 - 5, itemBg, itemDownBg, {
        button: {
          key: itemBg,
          callback: onclick
        },
        text: {
          text: 'Buy Upgrades'
        }
      })

      return button
    },
    backButton: function(game, onclick, w, h) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0')
      var itemDownBg = UI.rect(game, 250, 50, '#16A085')

      var button = UI.button2(game, game.world.centerX, 550, itemBg, itemDownBg, {
        button: {
          key: itemBg,
          callback: onclick,
          width: game.world.width,
          height: 60
        },
        text: {
          text: 'Buy Upgrades'
        }
      })

      return button
    },
    shareButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#3498db')
      var itemDownBg = UI.rect(game, 250, 50, '#2980b9')

      var button = UI.button2(game, game.world.centerX, 640 - 60, itemBg, itemDownBg, {
        button: {
          key: itemBg,
          callback: onclick,
          width: game.world.width,
          height: 60
        },
        text: {
          text: 'Earn More Cupcakes'
        }
      })

      return button
    }
  }
})()
