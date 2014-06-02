'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/project/:shortname/addcomment', {
        templateUrl: 'partials/addcomment.html',
        controller: 'AddCommentCtrl'
    })
    $routeProvider.when('/project/:shortname', {
      templateUrl: 'partials/project.html',
      controller: 'ProjectCtrl'
    });
    $routeProvider.when('/user/:username', {
      templateUrl: 'partials/user.html',
      controller: 'UserCtrl'
    });
    $routeProvider.when('/new/user', {
      templateUrl: 'partials/newuser.html',
      controller: 'NewUserCtrl'
    });
    $routeProvider.when('/new/project', {
        templateUrl: 'partials/newproject.html',
        controller: 'NewProjectCtrl'
    });
    $routeProvider.when('/edit/user/:username', {
        templateUrl: 'partials/edituser.html',
        controller: 'EditUserCtrl'
    });
    $routeProvider.when('/edit/project/:shortname', {
        templateUrl: 'partials/editproject.html',
        controller: 'EditProjectCtrl'
    });
    $routeProvider.when('/projects', {
        templateUrl: 'partials/allprojects.html',
        controller: 'OverviewCtrl'
    });
    $routeProvider.when('/users', {
        templateUrl: 'partials/allusers.html',
        controller: 'OverviewCtrl'
    });
    $routeProvider.when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
    });
    $routeProvider.otherwise({
        templateUrl: 'partials/overview.html',
        controller: 'OverviewCtrl'
    });
}]);
