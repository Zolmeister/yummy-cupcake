// note that function calls within update are not optimized,
// and should be in-lined during some compile step
var config = {
  debug: true
}

var game = new Phaser.Game(360, 640, Phaser.AUTO, 'game')
game.score = 0

function getCupcakesText(n) {
  return n + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n + ' per second'
}

var main_state = {

    preload: function() {
      game.load.image('cupcake', 'assets/cupcake.png')
      game.load.image('button', 'assets/button.png')
      game.stage.backgroundColor = '#71c5cf'
    },

    create: function() {

      // Auto scaling
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      game.scale.setScreenSize(true)

      if (config.debug)
        game.stage.disableVisibilityChange = true


      // Add UI elements

      // Main score text
      game.scoreText = game.add.text(
        game.world.centerX -
        100,
        10,
        getCupcakesText(0), // 0 Cupcakes
        { font: '45px sansus', fill: '#fff' })


      // Cupcakes-per-second text
      game.cpsText = game.add.text(
        game.world.centerX -
        30,
        50,
        getCupcakesPerSecondText(game.score), // 0 per second
        { font: '25px sansus', fill: '#fff' })

      // The big cupcake
      game.cupcake = game.add.button(250, 320, 'cupcake', cupcakeClick, this, 2, 1, 0)
      game.cupcake.anchor.setTo(0.5, 0.5)
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7

      // shop button
      game.shopButton = game.add.group()
      var shopButtonButton = game.add.button(0, 0, 'button', shop, 2, 1, 0)
      shopButtonButton.width = 170
      shopButtonButton.height = 60

      game.shopButton.add(shopButtonButton)

      var shopButtonText = game.add.text(
        30,
        0,
        'Shop',
        { font: '30px sansus'})

      game.shopButton.add(shopButtonText)
      game.shopButton.x = 160
      game.shopButton.y = 500

    },

    update: function() {
      loop()
    }
}

function shop() {
  console.log('SHOP')
}

function cupcakeClick(button, pointer) {
  game.cupcakeCount++
  game.scoreText.setText(game.cupcakeCount + ' Cupcakes')

  if (!game.cupcakeDown) {
    game.cupcakeDown =  game.time.events.loop(100, function(){
      game.cupcake.scale.x = 0.7
      game.cupcake.scale.y = 0.7

      game.time.events.remove(game.cupcakeDown);
      game.cupcakeDown = null
    });
    game.cupcake.scale.x -= 0.05
    game.cupcake.scale.y -= 0.05
  }

  // spawn +1 near the mouse

  var plusOneStyle =  { font: '25px sansus', align: 'center', fill: '#fff' }
  // add some variance in the +1 position (but still near tap)
  var x = pointer.x + ( 0.5 - Math.random() ) * -60 // -30 to +30
  var y = pointer.y // probably don't need variance in the y
  var plusOne = game.add.text(x, y, '+1', plusOneStyle)
  game.add.tween(plusOne).to({ y: -50 }, Math.random() * 1500 + 2000, Phaser.Easing.Cubic.Out, true);

}

function loop() {

}

function connect() {
	Clay.Kik.connect({}, function(response) {
		if(! response || ! response.success)
			console.log('todo: prompt to connect again')
	})
}

function invite() {
  // TODO: Clay.Social.smartInvite()?
  var options = {
    message: 'test',
    onAction: {
      join: { incrementData: { key: 'cupcakes', amount: 500 } },
      play: { incrementData: { key: 'cupcakes', amount: 50 } }
    }
  }
  console.log('invite')
  Clay.Kik.invite(options)
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

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state)
game.state.start('main')
/*
grabCupcakeSVG({
  width: 326,
  height: 463,
  items: ['cherry', 'straw', 'sprinkles']
}, function(url) {
  main_state.url = url
  game.state.start('main')
})*/

/*
window.addEventListener( 'load', function() {
  // Load clay API
  window.Clay = window.Clay || {};
  Clay.gameKey = "prism";
  Clay.readyFunctions = [];
  Clay.options = { inviteActions: true } // inviteActions means the API checks onload for any invites from other users, and gives them cupcakes accordingly
  Clay.ready = function( fn ) {
    Clay.readyFunctions.push( fn );
  };
  ( function() {
    var clay = document.createElement("script"); clay.async = true;
    //clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api.js";
    //clay.src = "http://cdn.clay.io/api.js";
    clay.src = "http://clay.io/api/src/bundle.js";
    var tag = document.getElementsByTagName("script")[0]; tag.parentNode.insertBefore(clay, tag);
  } )();


  // Load GA
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-27992080-1', 'clay.io');
  ga('send', 'pageview');

  // high score
  Clay.ready(function() {
    console.log('Clay loaded')
    connect() // prompt them to give us perms and log them in
    Clay.UI.Menu.init({ items: [{ title: 'Share This', handler: function() { console.log('todo') } }] })
  })
})*/
