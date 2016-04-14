const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

//TODO: add babel so es6 modules can be used
// const babel = require('gulp-babel');

// const scripts = {};
// scripts.source = 'app/assets/js/**/*.js';
// scripts.dest = 'app/assets/js';
// scripts.sassOptions = {
//   errLogToConsole: true,
//   outputStyle: 'expanded'
// }
// gulp.task('babel', function () {
//   return gulp
//     .src(scripts.source)
//     .pipe(babel({presets: ['es2015']}))
//     .pipe(gulp.dest('dist'))
// });

const styles = {};
styles.source = 'app/assets/scss/**/*.scss';
styles.dest = 'app/assets/css';
styles.sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}
styles.autoprefixerOptions = {
  browsers: ['last 10 versions']
};

gulp.task('sass', function () {
  return gulp
    .src(styles.source)
    .pipe(sourcemaps.init())
    .pipe(sass(styles.sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(styles.dest));
});

gulp.task('watch', function() {
  return gulp
    .watch(styles.source, ['sass'])
    .on('change', function(event) {
      console.log(event.type + ': ' + event.path + ', run sass');
    });
});

gulp.task('default', ['sass', 'watch']);
