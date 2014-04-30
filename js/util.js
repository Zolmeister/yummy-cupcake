function getCupcakesText(n) {
  return Math.floor(n) + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n.toFixed(1) + ' per second'
}

function getItemCost(item) {
  return Math.round(item.cost * Math.pow(1.15, item.owned))
}

function updateScoreText(game) {
  if(game.scoreText) {
    game.scoreText.setText(getCupcakesText(game.score))
    if (Math.floor(game.score).toString().length > 8) {
      game.scoreText.setStyle({
        font: '35px sansus',
        fill: '#fff',
        stroke: '#ee508c',
        strokeThickness: 5
      })
    }
  }
}
