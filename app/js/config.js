'use strict'

var pink = '/assets/pink.svg'
var purple = '/assets/purple.svg'
var yellow = '/assets/yellow.svg'
var blue = '/assets/blue.svg'

// note that function calls within update are not optimized,
// and should be in-lined during some compile step
module.exports = {

  // DEBUG
  debug: false,
  debugState: {
    startingScore: 0,
    resetShop: true
  },

  // SHOP
  shopItemList: createShopItemList(),
  maxItems: 15,
  itemCostScale: 1.15,

  shopUI: {
    itemHeight: 52,
    shopHeight: 380
  },

  // CUPCAKES
  cupcakeSprites: {
    width: 228,
    height: 324,

    svgOptions: [
      { 
        file: pink,
        items: [ ]
      },
      {
        file: pink,
        items: [ 'sprinkles' ]
      },
      {
        file: pink,
        items: [ 'sprinkles', 'ribbon' ]
      },
      {
        file: pink,
        items: [ 'sprinkles', 'ribbon', 'cherry' ]
      },
      {
        file: purple,
        items: [ ]
      },
      {
        file: purple,
        items: [ 'sprinkles' ]
      },
      {
        file: purple,
        items: [ 'sprinkles', 'ribbon' ]
      },
      {
        file: purple,
        items: [ 'sprinkles', 'ribbon', 'cherry' ]
      },
      {
        file: yellow,
        items: [ ]
      },
      {
        file: yellow,
        items: [ 'sprinkles' ]
      },
      {
        file: yellow,
        items: [ 'sprinkles', 'ribbon' ]
      },
      {
        file: yellow,
        items: [ 'sprinkles', 'ribbon', 'cherry' ]
      },
      {
        file: blue,
        items: [ ]
      },
      {
        file: blue,
        items: [ 'sprinkles' ]
      },
      {
        file: blue,
        items: [ 'sprinkles', 'stars' ]
      },
      {
        file: blue,
        items: [ 'sprinkles', 'stars', 'cherry' ]
      }
    ]
  },

  // SCORE TEXT
  cupcakeText: {
    descriptiveTexts: {
      'BILLION CUPCAKES!!': 1000000000, // billions
      'Million Cupcakes!': 1000000
    },
    descriptiveDecimalPlaces: 2
  },

  // ENDGAME
  cupcakeLimit: 1000000 // 1 million cupcakes
}

function createShopItemList() {

  var upgradeInfo = [
    { name: 'pink sprinkles', taps: 1 },
    { name: 'pink ribbon', taps: 1 },
    { name: 'pink cherry', taps: 2 },
    { name: 'purple cupcake', taps: 5 },
    { name: 'purple sprinkles', taps: 3 },
    { name: 'purple ribbon', taps: 3 },
    { name: 'purple cherry', taps: 4 },
    { name: 'yellow cupcake', taps: 10 },
    { name: 'yellow sprinkles', taps: 4 },
    { name: 'yellow ribbon', taps: 4 },
    { name: 'yellow cherry', taps: 5 },
    { name: 'blue cupcake', taps: 10 },
    { name: 'blue sprinkles', taps: 6 },
    { name: 'blue stars', taps: 6 },
    { name: 'blue cherry', taps: 10 }
  ]

  var itemNames = [
    'icing machine',
    'icing farm',
    'icing factory',
    'icing mines',
    'icing shipment',
    'icing lab',
    'icing portal',
    'time machine',
    'antimatter',
    'prism'
  ]

  // use loops to initialize the item configurations because most share
  // repetive attributes
  var upgrades = upgradeInfo.length
  var items = itemNames.length

  var i = 0

  var shopItemList = new Array()

  // cupcake upgrades
  for (var j = 0; j < upgrades; ++j) {
    shopItemList[i] = {
      name: upgradeInfo[j].name,
      cost: upgradeCost(j + 1),
      action: 'taps +' + upgradeInfo[j].taps,
      owned: 0,
      visible: false,
      type: 'upgrade'
    }
    
    ++i
  }

  // items
  for (var k = 0; k < items; ++k) {
    shopItemList[i] = {
      name: itemNames[k],
      cost: itemCost(k + 1),
      cps: itemCPS(k + 1),
      owned: 0,
      visible: false
    }

    ++i
  }

  return shopItemList
}

// use mathematical functions to determine the cost and performance of most items
function upgradeCost(i) {
  var upgrades = 15
  var endPrice = 50000 // cost of the last cupcake decoration

  var t = i / upgrades // from 0 to 1, the progression position of the item

  return Math.round(Math.pow(t, 3) * endPrice)
}

function itemCost(i) {
  var items = 10 // there are 10 items
  var endPrice = 30000 // cost of the prism

  var t = i / items

  return Math.round(Math.pow(t, 3) * endPrice)
}

function itemCPS(i) {
  return itemCost(i) / 120 // after 2 minutes, items pay for themselves
}
