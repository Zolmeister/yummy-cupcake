'use strict'
var Phaser = require('phaser')
var Promiz = require('promiz')
var canvg = require('canvg')

module.exports = {
  getCupcakeSVG: getCupcakeSVG,
  drawLoadBar: drawLoadBar,
  loadProgress: loadProgress
}

// This SVG->png has its own method since it allows for a bit more customization
function getCupcakeSVG(options, file) {
  var deferred = new Promiz()
  var items = ['cherry', 'ribbon', 'stars', 'straw', 'sprinkles']

  var width = options.width
  var height = options.height

  // Necessary to grab the XML of the svg
  var xhr = new XMLHttpRequest()
  xhr.onload = function() {
    // parse as XML instead of a string
    var svgAsXml = xhr.responseXML
    // find the elements we want to remove
    var shownItems = options.items
    for (var i = 0, j = items.length; i < j; i += 1) {
      var item = items[i]
      if(shownItems.indexOf(item) !== -1) {
        continue // skip hiding any item we specified
      }
      var $toHide = svgAsXml.getElementById(item)
      if ($toHide) { // null check because the element may not exist in the given file
          $toHide.style.display = 'none'
      }
    }
    // change xml back to string
    var svgAsString = new XMLSerializer().serializeToString(svgAsXml)
    // since phaser doesn't support svg, we have to convert to a png of the right size
    var canvas = document.createElement('canvas')

    // TODO: these used to be * by window.devicePixelRatio,
    // but for that to work the output needs to account for the scale
    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    function canvasLoaded() {
      deferred.resolve(canvas.toDataURL('images/png'))
    }
    canvg(canvas, svgAsString, {renderCallback: canvasLoaded})
  }
  xhr.open('GET', file)
  xhr.responseType = 'document'
  xhr.send()

  return deferred
}

// starts drawing the load bar
function drawLoadBar(game) {
  // Ghetto load bar. Better implementation would be something like http://www.photonstorm.com/phaser/advanced-phaser-and-typescript-projects
  // be sure it takes into account our manual loading in of svgs though
    
  var loadBarWidth = 249
  var loadBarHeight = 50

  var barSprite = game.add.sprite(game.world.centerX - loadBarWidth / 2, game.world.centerY - loadBarHeight / 2, 'bar')

  function updateLoadBar() {
    var width = loadProgress(game) * loadBarWidth

    barSprite.crop(new Phaser.Rectangle(0, 0, width, loadBarHeight))
  }

  updateLoadBar()
  setInterval(updateLoadBar, 10) // small interval to catch quick changes (PNG loading)
}

function loadProgress(game) {
  var svgProgress = game.loadProgress // progress manually loading our files
  var phaserProgress = game.load.totalLoadedFiles() // game.load.progress * game.loadPNGs / 100 // Phaser-handled loading progress


  return (svgProgress + phaserProgress) / game.loadSteps
}
