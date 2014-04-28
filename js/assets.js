function loadMainStateAssets(game) {
    game.load.image('cupcake', game.svgs.cupcake)
    game.load.image('bar', game.svgs.bar)
    game.load.image('button', 'assets/button.png')
}

// Load in SVGs as pngs so phaser can use them
function grabImageAssets(callback) {
	game.svgs = []
	var svgs = [
		{ key: 'bar', src: 'assets/bar.svg', width: 360, height: 73 }
	]
	// Nesting... Maybe you can implement a promise here
	SVGtoPNGs(svgs, function(sources) { 
		game.svgs = sources // key: src
		
		// this one has it's own specfic function because it turns on/off custom elements
		grabCupcakeSVG({
		  width: 228,
		  height: 324,
		  items: ['cherry', 'straw', 'sprinkles']
		}, function(url) {
		  game.svgs.cupcake = url
		  // everything loaded up
		  callback()
		})
	})
}

// convert all of our svgs to png urls
// @param svgs [ { key: 'someKey', src: 'assets/bar.svg', width: someWidth, height: someHeight } ]
// @param callback - called when complete with param: { someKey: someSrcURL }
function SVGtoPNGs(svgs, callback) {
	var loaded = 0 // counter so we can call callback when all are loaded
	var toLoad = svgs.length
	var returnObj = {}
	
	for(var i = 0, j = svgs.length; i < j; i++) {
		// force local scope since img.onload is async
	  ;(function(svg) {
	  	console.log(svg)
	  	var width = svg.width
	  	var height = svg.height
		  // since phaser doesn't support svg, we have to convert to a png of the right size
		  var canvas = document.createElement('canvas')
		  canvas.width = width * window.devicePixelRatio
		  canvas.height = height * window.devicePixelRatio
		  canvas.style.width = width + 'px'
		  canvas.style.height = height + 'px'
		  var ctx = canvas.getContext('2d')
		  var img = new Image()
		  // set the img src to the xml string
		  img.src = svg.src
		  img.onload = function() {
		    // draw svg to canvas
		    ctx.drawImage(img, 0, 0, width, height)
		    // canvas to png
		    returnObj[ svg.key ] = canvas.toDataURL('images/png')
		    
		    loaded++
		    if(loaded == toLoad) // all imgs loaded
		    	callback(returnObj)
		  }
		 })(svgs[i])
	 }
}

// all possible items. guessing you're going to re-implement this somewhere
var items = ['cherry', 'ribbon', 'straw', 'sprinkles']
// This SVG->png has its own method since it allows for a bit more customization
function grabCupcakeSVG(options, callback) {
  var width = options.width
  var height = options.height
  // Necessary to grab the XML of the svg
  var xhr = new XMLHttpRequest()
  xhr.onload = function() {
    // parse as XML instead of a string
    var svgAsXml = xhr.responseXML
    // find the elements we want to remove
    var shownItems = options.items
    for (var i = 0, j = items.length; i < j; i++) {
      var item = items[i]
      if(shownItems.indexOf(item) !== -1)
        continue // skip hiding any item we specified
      var $toHide = svgAsXml.getElementById(item)
      $toHide.style.display = 'none'
    }
    // change xml back to string
    var svgAsString = new XMLSerializer().serializeToString(svgAsXml)
    var svgBlob = new Blob([svgAsString], {type: 'image/svg+xml;charset=utf-8'})
    // since phaser doesn't support svg, we have to convert to a png of the right size
    var canvas = document.createElement('canvas')
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    var ctx = canvas.getContext('2d')
    var img = new Image()
    // set the img src to the xml string
    img.src = window.URL.createObjectURL(svgBlob)
    img.onload = function() {
      // draw svg to canvas
      ctx.drawImage(img, 0, 0, width, height)
      // canvas to png
      callback(canvas.toDataURL('images/png'))
    }
  }
  xhr.open('GET', '/assets/pink.svg')
  xhr.responseType = 'document'
  xhr.send()
}
