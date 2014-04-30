function getCupcakesText(n) {
  return n + ' Cupcakes'
}

function getCupcakesPerSecondText(n) {
  return n.toFixed(1) + ' per second'
}

function getItemCost(item) {
  return Math.round(item.cost * Math.pow(1.15, item.owned))
}
