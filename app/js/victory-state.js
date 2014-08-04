'use strict'

var config = require('./config.js')
var assets = require('./assets.js')
module.exports = VictoryState

function VictoryState() {}

VictoryState.prototype.create = function() {
  var self = this
  var game = this.game

  var UI = require('./ui.js')(game)

  var sprites = [ 15, 11, 7, 3 ] // all 4 fully-upgraded sprites
  var rows = [ 1, 2, 1 ] // number of cupcakes per row
  var rowY = [ 240, 310, 360 ] // where the rows will be placed vertically
  var rowScale = [ 0.5, 0.6, 0.7 ] // how the rows will be scaled
  var rowSpaceX = [ 0, 150, 0 ] // how the cupcakes will be horizontally spaced (around the center)

  function createUI() {

    self.victoryText = UI.victoryText(game)
    self.victorySubtitle = UI.victorySubtitle(game)

    // make an array for celebratory cupcake sprites
    self.cupcakes = new Array()
    // create the cupcake sprites in the order of layering

    var c = 0 // count cupcakes
    for (var row = 0; row < rows.length; ++row) {
      var y = rowY[row]
      
      var x = game.world.centerX - rowSpaceX[row] / rows[row]
      var xInc = rowSpaceX[row]

      for (var col = 0; col < rows[row]; ++col) {
        self.cupcakes[c] = game.add.sprite(x, y, 'cupcake' + sprites[c])

        // anchor all cupcake sprites by their center
        self.cupcakes[c].anchor.set(0.5, 0.5) 

        // scale the cupcake sprites to create a sense of depth
        self.cupcakes[c].scale.x = rowScale[row]
        self.cupcakes[c].scale.y = rowScale[row]

        x += xInc
        ++c // next sprite
      }
    }

    self.startOverButton = UI.startOverButton(game, function() {
    // totally reset the game  
      game.score = 0
      game.cupcakeIndex = 0
      game.cupcakesPerClick = 1
      game.cps = 0
      game.shopItemList = config.shopItemList

      // return to the main screen
      game.state.start('main')
    })
  }

  // load all the sprites, then call createUI()
  assets.loadCupcakeSprites(game, sprites, createUI)
}
