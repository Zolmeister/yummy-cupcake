// And finally we tell Phaser to add and start our 'main' state
// game.state.start('main')
game.state.start('setup')


/*
grabCupcakeSVG({
  width: 326,
  height: 463,
  items: ['cherry', 'straw', 'sprinkles']
}, function(url) {
  mainState.url = url
  game.state.start('main')
})*/

/*
window.addEventListener( 'load', function() {

  // Load clay API
  window.Clay = window.Clay || {}
  Clay.gameKey = "prism"
  Clay.readyFunctions = []

  // inviteActions means the API checks onload for any invites from other users,
  // and gives them cupcakes accordingly
  Clay.options = { inviteActions: true }
  Clay.ready = function( fn ) {
    Clay.readyFunctions.push( fn )
  }

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
*/
