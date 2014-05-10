/*global game, UI*/
var util = require('./util.js')
var getItemCost = util.getItemCost
var updateCPS = util.updateCPS
var _ = require('lodash')

module.exports = ShopState

function ShopState() {}
ShopState.prototype = {
  itemHeight: 52,
  shopHeight: 380
}

ShopState.prototype.preload = function() {}

ShopState.prototype.create = function() {

    var self = this

    var shopBg = UI.rect(game, 280, 410, '#2ecc71', 5)

    // shop bg sprite
    game.add.image(40, 105, shopBg)

    game.shopItemButtons = []
    var buttons = game.shopItemButtons

    game.items = game.add.group()
    var items = game.items
    var nextHidden = false
    var index = -1
    for(var i = 0; i < game.shopItemList.length; i+=1) {
      if (nextHidden) {
        break
      }

      genItem(i)
    }

    function genItem(i) {
      var item = game.shopItemList[i]
        if (item.type === 'upgrade' && item.owned) {
          item.visible = false
          return
        }

        // this is so that we can skip items which are not visible,
        // but in the middle of the list
        index+=1

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
          function(/*btn, pointer*/) {
            game.tracking = false
            game.trackingEl.x = game.trackingElX
            game.trackingEl.y = game.trackingElY
          },
          game, game.world.centerX,
          120 + index * self.itemHeight, function(button, pointer, elements) {
            var costText = elements.costText

          // TODO: disable if button is not actually visible (masked)
          // buy item
          if (!game.tracked) {
            console.log('buying', item.name)

            if (game.score >= getItemCost(item)) {
              game.score -= getItemCost(item)
              item.owned += 1
              costText.setText(getItemCost(item))
              updateCPS(game)

              if (item.type === 'upgrade') {
                item.visible = false
                if (item.action === '+1 tap') {
                  game.cupcakesPerClick+=1
                }
                game.state.start('shop')
              }
              game.dirty = true
            }
          }

          game.tracked = false
        })

        items.add(btn)

        buttons.push(btn)
    }

    /*jshint ignore:start*/
    items.c_reset = function() {
      for(var i=0; i < buttons.length; i+=1) {
        buttons[i].c_reset()
      }
    }
    /*jshint ignore:end*/

    // This is a mask so that the buttons are hidden
    // if they are outside the 'shop' bounding box
    var graphics = game.add.graphics(0, 0)
    graphics.moveTo(game.world.centerX - 125, 120)
    graphics.lineTo(game.world.centerX - 125, 120 + this.shopHeight)
    graphics.lineTo(game.world.centerX + 125, 120 + this.shopHeight)
    graphics.lineTo(game.world.centerX + 125, 120)

    items.mask = graphics


    // Main score text
    game.scoreText = UI.scoreText(game)

    // Cupcakes-per-second text
    game.cpsText = UI.cpsText(game)


    // back button
    game.backButton = UI.backButton(
      game,
      function() {
        game.state.start('main')
      }
    )

}

ShopState.prototype.update = function() {

  if (game.tracking && game.input.activePointer.isDown) {
    if (game.trackingStart &&
        (game.input.activePointer.y > game.trackingOrigY + 5 ||
         game.input.activePointer.y < game.trackingOrigY - 5 )) {
      game.trackingStart = false
      game.tracked = true
      /*jshint ignore:start*/
      game.items.c_reset()
      /*jshint ignore:end*/
    } else if (!game.trackingStart) {
      var y = game.input.activePointer.y

      var dy = y - game.trackingOrigY
      game.trackingOrigY = y
      game.items.y+=dy

      var visibleItemCount = _.filter(game.shopItemList, function(item) {
        return item.visible
      }).length

      var itemsHeight = (visibleItemCount + 1) * this.itemHeight
      var shopHeight = this.shopHeight

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

    }

    game.trackingEl.x = game.trackingElX
    game.trackingEl.y = game.trackingElY
  }
}
