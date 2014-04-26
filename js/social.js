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
