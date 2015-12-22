const gulp = require('gulp'),
      nodemon = require('gulp-nodemon'),
      lab = require('gulp-lab'),
      coveralls = require('gulp-coveralls'),
      jshint = require('gulp-jshint');

gulp.task('default', ['lint'], () => {
  nodemon({
    script: 'server/app.js',
    watch: ['server'],
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('test:html', () => {
  return gulp
    .src(['server/test/unit/**/*.js'])
    .pipe(lab('-c -C -v --reporter html --output coverage'));
});

gulp.task('test:console', ['lint'], () => {
  gulp
    .src(['server/test/unit/**/*.js'])
    .pipe(lab('-c -C -v -S'))
});

gulp.task('test', () => {
  gulp
    .src(['server/test/unit/**/*.js'])
    .pipe(lab('-r lcov -o lcov.info'))
});

gulp.task('lint', () => {
  return gulp
    .src(['server/**/*.js'])
    .pipe(jshint({ esversion: 6 }))
    .pipe(jshint.reporter('default'));

});

gulp.task('coveralls', () => {
  gulp
    .src('lcov.info')
    .pipe(coveralls());
});