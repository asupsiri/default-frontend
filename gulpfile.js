/* DEPENDENCIES & PLUGINS =================================================== */
// gulp-sass        Sass plugin for Gulp.
// autoprefixer     Parse CSS and add vendor prefixes to rules by Can I Use.
// livereload       Monitors files for changes and reloads your web browser.
// pump             Cleaner syntax (no need for .pipe), streamlined error handling, and pipe multiple streams.
// run-sequence     Run tasks sequentially. Will be deprecated come Gulp 4.0.
// gulp-uglify      JavaScript parser, mangler/compressor and beautifier toolkit.

var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var del             = require('del');

// Gulp plugins:
var autoprefixer    = require('autoprefixer');
var concat          = require('gulp-concat');
var cssnano         = require('cssnano');
var gutil           = require('gulp-util');
var livereload      = require('gulp-livereload');
var modernizr       = require('gulp-modernizr');
var newer           = require('gulp-newer');
var notify          = require('gulp-notify');
var postcss         = require('gulp-postcss');
var pump            = require('pump');
var require         = require('requirejs');
var runSequence     = require('run-sequence');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var uglify          = require('gulp-uglify');

/* GULPFILE GLOBALS ========================================================= */
var isProd = gutil.env.type === 'prod';
var reload = browserSync.reload;

var src = {
  dir:        'src',
  styles:     'src/scss/**/*',
  html:       'src/html/**/*.html',
  fonts:      'src/fonts/**/*',
  images:     'src/images/**/*',
  scripts:    'src/js/**/*',
  standaloneScripts: [
              'src/js/**/*',
              '!src/js/plugins.js',
              '!src/js/vendor/jquery-plugins/**/*',
              '!node_modules/remodal/dist/remodal.min.js'
  ],
  mergeScripts: {
    standard: {
      files: [
              'src/js/plugins.js'
      ],
      name:   'scripts.js'
    },
    jquery: {
      files: [
              'src/js/vendor/jquery-plugins/**/*',
              'node_modules/remodal/dist/remodal.min.js'
      ],
      name:   'jquery-scripts.js'
    }
  },
  standaloneStyles: 	'src/css/cms-request.css'
};
var dest = {
  dir:        'public',
  styles:     'public/css',
  fonts:      'public/fonts',
  images:     'public/images',
  scripts:    'public/js'
};
var tomcat = {
  css:        '../bootstrap/webfiles/src/main/resources/site/css',
  fonts:      '../site/target/site/fonts',
  images:     '../site/target/site/images',
  scripts:    '../bootstrap/webfiles/src/main/resources/site/js'
};


/* OPTIONS & CONFIGS ======================================================== */

var options = {
  sass: {
    includePaths: [
      'node_modules/node-normalize-scss',
      'node_modules/bourbon/app/assets/stylesheets',
      'node_modules/bourbon-neat/app/assets/stylesheets',
      'node_modules/avalanche-css',
      'node_modules/remodal/dist'
    ],
    outputStyle: 'expanded',
    precision: 10
  },
  postcssProcessors: [
    autoprefixer({browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
    cssnano()
  ],
  uglify: {
    mangle: false,
    preserveComments: 'license'
  },
  browsersync: {
    server: {
      baseDir: dest.dir
    }
  }
};


/* GULP TASKS =============================================================== */

gulp.task('build', function(cb){
  runSequence(
    ['build-entry', 'build-clean'],
    ['copy:html', 'copy:standaloneScripts', 'scripts', 'modernizr', 'fonts', 'copy:standaloneStyles', 'styles', 'images'],
    cb
  );
});

gulp.task('build-entry', function(cb){
	console.log("--------------------------------------------------------------------------------\n");
	console.log("Gulp Build \n");
	console.log("--------------------------------------------------------------------------------\n");
  cb();
});

/* Gulp task to empty the /public directory */
gulp.task('build-clean', function() {
  return del([dest.dir + '/**/*', '!' + dest.dir]);
});

/* Gulp task to copy certain static html files as-is (no concatenation nor minfification) from src to public */
gulp.task('copy:html', function(cb) {
  pump([
    gulp.src(src.html, {base:"src/html"}),
    gulp.dest(dest.dir),
    browserSync.reload({stream: true})
    ],
    cb
  );
});

/* Gulp task to copy certain scripts as-is (no concatenation or uglification) from src to public */
gulp.task('copy:standaloneScripts', function(cb) {
  pump([
    gulp.src(src.standaloneScripts, {base:"src/js"}),
    //newer(dest.scripts),
    uglify(options.uglify),
    gulp.dest(tomcat.scripts),
    gulp.dest(dest.scripts)
    ],
    cb
  );
});

/* Gulp task to pre-process JavaScript and deliver the concatenated + minified JS output */
gulp.task('scripts', function() {
  mergeScripts(src.mergeScripts.standard.files, src.mergeScripts.standard.name);
  mergeScripts(src.mergeScripts.jquery.files, src.mergeScripts.jquery.name);
});

/* Create custom Modernizr file based on references in JS files. */
gulp.task('modernizr', function(cb) {
  pump([
    gulp.src(src.scripts),
    modernizr(),
    uglify(options.uglify),
    gulp.dest(dest.scripts)
    ],
    cb
  );
});

/* Gulp task to process images and deliver the optimized output  ==== */
gulp.task('images', function(cb) {
  pump([
    gulp.src(src.images),
    // copy to tomcat
    gulp.dest(tomcat.images),
    // send livereload's reload signal
    livereload(),
    gulp.dest(dest.images),
    browserSync.reload({stream: true})
    ],
    cb
  );
});

gulp.task('fonts', function(cb) {
  pump([
    gulp.src(src.fonts),
    newer(dest.fonts),
    gulp.dest(tomcat.fonts),
    gulp.dest(dest.fonts)
    ],
    cb
  );
});

/* Gulp task to copy certain css as-is (no concatenation or minfification) from src to public */
gulp.task('copy:standaloneStyles', function(cb) {
  pump([
    gulp.src(src.standaloneStyles),
    newer(dest.styles),
    gulp.dest(tomcat.css),
    gulp.dest(dest.styles)
    ],
    cb
  );
});

/* Gulp task to pre-process sass and deliver the concatenated + minified CSS output */
gulp.task('styles', function(cb) {
  pump([
    gulp.src(src.styles),
    // aim the pipe's output at the CSS destination directory:
    newer(dest.styles),
    // initialize the sourceMaps processor
    sourcemaps.init(),
    // process SASS if the file type is .scss
    sass(options.sass),
    // run the CSS stream through autoprefixer
    postcss(options.postcssProcessors),
    // write-out the CSS sourceMaps if gulp is run without '--type prod':
    sourcemaps.write("."),
    // send livereload's reload signal
    livereload(),
    // write out the CSS in its final processed form
    gulp.dest(dest.styles),
    // send browserSync's reload signal
    browserSync.stream()
    ],
    cb
  );
});

gulp.task('serve', ['default'], function() {

  // start the browserSync server
  browserSync.init(options.browsersync);

  livereload.listen();

  gulp.watch(src.html,        ['copy:html']);
  gulp.watch(src.styles,      ['styles']);
  gulp.watch(src.scripts,     ['copy:standaloneScripts', 'scripts', 'modernizr']);
  gulp.watch(src.images,      ['images']);
});

/* Default gets called by Maven */
gulp.task('default', function(cb){
  runSequence('build', cb);
});


/* HELPERS ================================================================== */

var mergeScripts = function (files, filename, cb) {
  pump([
    gulp.src(files),
    // aim the pipe's output at the JS destination directory
    newer(dest.scripts),
    // initialize the sourceMaps processor
    sourcemaps.init(),
    // concat the stream files into a single .js file
    concat(filename),
    // uglify (minify the js)
    uglify(options.uglify),
    // write-out the JavaScript sourceMaps
    sourcemaps.write('.'),
    // copy to Tomcat
    gulp.dest(tomcat.scripts),
    // write out the JavaScript in its final processed form
    gulp.dest(dest.scripts),
    // send browserSync's reload signal
    browserSync.reload({stream: true})
  ],
  cb
  );
};