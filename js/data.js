var dataLastSave = null // var so we can tell if data has changed (and only update if it has). Stored as string
function saveData() {
	var data = { scorePerClick: game.cupcakesPerClick, scorePerSecond: game.cupcakesPerSecond }
	var diffObj = data
	diffObj.score = game.score // add the cupcake count into things to check diff for
	var dataString = JSON.stringify(diffObj)
	if (dataLastSave !== dataString) {
		Clay.Player.saveUserData({ key: 'data', data: data })
		// separate from the rest for the invite stuff to work properly
		// (can only update on a per-key basis)
		Clay.Player.saveUserData({ key: 'score', data: game.score })
		dataLastSave = dataString
		console.log('Saving data...' + JSON.stringify(data) + ' : ' + game.score)
	}
}

Clay.ready(function() {
	setInterval(saveData, 10000) // save score/etc every 10 seconds
	// grab data
	Clay.Player.onLogin(function() {
		// grab score
		Clay.Player.fetchUserData({ key: 'score' }, function(response) {
			if (response.data)
				game.score = response.data
		})
		// grab other data
		Clay.Player.fetchUserData({ key: 'data' }, function(response) {
			if (response.data) {
				if (response.data.scorePerClick)
					game.cupcakesPerClick = response.data.scorePerClick
				if (response.data.scorePerSecond)
					game.cupcakesPerSecond = response.data.scorePerSecond
        if (response.data.shopItemList)
          game.shopItemList = response.data.shopItemList

        updateScoreText(game)
			}
		})
	})
})
