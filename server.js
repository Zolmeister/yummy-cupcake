'use strict';

// Static assets
var express = require('express')
var app = express()

if (process.NODE_ENV === 'production') {
  app.use(express['static'](__dirname + '/build'))
} else {
  app.use(express['static'](__dirname + '/app'))
}


app.listen(process.env.PORT || 3000)
console.log('Listening on port', process.env.PORT || 3000)


// fb-flo - for live reload
var flo = require('fb-flo'),
    fs = require('fs')

flo(
  'app',
  {
    port: 8888,
    host: 'localhost',
    verbose: false,
    glob: [
      'dist/vendor.js',
      'dist/bundle.js',
      'dist/bundle.css'
    ]
  },
  function resolver(filepath, callback) {
    callback({
      resourceURL: filepath,
      contents: fs.readFileSync('app/' + filepath).toString()
    });
  }
)
