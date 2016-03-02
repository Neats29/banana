var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    cucumber = require('gulp-cucumber'),
    ngAnnotate = require('gulp-ng-annotate'),
    shell = require('gulp-shell');

// Shortcut paths to locate js and sass files
var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/**/*.js']
};


// Default Task
// Running the default task will create the dist js and css files, which are referenced in index.html
gulp.task('default', ['sass', 'scripts']);


// Sass compiler
gulp.task('sass', function(done) {
  gulp.src('./scss/main.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/dist/css/'))

    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/dist/css/'))
    .on('end', done);
});


// The scripts task bundles www/js/app.js with all variables - and their respective dependancies - declared at the top of it's page.
// The resulting app.js file is piped to dist/js, along with a minified version (app.min.js), which is referenced in index.html.
gulp.task('scripts', function() {
  gulp.src(['./www/js/app.js'])
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(ngAnnotate())
    .on('error', scripts.logError)
    .pipe(gulp.dest('./www/dist/js/'))

    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./www/dist/js/'))
});


// The Watch task looks for any changes to the js and css files in www, then recompiles the .min scripts in dist.
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts'])
});


// Deploy Tasks
// Each task will increment the Git tag and deploy the specified platform to HockeyApp
gulp.task('deploy-Android', shell.task([
  './deploy-scripts/deploy-tags.sh',
  'ionic build android',
  'ionic build --release android',
  './deploy-scripts/deploy-android.sh'
]));

gulp.task('deploy-iOS', shell.task([
  './deploy-scripts/deploy-tags.sh',
  'ionic build ios',
  './deploy-scripts/deploy-ios.sh'
]));


// Install task
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});


// Git-check task
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


// Cucumber task
gulp.task('cucumber', function() {
    return gulp.src('/features/*').pipe(cucumber({
        'steps': '/features/step_definitions/*_steps.js',
        'format': 'summary'
    }));
});
