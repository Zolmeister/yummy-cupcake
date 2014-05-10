var gulp = require('gulp')
var shell = require('gulp-shell')
var concat = require('gulp-concat-sourcemap')
var footer = require('gulp-footer')
var rename = require('gulp-rename');

var paths = {
  scripts: ['./app/init.js', './app/js/**/*.js', './app/lib/**/*.js'],
  vendor: './app/vendor/*.js',
  index: './app/index.html'
}

gulp.task('scripts', function () {
  return gulp.src('app/init.js')
    .pipe(shell([
      'browserify app/init.js -d -o app/dist/bundle.js'
    ]))
})

gulp.task('vendor:concat', function () {
  gulp.src('./app/vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./app/dist/'))
})

gulp.task('appcache', function () {
  gulp.src('./app/cache.appcache.tpl')
    .pipe(rename('cache.appcache'))
    .pipe(footer('\n#' + Date.now()))
    .pipe(gulp.dest('./app/'))
})

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.vendor, ['vendor:concat'])
  gulp.watch(paths.index, ['appcache'])
})

gulp.task('default', ['scripts', 'vendor:concat', 'appcache', 'watch'])
