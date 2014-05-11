/*global Clay, game, UI*/
module.exports = {
	connect: connect,
	invite: invite
}

function connect() {
	Clay.Kik.connect({}, function(response) {
		if(! response || ! response.success) {
			console.log('todo: prompt to connect again')
		}
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
  	game.shareButton = UI.shareButton(game, invite)
  })
}

/* once cupcakes are customizable enough, we have have sharing, 'gifting' or 'baking' cupcakes
function shareCupcake() {

}
*/
