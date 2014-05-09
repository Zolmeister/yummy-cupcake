var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('default', function() {
    var bundleStream = browserify('./app/init.js').bundle({
      browserify: {
        transform: ['browserify-shim']
      },
      'browserify-shim': {
        './app/lib/phaser.js' : {
          exports: 'phaser'
        }
      }
    }).pipe(source('bundle.js'));
    return bundleStream.pipe(gulp.dest('./app/dist'));
});
