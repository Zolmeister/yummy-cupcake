'use strict';

var express = require('express')
var app = express()

if (process.NODE_ENV === 'production') {
  app.use(express['static'](__dirname + '/build'))
} else {
  app.use(express['static'](__dirname + '/app'))
}


app.listen(process.env.PORT || 3000)
console.log('Listening on port', process.env.PORT || 3000)
