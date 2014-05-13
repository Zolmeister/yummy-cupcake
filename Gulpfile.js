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
var sensitive = require('./sensitive.js') // passwords, keys, etc... use sensitive.js.template as base
var runSequence = require('run-sequence')

var paths = {
  scripts: ['./app/init.js', './app/js/**/*.js', './app/lib/**/*.js'],
  vendor: './app/vendor/*.js',
  index: './app/index.html',
  styles: './app/css/style.css',
  dist: './app/dist/',
  build: './build/',
  appcache: './cache.appcache'
}

gulp.task('scripts', function () {
  return browserify('./app/init.js')
    .bundle({debug:true})
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('lint:scripts', function () {
  return gulp.src(['./app/js/**/*.js', './app/lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('vendor', function () {
  return gulp.src(paths.vendor)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
})

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('appcache', function () {
  return gulp.src(paths.appcache)
    .pipe(footer('\n#' + Date.now()))
    .pipe(gulp.dest(paths.build))
})

gulp.task('copy:index', function () {
  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.build))
})

gulp.task('copy:scripts', function () {
  return gulp.src('./app/dist/bundle.js')
    .pipe(rename('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/dist/'))
})

gulp.task('copy:vendor', function () {
  return gulp.src('./app/dist/vendor.js')
    .pipe(rename('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/dist/'))
})

gulp.task('copy:css', function () {
  return gulp.src('./app/dist/bundle.css')
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./build/dist/'))
})

gulp.task('copy:assets', function () {
  return gulp.src('./app/assets/**/*.*')
    .pipe(gulp.dest(paths.build + 'assets/'))
})

var aws = {
  'key': sensitive.AWS_KEY,
  'secret': sensitive.AWS_SECRET,
  'bucket': sensitive.S3_BUCKET,
  'region': sensitive.S3_REGION,
  'distributionId': sensitive.CLOUDFRONT_DISTRIBUTION_ID,
  'headers': {'Cache-Control': 'max-age=315360000, no-transform, public'}
}
gulp.task('publish:cloudfront', function () {
  return gulp.src('build/**/*.*')
    .pipe(revall())
    .pipe(gzip())
    .pipe(s3(aws, {gzippedOnly: true}))
    .pipe(cloudfront(aws))
})

gulp.task('clean:build', function () {
  return gulp.src([paths.dist, paths.build], {read: false})
        .pipe(clean())
})

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

gulp.task('copy:all', ['copy:index', 'copy:scripts', 'copy:vendor', 'copy:css', 'copy:assets'])
gulp.task('dev', function(cb) {
  runSequence('lint:scripts', 'vendor', 'scripts', 'styles', cb) // run in series
                                                          // ^^ necessary to make 'dev' synchronous
})
gulp.task('default', ['server', 'dev', 'watch'])
gulp.task('build', function(cb) {
  runSequence('clean:build', 'dev', 'appcache', 'copy:all', cb) // run in series
                                                         // ^^ necessary to make 'build' synchronous
})
gulp.task('publish', function() {
  runSequence('build', 'publish:cloudfront') // run in series
})