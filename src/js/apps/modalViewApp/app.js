/**
 * View switching and prototypes.
 * TODO: modularize app.js into proper subfolers
 */

// RequireJS: Define JS dependencies
define(['angular', 'angularAria', 'angularRoute'], function (angular) {


	var modalViewApp = angular.module('modalViewApp', ['ngAria', 'ngRoute']);

  modalViewApp.config(function ($routeProvider) {
    $routeProvider
      .when('/product-review-form',
        {
          controller: 'SimpleController',
          templateUrl: 'views/product-review.html'
        })
      .when('/login-form',
        {
          controller: 'SimpleController',
          templateUrl: 'views/login.html'
        })
      .otherwise({redirectTo: ''});
  });

  modalViewApp.factory('simpleFactory', function () {
    var productReviews = [
    ];

    var factory = {};
    factory.getReviews = function() {
      return productReviews;
    };
    factory.submitReview = function() {
      return productReviews;
    };

    return factory;
  });

  modalViewApp.controller('SimpleController', function ($scope, simpleFactory) {
    $scope.productReviews = [];

    init();

    function init() {
      $scope.productReviews = simpleFactory.getReviews();
    }

    $scope.submitProductReviewForm = function () {
      $scope.productReviews.push (
        {
            title: $scope.newReview.title,
            rating: $scope.newReview.rating,
            body: $scope.newReview.body
        });
    };
  });

	angular.bootstrap(document.getElementsByTagName("html")[0], ['modalViewApp']);
	return modalViewApp;


});
