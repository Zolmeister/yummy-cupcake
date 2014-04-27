function loadMainStateAssets(game) {
    game.load.image('cupcake', game.cupcakeURL)
    game.load.image('button', 'assets/button.png')
}

// TODO: probably should have some sort of class/obj we can attach things to
// all possible items. guessing you're going to re-implement this somewhere
var items = ['cherry', 'ribbon', 'straw', 'sprinkles']
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
