/*global Clay*/
'use strict'

// TODO remove global Clay dependency
module.exports = {
  connect: connect,
  invite: invite
}

function connect() {
  Clay.Kik.connect({}, function(response) {
    if(! response || ! response.success) {
      /*eslint-disable no-console*/
      console.log('todo: prompt to connect again')
      /*eslint-enable*/
    }
  })
}

function invite(game) {
  // TODO: Clay.Social.smartInvite()?
  var options = {
    message: 'Come join me in Yummy Cupcake! Make as many cupcakes as you can.',
    onAction: {
      join: {incrementData: {key: 'score', amount: 500}},
      play: {incrementData: {key: 'score', amount: 50}}
    }
  }
  Clay.Kik.invite(options, function() {
    game.shareButton = require('./ui')(game).shareButton(game, function() {
      invite(game)
    })
  })
}

/* once cupcakes are customizable enough, we have have sharing, 'gifting' or 'baking' cupcakes
function shareCupcake() {

}
*/
