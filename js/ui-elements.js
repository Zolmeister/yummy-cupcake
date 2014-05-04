var UI = (function() {
  return {
    scoreText: function(game) {
      return UI.element(game, 0, 0, {
        text: {
          x: game.world.centerX,
          y: 5,
          text: getCupcakesText(game.score),
          anchor: [0.5, 0],
          style: { font: '45px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 8 }
        }
      })._text
    },
    cpsText: function(game) {
      return UI.element(game, 0, 0, {
        text: {
          text: getCupcakesPerSecondText(game.cupcakesPerSecond),
          style: { font: '20px sansus', fill: '#ffffff', stroke: '#ee508c', strokeThickness: 5 },
          anchor: [0.5, 0],
          x: game.world.centerX,
          y: 60
        }
      })._text
    },
    cupcake: function(game, onclick, image) {
      return UI.element(game, 0, 0, {
        button: {
          key: image || 'cupcake',
          callback: onclick,
          anchor: [0.5, 0.5],
          x: game.world.centerX,
          y: game.world.centerY
        }
      })._button
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

    button: function(game, x, y, itemBg, itemDownBg, opts) {
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
    shopItemButton: function(item, onDragStart, onDragEnd, game, x, y, onclick) {

      // button background
      var itemBg = UI.rect(game, 250, 50, '#ecf0f1', 3)
      var itemDownBg = UI.rect(game, 250, 50, '#bdc3c7', 3)

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
    rect: function(game, width, height, color, radius) {
      var radius = radius || 0
      var x = 0
      var y = 0
      var itemBg = game.add.bitmapData(width, height)
      var ctx = itemBg.ctx
      ctx.fillStyle = color

      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()


      return itemBg
    },
    // ghetto / "jank"
  	// we should create an alert box UI that we can use across all games
    shareButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0')
      var itemDownBg = UI.rect(game, 250, 50, '#16A085')

      return UI.button(game, game.world.centerX, 640 - 120 - 5, itemBg, itemDownBg, {
        button: {
          key: itemBg,
          callback: onclick,
          x: game.world.centerX,
          y: 640 - 60
        },
        text: {
          text: '+500 when they join!'
        }
      })
    },
    shopButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0', 5)
      var itemDownBg = UI.rect(game, 250, 50, '#16A085', 5)

      return UI.button(game, game.world.centerX, 640 - 120 - 5, itemBg, itemDownBg, {
        button: {
          key: itemBg,
          callback: onclick
        },
        text: {
          text: 'Buy Upgrades'
        }
      })
    },
    backButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0', 5)
      var itemDownBg = UI.rect(game, 250, 50, '#16A085', 5)

      return UI.button(game, game.world.centerX, 550, itemBg, itemDownBg, {
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
    },
    shareButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#3498db', 5)
      var itemDownBg = UI.rect(game, 250, 50, '#2980b9', 5)

      return UI.button(game, game.world.centerX, 640 - 60, itemBg, itemDownBg, {
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
    }
  }
})()
