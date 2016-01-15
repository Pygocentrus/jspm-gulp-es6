var gulp = require('gulp'),
    exec = require('child_process').execSync,
    jspm = require('gulp-jspm-build');

gulp.task('jspm', function(){
  jspm({
    bundleOptions: {
      minify: false,
      mangle: false
    },
    bundles: [
      {
        src: 'app/src/scripts/app.js - jquery - lodash',
        dst: 'bundle.js'
      },
      {
        src: 'jquery + lodash',
        dst: 'vendors.js',
        options: {
          mangle: false
        }
      }
    ]
  })
  .pipe(gulp.dest('app/src/scripts'));
});

gulp.task('jspm:build', function(){
  jspm({
    bundleOptions: {
      minify: true,
      mangle: true
    },
    bundles: [
      { src: 'app/src/scripts/app.js', dst: 'bundle.min.js' },
    ],
    bundleSfx: true
  })
  .pipe(gulp.dest('app/dist/scripts'));
});

// gulp.task('js', function() {
//   exec('npm run js', function (err, stdout, stderr) {
//     if (err) {
//       throw err;
//     }
//     else {
//       console.log('Build complete!');
//     }
//   });
// });
//
// gulp.task('buildjs', function () {
//   exec('npm run buildjs', function (err, stdout, stderr) {
//     if (err) {
//       throw err;
//     }
//     else {
//       console.log('Build complete!');
//     }
//   });
// });
