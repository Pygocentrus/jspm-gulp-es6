var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    gulpSequence = require('gulp-sequence'),
    htmlmin      = require('gulp-htmlmin'),
    htmlreplace  = require('gulp-html-replace'),
    exec         = require('child_process').execSync,
    reload       = browserSync.reload;

var APP = 'app/src/',
    DIST = 'app/dist/';

/* Regular JS task, wrapping JSPM CLI */
gulp.task('bundle-js', function() {
  exec('npm run js:bundle', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
  });
});

/* JS build task */
gulp.task('build-js', ['bundle-js'], function () {
  exec('npm run js:build', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
  });
});

/* Dist html minification and file rev replacement */
gulp.task('build-html', function () {
  return gulp.src(APP + 'index.html')
    .pipe(htmlreplace({
        scripts: 'scripts/bundle.min.js',
      }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(DIST));
});

/* Build task */
gulp.task('build', gulpSequence('build-js', 'build-html'));

gulp.task('serve', ['bundle-js'], function() {
  /* Start local static server */
  browserSync({
    notify: false,
    files: [APP + 'scripts/bundle'],
    server: {
      baseDir: ['./' + APP, './' + DIST],
      routes: {
        "/jspm_packages": "jspm_packages"
      }
    }
  });

  /* Watch scripts */
  gulp.watch([
    APP + 'scripts/**/*.js',
    '!' + APP + 'scripts/config.js',
    '!' + APP + 'scripts/bundle.js',
    '!' + APP + 'scripts/bundle.min.js'
  ], ['bundle-js', reload]);

  /* Watch html */
  gulp.watch([
    APP + '*.html'
  ], reload);
});
