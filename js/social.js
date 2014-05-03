function connect() {
	Clay.Kik.connect({}, function(response) {
		if(! response || ! response.success)
			console.log('todo: prompt to connect again')
	})
}

function invite() {
  // TODO: Clay.Social.smartInvite()?
  var options = {
    message: 'Come join me in Yummy Cupcake! Make as many cupcakes as you can.',
    onAction: {
      join: { incrementData: { key: 'score', amount: 500 } },
      play: { incrementData: { key: 'score', amount: 50 } }
    }
  }
  Clay.Kik.invite(options, function() {
  	// ghetto / "jank"
  	// we should create an alert box UI that we can use across all games
  	UI.shareButton = function(game, onclick) {
      var button = UI.button('+500 when they join!', game, game.world.centerX, 640 - 60, 'button-green', onclick)
      button._buttonButton.width = 360
      button._buttonButton.height = 60

      return button
    }
  	game.shareButton = UI.shareButton(game, invite)
  })
}

/* once cupcakes are customizable enough, we have have sharing, 'gifting' or 'baking' cupcakes
function shareCupcake() {
	
}
*/