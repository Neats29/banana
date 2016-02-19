var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var cucumber = require('gulp-cucumber');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/*.js']
};

gulp.task('default', ['sass', '']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/dist/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/dist/css/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  
  // Uses app.js as a single entry point to determine module dependancies. 
  // ToDo: Add uniminified js file to the dist js folder
  gulp.src(['./www/js/app.js'])
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    // ToDo: Install ng-annotate to prevent variables from being renames
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./www/dist/js/'))
    .pipe(uglify()) 
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./www/dist/js/'))

  // Imports the bootstrap css library (angular-ui-bootstrap dependancy) 
  // ToDo: Remove this once the CSS library is imported through Sass   
  // gulp.src(['./node_modules/bootstrap/dist/css/*'])
  // .pipe(gulp.dest('./www/lib/bootstrap/css/')) 
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts'])
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('cucumber', function() {
    return gulp.src('/features/*').pipe(cucumber({
        'steps': '/features/step_definitions/*_steps.js',
        'format': 'summary'
    }));
});
