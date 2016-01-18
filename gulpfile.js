var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    gulpSequence = require('gulp-sequence'),
    exec         = require('child_process').execSync,
    reload       = browserSync.reload;

/* Regular JS task, wrapping JSPM CLI */
gulp.task('js', function() {
  exec('npm run js:bundle', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
    else {
      console.log('Build complete!');
    }
  });
});

/* JS build task */
gulp.task('buildjs', ['js'], function () {
  exec('npm run js:build', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
    else {
      console.log('Build complete!');
    }
  });
});

/* Build task */
gulp.task('build', gulpSequence('buildjs'));

gulp.task('serve', ['js'], function() {
  /* Start local static server */
  browserSync({
    notify: false,
    files: ['app/src/scripts/bundle'],
    server: {
      baseDir: ["./app/src", "./app/dist"],
      routes: {
        "/jspm_packages": "jspm_packages"
      }
    }
  });

  /* Watch scripts */
  gulp.watch([
    'app/src/scripts/**/*.js',
    '!app/src/scripts/config.js',
    '!app/src/scripts/bundle.js',
    '!app/src/scripts/bundle.min.js'
  ], ['js', reload]);

  /* Watch html */
  gulp.watch([
    'app/src/*.html'
  ], reload);
});
