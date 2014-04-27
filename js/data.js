function saveData() {
	var data = { scorePerClick: game.cupcakesPerClick, scorePerSecond: game.cupcakesPerSecond }
	Clay.Player.saveUserData({ key: 'data', data: data })
	// separate from the rest for the invite stuff to work properly
	// (can only update on a per-key basis)
	Clay.Player.saveUserData({ key: 'cupcakes', data: game.score }))
}

Clay.ready(function() {
	setInterval( saveData, 3000 ) // save score/etc every 3 seconds
})