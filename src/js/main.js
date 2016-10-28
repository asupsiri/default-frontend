/**
 * The first JS file loaded.
 * Uses RequireJS, a modular script loader that improves performance
 * by lazy loading JS modules and making sure their dependencies are handled.
 */

// Cache busting variables. These are passed to the RequireJS urlArgs config option.
// Different querystring values are appended for prod vs. development.
// Prod uses the build version. Development uses a timestamp.
var htmlTag      = document.getElementsByTagName("html")[0],
    buildVersion = "0.1.1",
    prodFlag     = (htmlTag.dataset.prodFlag === "true");

// Set prodFlag to true if there's no data-prod-flag attribute value in the <html> tag.
if (typeof htmlTag.dataset.prodFlag === "undefined" ) {
   prodFlag = true;
}

requirejs.config({
  baseUrl: 'js',
  paths: {
    // Aliases and paths of modules
    angular: [
      //'//ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min',
      // If CDN URL fails, load from this location
      'vendor/angular.min'
    ],
    angularAria: [
      //'//ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-aria',
      // If CDN URL fails, load from this location
      'vendor/angular-aria'
    ],
    angularRoute: [
      //'//ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-route',
      // If CDN URL fails, load from this location
      'vendor/angular-route'
    ],
    bootstrap: [
      //'//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
      // If CDN URL fails, load from this location
      'frontend-frameworks/bootstrap/bootstrap.min'
    ],
    foundation: [
      //'//dhbhdrzi4tiry.cloudfront.net/cdn/sites/foundation',
      // If CDN URL fails, load from this location
      'frontend-frameworks/foundation/foundation'
    ],
    jquery: [
      //'//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min',
      // If CDN URL fails, load from this location
      'vendor/jquery-3.1.0.min'
    ],
    jqueryMigrate: [
      //'//code.jquery.com/jquery-migrate-3.0.0',
      // If CDN URL fails, load from this location
      'vendor/jquery-migrate-3.0.0'
    ],
    modernizr:      'modernizr',
    scripts:        'scripts',
    jqueryScripts:  'jquery-scripts',
    userPayment:    'apps/modular-js_users/payment',
    userProfile:    'apps/modular-js_users/profile',
    userSettings:   'apps/modular-js_users/settings'
  },
  shim: {
    'angular':      { exports: 'angular' },
    'angularAria':  { deps: ['angular'] },
    'angularRoute': {
      deps: ['angular'],
      exports: 'angularRoute'
    },
    'bootstrap':     { deps: ['jquery'] },
    'foundation':     { deps: ['jquery'] },
    'jquery':         { exports: '$' },
    'jqueryMigrate':  { deps: ['jquery'] },
    'jqueryScripts':  { deps: ['jqueryMigrate'] },
    'scripts':        { deps: ['angular', 'modernizr', 'jqueryMigrate'] }
  },
  // For cache busting
  urlArgs: "v=" + ((prodFlag) ? buildVersion: (new Date()).getTime())
});

// Start the main logic.

// Angular project require
require(['apps/angular_modalViewApp/app', 'scripts', 'jqueryScripts', 'global/responsive-menu']);

// domReady loader plugin test
require(['domReady!'], function (doc) {
    //This function is called once the DOM is ready,
    //notice the value for 'domReady!' is the current
    //document.
    console.log('document ready');
});

// Load Bootstrap Framework JS
require(['bootstrap'], function(){
  console.log('bootstrap loaded!');

  // Back to top links
  $('a.backToTop').click(function(){
    document.getElementById('pageTop').focus();
    event.preventDefault();
  });

});


// Load Foundation Framework JS
/*
require(['foundation'], function(){
  console.log('foundation loaded!');
  $(document).foundation();
});
*/

// Modular JS example
require(['userSettings'],function(settings){
  settings.save();
});
require(['userPayment'],function(payment){
  payment.updateBank();
});
