/*
* Compile SCSS to CSS, remove unused CSS styles, minify and concatenate JS, compress HTML and append a version number to CSS and JS includes to bust cache
* All the final files end up in the /dist directory
* Run this command to install plugins: npm install gulp-sass gulp-concat gulp-uglify gulp-rename gulp-replace gulp-uglifycss gulp-htmlmin gulp-rev-append critical --save-dev
*/

// Include gulp
var gulp = require('gulp');

// Include Plugins
var uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev-append'),
    critical = require('critical');

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

// Compile Sass, remove unused classes and minify CSS
gulp.task('css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass(), {outputStyle: ':compact'})
    .on('error', swallowError)
    .pipe(gulp.dest('dist/css'))
    .pipe(uglifycss({ // Minify CSS
      "max-line-len": 80
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

// Compress HTML file and remove debucsser tool
gulp.task('html', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeCommentsFromCDATA: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(replace('dist/', ''))
    .pipe(replace('<script src="src/debucsser.js"></script>', ''))
    .pipe(gulp.dest('dist'))
});

// Concatenate & Minify JS. Exclude the /individual directory
gulp.task('js', function() {
  return gulp.src(['src/js/plugins/*.js', 'src/js/scripts.js', '!src/js/individual/*'])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest('dist/js'));
});

// Minify JS in the /individual directory (eg. files we want to load separate to the main payload)
gulp.task('js-individual', function() {
  return gulp.src(['src/js/individual/*.js'])
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest('dist/js'));
});

// Add revision number to JS and CSS
gulp.task('rev', function() {
  gulp.src('index.html')
    .pipe(rev())
    .pipe(gulp.dest('.'));
});

// Copy all the images into /dist/images
gulp.task('copy-images', function() {
  gulp.src('src/images/**')
    .pipe(gulp.dest('dist/images/'));
});

// Copy the service worker into /dist
gulp.task('copy-sw', function() {
  gulp.src('src/sw.js')
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest('dist/'));
});

gulp.task('critical', function (cb) {
  critical.generate({
    base: './',
    src: 'index.html',
    css: ['dist/css/style.css'],
    dimensions: [{
      width: 350,
      height: 480
    }],
    dest: 'dist/css/critical.css',
    minify: true,
    extract: false,
    ignore: ['font-face']
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['css', 'rev', 'critical']); //
  gulp.watch('src/js/**/*.js', ['js', 'js-individual', 'rev']);
  gulp.watch('src/sw.js', ['copy-sw']);
  gulp.watch('src/images/**', ['copy-images']);
  gulp.watch('*.html', ['html']);
});

// Default Task
gulp.task('default', ['css', 'js', 'js-individual', 'copy-sw', 'copy-images', 'rev', 'html', 'watch']); //, 'critical'

