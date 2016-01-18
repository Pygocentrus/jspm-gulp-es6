var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    rename       = require('gulp-rename'),
    browserSync  = require('browser-sync'),
    gulpSequence = require('gulp-sequence'),
    htmlmin      = require('gulp-htmlmin'),
    htmlreplace  = require('gulp-html-replace'),
    sass         = require('gulp-sass'),
    autoprefix   = require('gulp-autoprefixer'),
    minifyCSS    = require('gulp-cssnano'),
    sourcemaps   = require('gulp-sourcemaps'),
    exec         = require('child_process').execSync,
    stream       = browserSync.stream,
    reload       = browserSync.reload;

var APP   = 'app/src/',
    DIST  = 'app/dist/',
    PROXY = '';

/* Regular JS task, wrapping JSPM CLI */
gulp.task('bundle-js', function() {
  exec('npm run js:bundle', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
  });
});

/* Compile sass into CSS & auto-inject into browsers */
gulp.task('bundle-styles', function () {
  return gulp.src(APP + 'styles/main.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefix({ browsers: ['last 2 versions'] }))
      .pipe(rename('app.css'))
      .pipe(gulp.dest(APP + 'styles'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(APP + 'styles'))
    .pipe(stream());
});

gulp.task('build-styles', ['bundle-styles'], function() {
  return gulp.src(APP + 'styles/app.css')
    .pipe(minifyCSS({ keepSpecialComments: 0, advanced: false }))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest(DIST + 'styles'));
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
        styles: 'styles/bundle.min.css',
        scripts: 'scripts/bundle.min.js'
      }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(DIST));
});

/* Build task */
gulp.task('build', gulpSequence('build-js', 'build-styles', 'build-html'));

gulp.task('serve', ['bundle-js', 'bundle-styles'], function() {

  // BrowserSync options
  var options = {
    notify: false,
    files: [APP + 'scripts/bundle']
  };

  // Allow proxying the app through a custom server
  if (PROXY && PROXY !== '') {
    options['proxy'] = PROXY;
  } else {
    options['server'] = {
      baseDir: ['./' + APP, './' + DIST],
      routes: {
        "/jspm_packages": "jspm_packages"
      }
    };
  }

  /* Start local static server */
  browserSync(options);

  /* Watch scripts */
  gulp.watch([
    APP + 'scripts/**/*.js',
    '!' + APP + 'scripts/config.js',
    '!' + APP + 'scripts/bundle.js',
    '!' + APP + 'scripts/bundle.min.js'
  ], ['bundle-js', reload]);

  /* Watch styles */
  gulp.watch([
    APP + 'styles/**/*.scss'
  ], ['bundle-styles']);

  /* Watch html */
  gulp.watch([
    APP + '*.html'
  ], reload);
});

/* Errors handler */
function onError (err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>"
  })(err);

  this.emit('end');
};
