'use strict';

var gulp = require('gulp')
var concat = require('gulp-concat')
var footer = require('gulp-footer')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var browserify = require('browserify')
var clean = require('gulp-clean')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var nodemon = require('gulp-nodemon')
var jshint = require('gulp-jshint')
var s3 = require('gulp-s3')
var revall = require('gulp-rev-all')
var gzip = require('gulp-gzip')
var cloudfront = require('gulp-cloudfront')

// passwords, keys, etc... use sensitive.js.template as base
var sensitive = require('./sensitive.js')
var runSequence = require('run-sequence')

// TODO: Separate out into mulitple files
var outFiles = {
  scripts: 'bundle.js',
  styles: 'bundle.css',
  vendors: 'vendor.js'
}

var paths = {
  scripts: ['./app/init.js', './app/js/**/*.js', './app/lib/**/*.js'],
  init: './app/init.js',
  vendor: './app/vendor/*.js',
  index: './app/index.html',
  styles: './app/css/style.css',
  dist: './app/dist/',
  build: './build/',
  appcache: './cache.appcache',
  buildDist: './build/dist/',
  assets: './app/assets/**/*.*'
}

var aws = {
  'key': sensitive.AWS_KEY,
  'secret': sensitive.AWS_SECRET,
  'bucket': sensitive.S3_BUCKET,
  'region': sensitive.S3_REGION,
  'distributionId': sensitive.CLOUDFRONT_DISTRIBUTION_ID,
  'headers': {'Cache-Control': 'max-age=315360000, no-transform, public'}
}

// create revisions (filename-random.extension, gzip, upload to s3, update cloudfront)
gulp.task('publish:cloudfront', function () {
 return gulp.src('build/**/*.*')
   .pipe(revall({skip: ['vendor.js'], hashLength: 6}))
   .pipe(gzip())
   .pipe(s3(aws, {gzippedOnly: true}))
   .pipe(cloudfront(aws))
})

// copy files from app/* to build/*
gulp.task('copy:all', ['copy:index', 'copy:scripts', 'copy:vendor', 'copy:css', 'copy:assets'])

// lint and compile sources
//gulp.task('dev', ['lint:scripts', 'vendor', 'scripts', 'styles'])
gulp.task('dev', function(cb) {

  // run in series
  runSequence('lint:scripts', 'vendor', 'scripts', 'styles', cb)
})

gulp.task('publish', function() {
  
  // run in series
  runSequence('build', 'publish:cloudfront')
})

// start the dev server, and auto-update
gulp.task('default', ['server', 'dev', 'watch'])

// build for production
//gulp.task('build', ['clean:build', 'dev', 'appcache', 'copy:all'])
gulp.task('build', function(cb) {
	
	// run in series
  runSequence('clean:build', 'dev', 'appcache', 'copy:all', cb)
                                                         // ^^ necessary to make 'build' synchronous
})


/*
 * Dev compilation
 *
 */

// init.js --> dist/bundle.js
gulp.task('scripts', function () {
  return browserify(paths.init)
    .bundle({debug:true})
    .pipe(source(outFiles.scripts))
    .pipe(gulp.dest(paths.dist))
})

// vendor/*.js --> dist/vendor.js
gulp.task('vendor', function () {
  return gulp.src(paths.vendor)
    .pipe(sourcemaps.init())
    .pipe(concat(outFiles.vendors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
})

// css/style.css --> dist/bundle.css
gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(rename(outFiles.styles))
    .pipe(gulp.dest(paths.dist))
})

// run jshint
gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})



/*
 * Dev server and watcher
 *
 */

// start the dev server
gulp.task('server', function () {

  // Don't actually watch for changes, just run the server
  return nodemon({script: 'server.js', ext: 'null'})
})

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint:scripts', 'scripts'])
  gulp.watch(paths.vendor, ['vendor:concat'])
  gulp.watch(paths.index, ['appcache'])
  gulp.watch(paths.styles, ['styles'])
})



/*
 * Production compilation
 *
 */

// cache.appcache --> build/cache.appcache
gulp.task('appcache', function () {
  return gulp.src(paths.appcache)
    .pipe(footer('\n#' + Date.now()))
    .pipe(gulp.dest(paths.build))
})

// index.html --> build/index.html
gulp.task('copy:index', function () {
  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.build))
})

// bundle.js --> build/dist/bundle.js
gulp.task('copy:scripts', function () {
  return gulp.src(paths.dist + outFiles.scripts)
    .pipe(rename(outFiles.scripts))
    //.pipe(uglify())
    .pipe(gulp.dest(paths.buildDist))
})

// vendor.js --> build/dist/vendor.js
gulp.task('copy:vendor', function () {
  return gulp.src(paths.dist + outFiles.vendors)
    .pipe(rename(outFiles.vendors))
    .pipe(uglify())
    .pipe(gulp.dest(paths.buildDist))
})

// bundle.css --> build/dist/bundle.css
gulp.task('copy:css', function () {
  return gulp.src(paths.dist + outFiles.styles)
    .pipe(rename(outFiles.styles))
    .pipe(gulp.dest(paths.buildDist))
})

// assets --> build/assets
gulp.task('copy:assets', function () {
  return gulp.src(paths.assets)
    .pipe(gulp.dest(paths.build + 'assets/'))
})

// rm build && rm app/dist
gulp.task('clean:build', function () {
  return gulp.src([paths.dist, paths.build], {read: false})
        .pipe(clean())
})
