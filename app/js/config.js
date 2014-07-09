'use strict'

var pink = '/assets/pink.svg'
var purple = '/assets/purple.svg'
var yellow = '/assets/yellow.svg'
var blue = '/assets/blue.svg'

 // note that function calls within update are not optimized,
 // and should be in-lined during some compile step
module.exports = {
   debug: true,
   debugState: {
       startingScore: 0,
       resetShop: true
   },
   maxItems: 15,
   shopItemList: [
     {
       name: 'pink sprinkles',
       cost: 300,
       cps: null,
       action: 'taps +1',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'pink ribbon',
       cost: 350,
       cps: null,
       action: 'taps +1',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'pink cherry',
       cost: 450,
       cps: null,
       action: 'taps +2',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'purple cupcake',
       cost: 1000,
       cps: null,
       action: 'taps +5',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'purple sprinkles',
       cost: 500,
       cps: null,
       action: 'taps +3',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'purple ribbon',
       cost: 650,
       cps: null,
       action: 'taps +3',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'purple cherry',
       cost: 1000,
       cps: null,
       action: 'taps +4',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'yellow cupcake',
       cost: 2000,
       cps: null,
       action: 'taps +10',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'yellow sprinkles',
       cost: 1000,
       cps: null,
       action: 'taps +4',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'yellow ribbon',
       cost: 1000,
       cps: null,
       action: 'taps +4',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'yellow cherry',
       cost: 1250,
       cps: null,
       action: 'taps +5',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'blue cupcake',
       cost: 2500,
       cps: null,
       action: 'taps +10',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'blue sprinkles',
       cost: 1500,
       cps: null,
       action: 'taps +6',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'blue stars',
       cost: 1500,
       cps: null,
       action: 'taps +6',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'blue cherry',
       cost: 2000,
       cps: null,
       action: 'taps +10',
       owned: 0,
       visible: false,
       type: 'upgrade'
     },
     {
       name: 'icing machine',
       cost: 15,
       cps: 0.1,
       owned: 0,
       visible: false
     },
     {
       name: 'icing farm',
       cost: 100,
       cps: 0.5,
       owned: 0,
       visible: false
     },
     {
       name: 'icing factory',
       cost: 500,
       cps: 4,
       owned: 0,
       visible: false
     },
     {
       name: 'icing mines',
       cost: 3000,
       cps: 10,
       owned: 0,
       visible: false
     },
     {
       name: 'icing shipment',
       cost: 10000,
       cps: 40,
       owned: 0,
       visible: false
     },
     {
       name: 'icing lab',
       cost: 40000,
       cps: 100,
       owned: 0,
       visible: false
     },
     {
       name: 'icing portal',
       cost: 200000,
       cps: 400,
       owned: 0,
       visible: false
     },
     {
       name: 'time machine',
       cost: 1666666,
       cps: 6666,
       owned: 0,
       visible: false
     },
     {
       name: 'antimatter',
       cost: 123456789,
       cps: 98765,
       owned: 0,
       visible: false
     },
     {
       name: 'prism',
       cost: 3999999999,
       cps: 999999,
       owned: 0,
       visible: false
     }
    ],
    itemCostScale: 1.15,
    shopUI: {
        itemHeight: 52,
        shopHeight: 380
    },
    cupcakeSprites: {
        width: 228,
        height: 324,

        

        svgOptions: 
        [
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
    cupcakeText: {
        descriptiveTexts: {
            'BILLION CUPCAKES!!': 1000000000, // billions
            'Million Cupcakes!': 1000000
        },
        descriptiveDecimalPlaces: 2
    },
    cupcakeLimit: 10000000000 // 10 billion cupcakes
 }
