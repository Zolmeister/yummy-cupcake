var UI = (function() {
  return {
    scoreText: function(game) {
      return UI.element(game, 0, 0, {
        text: {
          type: 'text',
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
          type: 'text',
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
          type: 'button',
          key: image || 'cupcake',
          callback: onclick,
          anchor: [0.5, 0.5],
          x: game.world.centerX,
          y: game.world.centerY
        }
      })._button
    },

    // TODO: nested element support, and multiple of same type support
    element: function(game, x, y, elements) {

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
        },
        sprite: {
          __constructor: ['x', 'y', 'key'],
          key: null,
          x: 0,
          y: 0
        }
      }

      // TODO: clean this up...
      var skipKeys = ['anchor', 'type']

      _.forEach(elements, function(element, name) {

        // TODO: cleanup
        if (element instanceof Phaser.Button ||
            element instanceof Phaser.Text ||
            element instanceof Phaser.Sprite) {

          el.add(element)
          el['_' + name] = element
          return
        }

        var key = element.type
        var objectOpts = _.defaultsDeep(element, defaults[key])

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
        el['_' + name] = object
      })

      return el

    },

    button: function(game, x, y, itemBg, itemDownBg, opts) {
      var defaults = {
        button: {
          type: 'button',
          x: 0,
          y: 0,
          anchor: [0.5, 0.5],
          width: 360,
          height: 60
        },
        text: {
          type: 'button',
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

      var button = UI.button(game, x, y, itemBg, itemDownBg, {
        button: {
          anchor: [0.5, 0],
          key: itemBg,
          height: 50,
          width: 250
        }
      })._button

      var btn = UI.element(game, x, y, {
        button: button,
        name: {
          type: 'text',
          x: -115,
          y: 15,
          text: item.name,
          style: {font: '20px sansus'}
        },
        cost: {
          type: 'text',
          x: 30,
          y: 5,
          text: getItemCost(item)+'',
          style: item.cost.toString().length > 9 ?
            { font: '16px sansus' } :
            {font: '20px sansus'}
        },
        cupcake: {
          type: 'sprite',
          x: 15,
          y: 5,
          key: 'cupcake',
          width: 12,
          height: 16
        },
        cps: {
          type: 'text',
          x: 15,
          y: 25,
          text: item.action ? item.action : item.cps,
          style: item.cost.toString().length > 9 ?
            { font: '16px sansus' } :
            {font: '20px sansus'}
        }
      })

      var cost = btn._cost

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
          type: 'button',
          key: itemBg,
          callback: onclick,
          x: game.world.centerX,
          y: 640 - 60
        },
        text: {
          type: 'text',
          text: '+500 when they join!'
        }
      })
    },
    shopButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0', 5)
      var itemDownBg = UI.rect(game, 250, 50, '#16A085', 5)

      return UI.button(game, game.world.centerX, 640 - 120 - 5, itemBg, itemDownBg, {
        button: {
          type: 'button',
          key: itemBg,
          callback: onclick
        },
        text: {
          type: 'text',
          text: 'Buy Upgrades'
        }
      })
    },
    backButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#48C9B0', 5)
      var itemDownBg = UI.rect(game, 250, 50, '#16A085', 5)

      return UI.button(game, game.world.centerX, 550, itemBg, itemDownBg, {
        button: {
          type: 'button',
          key: itemBg,
          callback: onclick,
          width: game.world.width,
          height: 60
        },
        text: {
          type: 'text',
          text: 'Back'
        }
      })
    },
    shareButton: function(game, onclick) {
      var itemBg = UI.rect(game, 250, 50, '#3498db', 5)
      var itemDownBg = UI.rect(game, 250, 50, '#2980b9', 5)

      return UI.button(game, game.world.centerX, 640 - 60, itemBg, itemDownBg, {
        button: {
          type: 'button',
          key: itemBg,
          callback: onclick,
          width: game.world.width,
          height: 60
        },
        text: {
          type: 'text',
          text: 'Earn More Cupcakes'
        }
      })
    }
  }
})()
