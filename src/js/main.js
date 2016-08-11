/**
 * The first JS file loaded.
 * Uses RequireJS, a modular script loader that improves performance
 * by lazy loading JS modules and making sure their dependencies are handled.
 */

requirejs.config({
  baseUrl: 'js',
  paths: {
    // Aliases and paths of modules
    angular: [
      '//ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min',
      // If CDN URL fails, load from this location
      'vendor/angular.min'
    ],
    angularAria: [
      '//ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-aria',
      // If CDN URL fails, load from this location
      'vendor/angular-aria'
    ],
    angularRoute: [
      '//ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-route',
      // If CDN URL fails, load from this location
      'vendor/angular-route'
    ],
    jquery: [
      '//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min',
      // If CDN URL fails, load from this location
      'vendor/jquery-3.1.0.min'
    ],
    jqueryMigrate: [
      '//code.jquery.com/jquery-migrate-3.0.0',
      // If CDN URL fails, load from this location
      'vendor/jquery-migrate-3.0.0'
    ],
    modernizr:      'modernizr',
    scripts:        'scripts',
    jqueryScripts:  'jquery-scripts',
    userPayment:    'apps/users/payment',
    userProfile:    'apps/users/profile',
    userSettings:   'apps/users/settings'
  },
  shim: {
    'angular':      { exports: 'angular' },
    'angularAria':  { deps: ['angular'] },
    'angularRoute': {
      deps: ['angular'],
      exports: 'angularRoute'
    },
    'jquery':         { exports: '$' },
    'jqueryMigrate':  { deps: ['jquery'] },
    'jqueryScripts':  { deps: ['jqueryMigrate'] },
    'scripts':        { deps: ['angular', 'modernizr', 'jqueryMigrate'] }
  }
});

// Start the main logic.
require(['apps/modalViewApp/app', 'scripts', 'jqueryScripts', 'global/responsive-menu']);

// domReady loader plugin test
require(['domReady!'], function (doc) {
    //This function is called once the DOM is ready,
    //notice the value for 'domReady!' is the current
    //document.
    console.log('document ready');
});

// JS module test (apps/users/*)
require(['userSettings'],function(settings){
  settings.save();
});
require(['userPayment'],function(payment){
  payment.updateBank();
});
