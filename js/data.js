var saveData = (function() {

  // var so we can tell if data has changed (and only update if it has). Stored as string
  var lastDataSave = ''
  var lastScoreSave = -1

  return function saveData() {
    var data = { shopItemList: game.shopItemList }
    var dataString = JSON.stringify(data)

    if (lastDataSave !== dataString) {
      Clay.Player.saveUserData({ key: 'data', data: data })
      console.log('Saving data...')
      lastDataSave = dataString
    }

    // separate from the rest for the invite stuff to work properly
    // (can only update on a per-key basis)
    if (lastScoreSave !== game.score) {
      Clay.Player.saveUserData({ key: 'score', data: game.score })
      console.log('Saving score', game.score)
      lastScoreSave = game.score
    }
  }
})()

Clay.ready(function() {
	setInterval(saveData, 10000) // save score/etc every 10 seconds
	// grab data
	Clay.Player.onLogin(function() {
		// grab score
		Clay.Player.fetchUserData({ key: 'score' }, function(response) {
			if (response.data) {
				game.score = response.data
        updateScoreText(game)
      }
		})
		// grab other data
		Clay.Player.fetchUserData({ key: 'data' }, function(response) {
			if (response.data && response.data.shopItemList) {
        game.shopItemList = response.data.shopItemList
        updateCPS(game)
			}
		})
	})
})
