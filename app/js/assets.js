'use strict'
var Promiz = require('promiz')
var canvg = require('canvg')

module.exports = {
	getSVGImageAssets: getSVGImageAssets,
	SVGstoPNGs: SVGstoPNGs,
	getCupcakeSVG: getCupcakeSVG,
	drawLoadBar: drawLoadBar
}

// Load in SVGs as pngs so phaser can use them
function getSVGImageAssets() {
	return new Promiz().resolve([
		{key: 'bar', src: '/assets/bar.svg', width: 360, height: 73}
	])
}

// convert all of our svgs to png urls
// @param svgs [ { key: 'someKey', src: 'assets/bar.svg', width: someWidth, height: someHeight } ]
// @param callback - called when complete with param: { someKey: someSrcURL }
function SVGstoPNGs(svgs, game) {
  var deferred = new Promiz()

	var loaded = 0 // counter so we can call callback when all are loaded
	var toLoad = svgs.length
	var returnObj = {}

	for(var i = 0, j = svgs.length; i < j; i += 1) {
		// force local scope since img.onload is async
	  genItem(svgs[i])
	 }

	function genItem(svg) {
	  	var width = svg.width
	  	var height = svg.height
		  // since phaser doesn't support svg, we have to convert to a png of the right size
		  var canvas = document.createElement('canvas')

      // TODO: these used to be * by window.devicePixelRatio,
      // but for that to work the output needs to account for the scale
		  canvas.width = width
		  canvas.height = height
		  canvas.style.width = width + 'px'
		  canvas.style.height = height + 'px'

		  function canvasLoaded() {
  			game.loadProgress += 1 // inc loading bar

		  	returnObj[svg.key] = canvas.toDataURL('image/png')

		    loaded += 1

        // all imgs loaded
		    if(loaded === toLoad) {
		    	deferred.resolve(returnObj)
            }
		  }

		  canvg(canvas, svg.src, {renderCallback: canvasLoaded})
	}

  return deferred
}

// This SVG->png has its own method since it allows for a bit more customization
function getCupcakeSVG(options) {
  var deferred = new Promiz()
  var items = ['cherry', 'ribbon', 'straw', 'sprinkles']

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
      $toHide.style.display = 'none'
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
  xhr.open('GET', '/assets/pink.svg')
  xhr.responseType = 'document'
  xhr.send()

  return deferred
}

function drawLoadBar(game) {
  // Ghetto load bar. Better implementation would be something like http://www.photonstorm.com/phaser/advanced-phaser-and-typescript-projects
  // be sure it takes into account our manual loading in of svgs though
  var loadBarHeight = 50
  var loadBarWidth = 200
  var loadBarBG = game.add.graphics(0, 0)
  loadBarBG.beginFill(0x000000, 1)
  loadBarBG.drawRect(game.world.centerX - loadBarWidth / 2, game.world.centerY - loadBarHeight / 2, loadBarWidth, loadBarHeight)
  loadBarBG.endFill()
  var loadBarFill = game.add.graphics(0, 0)
  function updateLoadBar() {
    loadBarFill.beginFill(0xFFFFFF, 1)
    var progress = ( game.loadProgress + ( ( game.load.progress / 100 ) * game.loadPNGs ) ) / game.loadSteps
    var width = progress * loadBarWidth
    loadBarFill.drawRect(game.world.centerX - loadBarWidth / 2, game.world.centerY - loadBarHeight / 2, width, loadBarHeight)
    loadBarFill.endFill()
    if(game.load.hasLoaded) {
        clearInterval(loadInterval)
        loadBarBG.destroy()
        loadBarFill.destroy()
    }
  }
  updateLoadBar()
  var loadInterval = setInterval(updateLoadBar, 100)
}
