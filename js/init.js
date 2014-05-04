// note that function calls within update are not optimized,
// and should be in-lined during some compile step
var config = {
  debug: false
}

_.defaultsDeep = _.partialRight(_.merge, _.defaults)

if (config.debug) {
  window.onerror = function( msg, url, linenumber ) {
    document.body.innerHTML += 'Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber
  }
}

var game = new Phaser.Game(360, 640, Phaser.CANVAS, 'game', false, transparent = !config.debug)
game.state.add('shop', ShopState)
game.state.add('main', MainState)
game.score = 0
game.cupcakesPerSecond = 0
game.cupcakesPerClick = 1
game.upgrades = {}

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
    name: 'ribbon :)',
    cost: 300,
    cps: 0,
    action: '+1 tap',
    owned: 0,
    visible: false,
    type: 'upgrade'
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
    drawLoadBar()
    game.load.image('bar', game.svgs.bar)
    game.load.image('cupcake', game.svgs.cupcake)
    game.load.image('cupcake-ribbon', game.svgs.cupcakeRibbon)

  },
  create: function() {

    game.stage.backgroundColor = '#71c5cf'

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

// for loading bar since we're loading some assets through xhr & loading svgs through canvg
game.state.add('presetup', {
  preload: function() {
    // Auto scaling
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    game.scale.setScreenSize(true)

    drawLoadBar()
  }
})
game.state.start('presetup')

game.loadProgress = 0 // 0 to game.loadSteps
game.loadSteps = 6 // webfont + cupcake svg + 1 step per svg we load (just bar.svg currently) + 1 step per png we load (2) in 'setup'
game.loadPNGs = 2 // how many pngs we're loading into phaser (game.load doesn't seem to give this #)
// Load fonts
WebFont.load({
  custom: {
    families: ['sansus']
  },
  active: function() {
  	game.loadProgress++ // inc loading bar
    getSVGImageAssets()
      .then(SVGstoPNGs)
      .then(function(svgs) {
      game.svgs = svgs
    }).then(function() {
      return getCupcakeSVG({
        width: 228,
        height: 324,
        items: ['cherry', 'sprinkles']
      })
    }).then(function(cupcakeUri) {
      game.svgs.cupcake = cupcakeUri

    }).then(function() {
      return getCupcakeSVG({
        width: 228,
        height: 324,
        items: ['cherry', 'ribbon', 'sprinkles']
      })
    }).then(function(cupcakeUri) {
  		game.loadProgress++ // inc loading bar
      game.svgs.cupcakeRibbon = cupcakeUri

    }).then(function() {
      // begin the game
      game.state.start('setup')
    }, function(err) {
      console.error(err)
    })
  }
})




// Set global vars for Clay API (for Clay.ready())
window.Clay = window.Clay || {}
Clay.gameKey = "cupcake"
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
    clay.src = "http://cdn.clay.io/api.js";
    // clay.src = "http://clay.io/api/src/bundle.js";
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
    connect() // prompt them to give us perms and log them in
    var shareThis = function() {
			Clay.Kik.post({
				message: 'Come play Yummy Cupcake to build your cupcake empire!',
				title: 'Yummy Cupcake',
				data: {}
			})
    }
    Clay.UI.Menu.init({ items: [{ title: 'Share This', handler: shareThis }] })
  })
})
