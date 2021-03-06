'use strict'
var _ = require('lodash')
var Phaser = require('phaser')

module.exports = PhaserUI

// TODO move the scrolling shop code here
// TODO make this a prefab? or general class that things can inherit from?
function PhaserUI(game) {
  this.game = game
}

// TODO: remove game from first arugment
PhaserUI.prototype.rect = function(game, width, height, color, radius) {
  radius = radius || 0
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
}

// TODO: remove game from first arugment
PhaserUI.prototype.element = function(game, x, y, elements) {

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

}

PhaserUI.prototype.add = function add(name, fn) {
  PhaserUI.prototype[name] = fn
}

PhaserUI.prototype.extend = function extend(object) {
  var self = this

  _.forEach(object, function(val, key) {
    self.add(key, val)
  })

  return this
}
