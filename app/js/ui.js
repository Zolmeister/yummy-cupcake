'use strict'
var Phaser = require('phaser')
var util = require('./util')
var getCupcakesText = util.getCupcakesText
var getCupcakesPerSecondText = util.getCupcakesPerSecondText
var getItemCost = util.getItemCost
var _ = require('lodash')
var PhaserUI = require('../lib/phaser-ui.js')

module.exports = function(game) {
  return new PhaserUI(game).extend({
    scoreText: function() {
      return this.element(this.game, 0, 0, {
        text: {
          type: 'text',
          x: game.world.centerX,
          y: 5,
          text: getCupcakesText(game.score),
          anchor: [0.5, 0],
          style: {
            font: '45px sansus',
            fill: '#ffffff',
            stroke: '#ee508c',
            strokeThickness: 8 }
        }
      })._text
    },
    cpsText: function() {
      return this.element(this.game, 0, 0, {
        text: {
          type: 'text',
          text: getCupcakesPerSecondText(this.game.cupcakesPerSecond),
          style: {
            font: '20px sansus',
            fill: '#ffffff',
            stroke: '#ee508c',
            strokeThickness: 5 },
          anchor: [0.5, 0],
          x: this.game.world.centerX,
          y: 60
        }
      })._text
    },
    cupcake: function(game, onclick) {

        console.log('Cupcake index: ' + game.cupcakeIndex)
        console.log('Cupcake sprite key:')
        console.log('cupcake' + game.cupcakeIndex)

      return this.element(game, 0, 0, {
        button: {
          type: 'button',
          key: 'cupcake' + game.cupcakeIndex,
          callback: onclick,
          anchor: [0.5, 0.5],
          x: game.world.centerX,
          y: game.world.centerY
        }
      })._button
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

      var button = this.element(game, x, y, _.defaultsDeep(opts, defaults))

    button._button.events.onInputDown.add(function(/*el, pointer*/) {
        button._button.loadTexture(itemDownBg)
      })
    button._button.events.onInputOut.add(function(/*el, pointer*/) {
        button._button.loadTexture(itemBg)
      })
    button._button.events.onInputUp.add(function(/*el, pointer*/) {
        button._button.loadTexture(itemBg)       
      })

      return button
    },
    shopItemButton: function(item, onDragStart, onDragEnd, game, x, y, onclick) {
      var itemWidth = 250
      var itemHeight = 50
        
      // string .'s together to show how many of the item are owned
      var ownedStr = ''
      
      for (var i = 0; i < item.owned; ++i) {
         ownedStr += '.'
      }

      // button background
      var itemBg = this.rect(game, itemWidth, itemHeight, '#ecf0f1', 3)
      var itemDownBg = this.rect(game, itemWidth, itemHeight, '#bdc3c7', 3)

      var button = this.button(game, x, y, itemBg, itemDownBg, {
        button: {
          anchor: [0.5, 0],
          key: itemBg,
          height: itemHeight,
          width: itemWidth
        }
      })._button

      var btn = this.element(game, x, y, {
        button: button,
        name: {
          type: 'text',
          x: -115,
          y: 9,
          text: item.name,
          style: { 
              font: '20px sansus',
              fill: (util.canBuy(item, game) ? '#000000' : '#FF0000')
          }
        },
        owned: {
            type: 'text',
            x: -115,
            y: 19,
            text: ownedStr,
            style: { font: '24px sansus' }
        },
        cost: {
          type: 'text',
          x: 30,
          y: 5,
          text: getItemCost(item) + '',
          style: item.cost.toString().length > 9 ?
            { font: '16px sansus' } :
            { font: '20px sansus' }
        },
        cupcake: {
          type: 'sprite',
          x: 15,
          y: 5,
          key: 'cupcake' + game.cupcakeIndex,
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
            { font: '20px sansus' }
        }
      })

      var cost = btn._cost

      button.input.enableDrag()
      button.events.onInputUp.add(function(el, pointer) {
        button.loadTexture(itemBg)
        if(onclick) {
          onclick(el, pointer, {
            costText: cost
          })
        }
      })

      btn._cReset = function() {
        button.loadTexture(itemBg)
      }

      button.events.onInputDown.add(function(/*el, pointer*/) {
        button.loadTexture(itemDownBg)
      })

      button.events.onInputOut.add(function(/*el, pointer*/) {
        btn._cReset()
      })

      button.events.onDragStart.add(onDragStart)
      button.events.onDragStop.add(onDragEnd)

      // give the button some fields so we can disable its input later when masked
      btn.bounds = new Phaser.Rectangle(x - itemWidth / 2, y, itemWidth, itemHeight)
      btn.button = button

      return btn
    },
    shopButton: function(game, onclick) {
      var itemBg = this.rect(game, 250, 50, '#48C9B0', 5)
      var itemDownBg = this.rect(game, 250, 50, '#16A085', 5)

      return this.button(game, game.world.centerX, 640 - 120 - 5, itemBg, itemDownBg, {
        button: {
          type: 'button',
          key: itemBg,
          callback: onclick,
          width: game.world.width / 2,
          height: 60
        },
        text: {
          type: 'text',
          text: 'Buy Upgrades!'
        }
      })
    },
    backButton: function(game, onclick) {
      var itemBg = this.rect(game, 250, 50, '#48C9B0', 5)
      var itemDownBg = this.rect(game, 250, 50, '#16A085', 5)

      return this.button(game, game.world.centerX, 550, itemBg, itemDownBg, {
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
      var itemBg = this.rect(game, 250, 50, '#3498db', 5)
      var itemDownBg = this.rect(game, 250, 50, '#2980b9', 5)

      return this.button(game, game.world.centerX / 2, 640 - 55, itemBg, itemDownBg, {
        button: {
          type: 'button',
          key: itemBg,
          callback: onclick,
          width: game.world.width / 2 - 10,
          height: 60
        },
        text: {
          type: 'text',
          text: 'Invite Friends'
        }
      })
    },
    bakeoffButton: function(game, onclick) {
        var itemBg = this.rect(game, 250, 50, '#3498db', 5)
        var itemDownBg = this.rect(game, 250, 50, '#2980b9', 5)
        
        return this.button(game, 3 * game.world.centerX / 2, 640 - 55, itemBg, itemDownBg, {
            button: {
              type: 'button',
              key: itemBg,
              callback: onclick,
              width: game.world.width / 2 - 10,
              height: 60
            },
            text: {
              type: 'text',
              text: 'Bake-Off!'
            }
        })
    },
    victoryText: function() {
      return this.element(this.game, 0, 0, {
        text: {
          type: 'text',
          x: game.world.centerX,
          y: 55,
          text: 'You won!',
          anchor: [0.5, 0],
          style: {
            font: '45px sansus',
            fill: '#ffffff',
            stroke: '#ee508c',
            strokeThickness: 8 }
        }
      })._text
    },
    victorySubtitle: function() {
      return this.element(this.game, 0, 0, {
        text: {
          type: 'text',
          text: 'Congratulations!',
          style: {
            font: '20px sansus',
            fill: '#ffffff',
            stroke: '#ee508c',
            strokeThickness: 5 },
          anchor: [0.5, 0],
          x: this.game.world.centerX,
          y: 110
        }
      })._text
    },
    startOverButton: function(game, onclick) {
      var itemBg = this.rect(game, 250, 50, '#3498db', 5)
      var itemDownBg = this.rect(game, 250, 50, '#2980b9', 5)

      return this.button(game, game.world.centerX, 640 - 60, itemBg, itemDownBg, {
        button: {
          type: 'button',
          key: itemBg,
          callback: onclick,
          width: game.world.width,
          height: 60
        },
        text: {
          type: 'text',
          text: 'Start Over'
        }
      })
    }
  })
}
