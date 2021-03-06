'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/project/:shortname', {
      templateUrl: 'partials/project.html',
      controller: 'ProjectCtrl'
    });
    $routeProvider.when('/user/:username', {
      templateUrl: 'partials/user.html',
      controller: 'UserCtrl'
    });
    $routeProvider.when('new/user', {
      templateUrl: 'partials/newuser.html',
      controller: 'NewUserCtrl'
    });
    $routeProvider.when('new/project', {
        templateUrl: 'partials/newproject.html',
        controller: 'NewProjectCtrl'
    });
    $routeProvider.when('edit/user', {
        templateUrl: 'partials/edituser.html',
        controller: 'EditUserCtrl'
    });
    $routeProvider.when('edit/project', {
        templateUrl: 'partials/editproject.html',
        controller: 'EditProjectCtrl'
    });
    $routeProvider.otherwise({
        templateUrl: 'partials/overview.html',
        controller: 'OverviewCtrl'
    });
}]);
