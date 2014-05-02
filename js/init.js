// note that function calls within update are not optimized,
// and should be in-lined during some compile step
var config = {
  debug: false
}

var game = new Phaser.Game(360, 640, Phaser.CANVAS, 'game', false, transparent = !config.debug)
game.state.add('shop', ShopState)
game.state.add('main', MainState)
game.score = 0
game.cupcakesPerSecond = 0
game.cupcakesPerClick = 1

// shop items
game.shopItemList = [
  {
    name: 'icing machine',
    cost: 15,
    cps: 0.1,
    owned: 0,
    visible: false
  },
  {
    name: 'icing farm',
    cost: 100,
    cps: 0.5,
    owned: 0,
    visible: false
  },
  {
    name: 'icing factory',
    cost: 500,
    cps: 4,
    owned: 0,
    visible: false
  },
  {
    name: 'icing mines',
    cost: 3000,
    cps: 10,
    owned: 0,
    visible: false
  },
  {
    name: 'icing shipment',
    cost: 10000,
    cps: 40,
    owned: 0,
    visible: false
  },
  {
    name: 'icing lab',
    cost: 40000,
    cps: 100,
    owned: 0,
    visible: false
  },
  {
    name: 'icing portal',
    cost: 200000,
    cps: 400,
    owned: 0,
    visible: false
  },
  {
    name: 'time machine',
    cost: 1666666,
    cps: 6666,
    owned: 0,
    visible: false
  },
  {
    name: 'antimatter',
    cost: 123456789,
    cps: 98765,
    owned: 0,
    visible: false
  },
  {
    name: 'prism',
    cost: 3999999999,
    cps: 999999,
    owned: 0,
    visible: false
  }
]

game.state.add('setup', {
  preload: function() {
    game.load.spritesheet('button-green', 'assets/button-green.png', 341, 136)
    game.load.image('bar', game.svgs.bar)
    game.load.image('cupcake', game.svgs.cupcake)
    game.load.spritesheet('button-purple', 'assets/button-purple.png', 341, 136)
  },
  create: function() {

    game.stage.backgroundColor = '#71c5cf'

    // Auto scaling
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    game.scale.setScreenSize(true)

    if (config.debug)
    game.stage.disableVisibilityChange = true

    game.state.start('main')

    // core loop that gives players more cupcakes every second
    ;(function cpsCalculation() {
      game.score += game.cupcakesPerSecond
      updateScoreText(game)
      setTimeout(cpsCalculation, 1000)
    })()

  }
})

// Load fonts
WebFont.load({
  custom: {
    families: ['sansus']
  },
  active: function() {
    getSVGImageAssets()
      .then(SVGstoPNGs)
      .then(function(svgs) {
      game.svgs = svgs
    }).then(function() {
      return getCupcakeSVG({
        width: 228,
        height: 324,
        items: ['cherry', 'straw', 'sprinkles']
      })
    }).then(function(cupcakeUri) {
      game.svgs.cupcake = cupcakeUri
      // begin the game
      game.state.start('setup')
    }, function(err) {
      console.error(err)
    })
  }
})




// Set global vars for Clay API (for Clay.ready())
window.Clay = window.Clay || {}
Clay.gameKey = "prism"
Clay.readyFunctions = []
// inviteActions means the API checks onload for any invites from other users,
// and gives them cupcakes accordingly
Clay.options = { inviteActions: true }
Clay.ready = function( fn ) {
  Clay.readyFunctions.push( fn )
}

window.addEventListener('load', function() {
	// Load clay API
  ;( function() {
    var clay = document.createElement("script"); clay.async = true;
    //clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api.js";
    //clay.src = "http://cdn.clay.io/api.js";
    clay.src = "http://clay.io/api/src/bundle.js";
    var tag = document.getElementsByTagName("script")[0]; tag.parentNode.insertBefore(clay, tag);
  } )();


  // Load GA
  ;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
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
})
