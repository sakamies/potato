var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var styles = {};
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
