/******************************************************
 * DEFAULT FRONTEND
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/

var gulp = require('gulp'),
    browserSync = require('browser-sync').create();


/* ADDITIONAL PLUGINS =================================================== */
// autoprefixer         Parse CSS and add vendor prefixes to rules by Can I Use.
// fs-utils             File system utils like reading file contents.
// gulp-buster          Creates JSON file for cache busting.
// gulp-exec            exec plugin for gulp
// gulp-cache-bust      Append a query string to your assets to bust that cache!
// gulp-inject-string   Inject a string into a file.
// gulp-rename          Rename files.
// gulp-sass            Sass plugin for Gulp.
// gulp-uglify          JavaScript parser, mangler/compressor and beautifier toolkit.
// livereload           Monitors files for changes and reloads your web browser.
// pump                 Cleaner syntax (no need for .pipe), streamlined error handling, and pipe multiple streams.
// gulp-run             Pipe to shell commands in gulp
// run-sequence         Run tasks sequentially. Will be deprecated come Gulp 4.0.
// sc5-styleguide       KSS-based styleguide generator

var autoprefixer = require('autoprefixer'),
  bust = require('gulp-buster'),
  cachebust = require('gulp-cache-bust'),
  concat = require('gulp-concat'),
  cssnano = require('cssnano'),
  del = require('del'),
  fs = require('fs-utils'),
  gutil = require('gulp-util'),
    inject = require('gulp-inject-string'),
  livereload = require('gulp-livereload'),
  modernizr = require('gulp-modernizr'),
  newer = require('gulp-newer'),
  notify = require('gulp-notify'),
  postcss = require('gulp-postcss'),
  pump = require('pump'),
  rename = require('gulp-rename'),
  requirejs = require('requirejs'),
  run = require('gulp-run');
  runSequence = require('run-sequence').use(gulp),
  sass = require('gulp-sass'),
  styleguide = require('sc5-styleguide'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');


/* GULPFILE GLOBALS ========================================================= */
var isProd = gutil.env.type === 'prod';
var reload = browserSync.reload;

// Gulp config file
var config = require('./gulpfile-config.json');


/* OPTIONS & CONFIGS ======================================================== */

var postcssProcessors = [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      browsers: [
        'last 2 versions', 'ie >= 9', 'and_chr >= 2.3'
      ],
      flexbox:true
    }),
    cssnano(),
  ];


/* GULP TASKS =============================================================== */

gulp.task('build-entry', function (done) {
    console.log("--------------------------------------------------------------------------------\n");
    console.log("Gulp Build \n");
    console.log("--------------------------------------------------------------------------------\n");
    done();
});

/******************************************************
 * CLEAN TASKS - remove assets from destination
******************************************************/
/* Gulp task to empty the /public directory */
function cleanBuild(){
    return del([config.paths.dest.dir + '/**/*', '!' + config.paths.dest.dir, '!' + config.paths.dest.dir + 'README.md']);
}
gulp.task('build-clean', gulp.series(
    cleanBuild
));


// Copy static html files as-is (no concatenation nor minfification)
gulp.task('copy:html', function(done) {

  pump([
      // Igmore HTML includes
      gulp.src(config.paths.src.htmlFiles),
      gulp.dest(config.paths.dest.dir)
    ],
    done
  );
});

// In destination folder: Add cache busting to HTML
gulp.task('bust-cache', function(cb) {

  pump([
      gulp.src(config.paths.dest.htmlFiles),
      cachebust({
          type: 'timestamp'
      }),
      inject.after("cacheBust=", Date.now()),
      gulp.dest(config.paths.dest.html),
    ],
    cb
  );
});

// In destination folder: Inject includes into HTML pages
gulp.task('insert:html-includes', function(done) {

  // Read file contents of header and footer in destination
  var htmlHeaderContent = fs.readFileSync(config.paths.dest.htmlHeader, "utf8");
  var htmlFooterContent = fs.readFileSync(config.paths.dest.htmlFooter, "utf8");

  pump([
      gulp.src(config.paths.dest.htmlFiles),
      // Inject header
      inject.after(config.paths.dest.htmlHeaderSearchString, htmlHeaderContent),
      // Inject footer
      inject.after(config.paths.dest.htmlFooterSearchString, htmlFooterContent),
      gulp.dest(config.paths.dest.html)
    ],
    done
  );
});

gulp.task('process:html', gulp.series(
  gulp.parallel(
    'copy:html'
  ),
  gulp.parallel(
    'bust-cache'
  ),
  gulp.parallel(
    'insert:html-includes'
  ),
  function(done){
    done();
  })
);



/* Gulp task to copy certain scripts as-is (no concatenation or uglification) from src to public */
gulp.task('copy:standaloneScripts', function(done) {
    pump([
        gulp.src(config.paths.src.standaloneScripts, {
            base: "src/js"
        }),
        //newer(config.paths.dest.scripts),
        uglify(config.uglify),
        gulp.dest(config.paths.tomcat.scripts),
        gulp.dest(config.paths.dest.scripts),
        // pipe generated files into gulp-buster
        bust(),
        // output busters.json to project root
        gulp.dest(config.paths.dest.dir)
      ],
      done
    );
});

/* Gulp task to pre-process JavaScript and deliver the concatenated + minified JS output */
gulp.task('process:scripts', function(done) {
    mergeScripts(config.paths.src.mergeScripts.standard.files, config.paths.src.mergeScripts.standard.name);
    mergeScripts(config.paths.src.mergeScripts.jquery.files, config.paths.src.mergeScripts.jquery.name);
    done();
});

/* Create custom Modernizr file based on references in JS files. */
gulp.task('modernizr', function(done) {
    pump([
            gulp.src(config.paths.src.scripts),
            modernizr(),
            uglify(config.uglify),
            gulp.dest(config.paths.dest.scripts)
        ],
        done
    );
});

/* Gulp task to process images and deliver the optimized output  ==== */
gulp.task('copy:images', function(done) {
    pump([
            gulp.src(config.paths.src.images),
            // copy to tomcat
            gulp.dest(config.paths.tomcat.images),
            // send livereload's reload signal
            livereload(),
            gulp.dest(config.paths.dest.images),
            // pipe generated files into gulp-buster
            bust(),
            // output busters.json to project root
            gulp.dest(config.paths.dest.dir),
            browserSync.reload({stream: true})
        ],
        done
    );
});

gulp.task('fonts', function(done) {
    pump([
            gulp.src(config.paths.src.fonts),
            newer(config.paths.dest.fonts),
            gulp.dest(config.paths.tomcat.fonts),
            gulp.dest(config.paths.dest.fonts)
        ],
        done
    );
});

/* Gulp task to copy certain css as-is (no concatenation or minfification) from src to public */
gulp.task('copy:standaloneStyles', function(done) {
    pump([
            gulp.src(config.paths.src.standaloneStyles),
            newer(config.paths.dest.styles),
            gulp.dest(config.paths.tomcat.css),
            gulp.dest(config.paths.dest.styles),
            // pipe generated files into gulp-buster
            bust(),
            // output busters.json to project root
            gulp.dest(config.paths.dest.dir)
        ],
        done
    );
});

/* Gulp task to pre-process sass and deliver the concatenated + minified CSS output */
gulp.task('process:styles', function(done) {
    pump([
            gulp.src(config.paths.src.styles),
            // aim the pipe's output at the CSS destination directory:
            newer(config.paths.dest.styles),
            // initialize the sourceMaps processor
            sourcemaps.init(),
            // process SASS if the file type is .scss
            sass(config.sassOptions),
            // run the CSS stream through autoprefixer
            postcss(postcssProcessors),
            // write-out the CSS sourceMaps if gulp is run without '--type prod':
            sourcemaps.write("."),
            // send livereload's reload signal
            livereload(),
            // write out the CSS in its final processed form
            gulp.dest(config.paths.dest.styles),
            // pipe generated files into gulp-buster
            bust(),
            // output busters.json to project root
            gulp.dest(config.paths.dest.dir),
            // send browserSync's reload signal
            browserSync.stream({stream: true})
        ],
        done
    );
});

/* Build task */
gulp.task('build', gulp.series(['build-entry', 'build-clean'], ['process:html', 'copy:standaloneScripts', 'process:scripts', 'modernizr', 'fonts', 'copy:standaloneStyles', 'process:styles', 'copy:images']));

/* Task for Maven build */
gulp.task('default', gulp.series('build'));

/* Task for local development */
gulp.task('serve', gulp.series('build', function() {

    // start the browserSync server
    browserSync.init(config.browsersync);

    livereload.listen();

    gulp.watch([config.paths.src.htmlFiles]).on('change', gulp.series('process:html'));
    gulp.watch([config.paths.src.css]).on('change', gulp.series('copy:standaloneStyles'));
    gulp.watch([config.paths.src.styles]).on('change', gulp.series('process:styles'));
    gulp.watch([config.paths.src.scripts]).on('change', gulp.series('process:scripts'));
    gulp.watch([config.paths.src.images]).on('change', gulp.series('copy:images'));

}));


/* HELPERS ================================================================== */

var mergeScripts = function(files, filename, done) {
  pump([
      gulp.src(files),
      // aim the pipe's output at the JS destination directory
      newer(config.paths.dest.scripts),
      // initialize the sourceMaps processor
      sourcemaps.init(),
      // concat the stream files into a single .js file
      concat(filename),
      // uglify (minify the js)
      uglify(config.uglify),
      // write-out the JavaScript sourceMaps
      sourcemaps.write('.'),
      // copy to Tomcat
      gulp.dest(config.paths.tomcat.scripts),
      // write out the JavaScript in its final processed form
      gulp.dest(config.paths.dest.scripts),
      // pipe generated files into gulp-buster
      bust(),
      // output busters.json to project root
      gulp.dest(config.paths.dest.dir),
      // send browserSync's reload signal
      browserSync.reload({stream: true})
    ],
    done
  );
};
