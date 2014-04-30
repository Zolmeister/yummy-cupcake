// Load in SVGs as pngs so phaser can use them
function getSVGImageAssets() {
	return new Promiz().resolve([
		{ key: 'bar', src: 'assets/bar.svg', width: 360, height: 73 }
	])
}

// convert all of our svgs to png urls
// @param svgs [ { key: 'someKey', src: 'assets/bar.svg', width: someWidth, height: someHeight } ]
// @param callback - called when complete with param: { someKey: someSrcURL }
function SVGstoPNGs(svgs) {
  var deferred = new Promiz()

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

        // all imgs loaded
		    if(loaded == toLoad) {
		    	deferred.resolve(returnObj)
        }
		  }
      img.onerror = function(err) {
        deferred.reject(err)
      }
		 })(svgs[i])
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
      deferred.resolve(canvas.toDataURL('images/png'))
    }
    img.onerror = function(err) {
      deferred.reject(err)
    }
  }
  xhr.open('GET', 'assets/pink.svg')
  xhr.responseType = 'document'
  xhr.send()

  return deferred
}
