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
  return gulp.src('./app/assets')
    .pipe(gulp.dest(paths.build))
})

gulp.task('clean:build', function () {
  return gulp.src(paths.dist, {read: false})
        .pipe(clean())
        .pipe(gulp.src(paths.build, {read: false}))
        .pipe(clean())
})

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.vendor, ['vendor:concat'])
  gulp.watch(paths.index, ['appcache'])
  gulp.watch(paths.styles, ['styles'])
})

gulp.task('copy:all', ['copy:index', 'copy:scripts', 'copy:vendor', 'copy:css', 'copy:assets'])

gulp.task('default', ['vendor', 'scripts', 'styles', 'watch'])
gulp.task('build', ['clean:build', 'vendor', 'scripts', 'styles', 'appcache', 'copy:all'])
