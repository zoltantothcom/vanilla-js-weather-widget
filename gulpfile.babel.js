'use strict';

const gulp       = require('gulp'),
      browserify = require('browserify'),
      babelify   = require('babelify'),
      source     = require('vinyl-source-stream'),
      buffer     = require('vinyl-buffer'),
      uglify     = require('gulp-uglify'),
      rename     = require('gulp-rename'),
      jshint     = require('gulp-jshint'),
      stylish    = require('jshint-stylish'),
      browSync   = require('browser-sync').create(),
      sass       = require('gulp-sass'),
      pug        = require('gulp-pug'),
      cleanCSS   = require('gulp-clean-css');

gulp.task('watch-js', ['lint-js'], () => {
  return browserify({ entries: './src/js/app.js', debug: true })
    .transform('babelify', { 
      presets: ['es2015'] 
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min' 
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browSync.stream());
});

gulp.task('build-js', ['lint-js'], () => {
  return browserify({ entries: './src/js/weather.js', debug: true })
    .transform('babelify', { 
      presets: ['es2015'] 
    })
    .bundle()
    .pipe(source('weather.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('lint-js', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch-css', function() {
  gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browSync.stream());
});

gulp.task('watch-html', function() {
  gulp.src('./src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browSync.stream());
});

gulp.task('watch', ['watch-js', 'watch-css', 'watch-html'], () => {
  browSync.init({
    server: './docs'
  });

  gulp.watch('./src/js/*.js',     ['watch-js']);
  gulp.watch('./src/scss/*.scss', ['watch-css']);
  gulp.watch('./src/*.pug',       ['watch-html']);;
});

gulp.task('default', ['watch']);
gulp.task('build', ['build-js']);