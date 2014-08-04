'use strict'
var Phaser = require('phaser')
var util = require('./util.js')
var updateScoreText = util.updateScoreText
var getItemCost = util.getItemCost
var config = require('./config.js')
var _ = require('lodash')

module.exports = ShopState

function ShopState() {}

ShopState.prototype.create = function() {
  var game = this.game
  var UI = require('./ui')(game)

  var shopBg = UI.rect(game, 280, 410, '#2ecc71', 5)

  // shop bg sprite
  game.add.image(40, 105, shopBg)

  // create buttons
  this.createItems(game, 0)

  // Main score text
  game.scoreText = UI.scoreText(game)
  // Update the main score text to force resizing if necessary
  updateScoreText(game)
  
  // Cupcakes-per-second text
  game.cpsText = UI.cpsText(game)
  
  // disable cupcakes-per-second calculation to avoid creating new buttons every second
  game.stopCPSCalculation()

  // back button
  game.backButton = UI.backButton(
    game,
    function() {
      game.state.start('main')
    }
  )

}

ShopState.prototype.update = function() {
  var game = this.game

  if (game.tracking && game.input.activePointer.isDown) {
    if (game.trackingStart &&
        (game.input.activePointer.y > game.trackingOrigY + 5 ||
         game.input.activePointer.y < game.trackingOrigY - 5 )) {

      // start tracking the pointer for scrolling the menu
      game.trackingStart = false
      game.tracked = true
      /*jshint ignore:start*/
      game.items.c_reset()
      /*jshint ignore:end*/

    } else if (!game.trackingStart) {
      // scroll the menu
      
      var y = game.input.activePointer.y

      var dy = y - game.trackingOrigY
      game.trackingOrigY = y
      game.items.y += dy

      var visibleItemCount = _.filter(game.shopItemList, function(item) {
        return item.visible
      }).length

      var itemsHeight = (visibleItemCount + 1) * config.shopUI.itemHeight
      var shopHeight = config.shopUI.shopHeight

      if (itemsHeight < shopHeight) {
        game.items.y = 0
      } else {
        if (game.items.y >  0) {
          game.items.y = 0
        }

        if (game.items.y <  -(itemsHeight - shopHeight)) {
          game.items.y = -(itemsHeight - shopHeight)
        }
      }

      this.disableHiddenButtons() // after scrolling, we'll need to update this
    }

    game.trackingEl.x = game.trackingElX
    game.trackingEl.y = game.trackingElY
  }
}

ShopState.prototype.refreshItems = function(game) {
  var oldY = game.items.y // preserve the old scroll positions

  game.items.destroy()
  this.createItems(game, oldY)
}

ShopState.prototype.createItems = function(game, itemsY) {
  var UI = require('./ui.js')(game)

  game.shopItemButtons = []
  var buttons = game.shopItemButtons
  game.items = game.add.group()
  game.items.y = itemsY
  var items = game.items
  var nextHidden = false
  var index = -1
  for(var i = 0; i < game.shopItemList.length; i += 1) {
    if (nextHidden) {
      break
    }

    genItem(i, game, UI, index, nextHidden, items, buttons)
  }

  function genItem(i) {
    var item = game.shopItemList[i]
    if (item.type === 'upgrade') {
      if (item.owned) {
        item.visible = false
        return
      }
          
      if (i > 0) {
        var previousUpgrade = game.shopItemList[i - 1]
        if (!previousUpgrade.owned) {
          return
        }
      }
    }

    // this is so that we can skip items which are not visible,
    // but in the middle of the list
    index += 1

    if (game.score >= getItemCost(item) || (item.owned > 0)) {
      item.visible = true
    }
    if (!(item.type && item.type === 'upgrade') && !item.visible && !nextHidden) {
      item = _.clone(item)
      item.name = '???'
      nextHidden = true
    }

    var x = game.world.centerX
    var y = 120 + index * config.shopUI.itemHeight
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
      function() {
        game.tracking = false
        game.trackingEl.x = game.trackingElX
        game.trackingEl.y = game.trackingElY
      },
      game, x, y,
      function() {

        // buy item
        if (!game.tracked) {
          if (util.canBuy(item, game)) {
            util.buyItem(item, game)

            if (item.type === 'upgrade') {
              // don't let the player return to the main menu until the new sprite is ready
              game.input.disabled = true

              game.loadCurrentCupcake()
                .then(function() {
                  game.input.disabled = false
                  // take the player to the main screen after the sprite loads
                  game.state.start('main')
                })
            }
            else {
              game.state.getCurrentState().refreshItems(game) // reflect changing score
            }
          }
        }

        game.tracked = false
      })

    items.add(btn)

    buttons.push(btn)
  }

  /* eslint camelcase: 0 */
  items.c_reset = function() {
    for(i = 0; i < buttons.length; i += 1) {
      buttons[i]._cReset()
    }
  }

  var boundingBox = this.boundingBox()
  var graphics = game.add.graphics(0, 0)

  // This is a mask so that the buttons are hidden
  // if they are outside the 'shop' bounding box
  graphics.moveTo(boundingBox.left, boundingBox.top)
  graphics.lineTo(boundingBox.left, boundingBox.bottom)
  graphics.lineTo(boundingBox.right, boundingBox.bottom)
  graphics.lineTo(boundingBox.right, boundingBox.top)

  items.mask = graphics

  this.disableHiddenButtons()
}

ShopState.prototype.disableHiddenButtons = function () {
  var game = this.game
  var buttons = game.shopItemButtons
  var boundingBox = this.boundingBox()

  // use the bounding box to deactivate buttons that have been hidden

  for (var i = 0; i < buttons.length; ++i) {
    var button = buttons[i]
    var buttonBounds = new Phaser.Rectangle(button.bounds.x, button.bounds.y, button.bounds.width, button.bounds.height)
    buttonBounds.y += game.items.y
    button.button.inputEnabled = Phaser.Rectangle.containsRect(buttonBounds, boundingBox)
  }
}

// calculate the bounding box of the shop
ShopState.prototype.boundingBox = function () {
  var game = this.game

  var xMargin = 125
  var boundsLeft = game.world.centerX - xMargin
  var boundsRight = game.world.centerX + xMargin
  var boundsWidth = boundsRight - boundsLeft

  var boundsY = 120
  
  return new Phaser.Rectangle(boundsLeft, boundsY, boundsWidth, config.shopUI.shopHeight)
}
