'use strict';

/* Controllers */

var temp;

angular.module('myApp.controllers', [])
    .controller('OverviewCtrl', function($scope, $q, projectSvc, userSvc, authSvc) {
        // Scope assignments required for the controller
        var update = function() {
            $scope.model = {
                users: userSvc.getUserList(),
                projects: projectSvc.getProjectList()
            };
            for (var project in $scope.model.projects) {
                var p = $scope.model.projects[project];
                p.followers = userSvc.getProjectFollowers(p.shortname);
            }
        };

        // Changes to the model will call notify() on the promise returned by init()
        projectSvc.init().then(null, null, update);
        userSvc.init().then(null, null, update);

        // Add data when the page is opened with the model already created
        update();
    })
    .controller('ProjectCtrl', function($scope, $q, $routeParams, projectSvc, userSvc) {

        var update = function() {
            $scope.project = projectSvc.getProject($routeParams.shortname);
            if ($scope.project) {
                $scope.project.followers = userSvc.getProjectFollowers($routeParams.shortname);
                $scope.project.members = userSvc.getProjectMembers($routeParams.shortname);
            }
        };

        projectSvc.init().then(null, null, update);
        userSvc.init().then(null, null, update);

        update();
    })
    .controller('UserCtrl', function($scope, $q, $routeParams, userSvc, projectSvc) {
        var update = function() {
            $scope.user = userSvc.getUser($routeParams.username);
            $scope.getProjectTitle = function (shortname) {
                return projectSvc.getProjectTitle(shortname);
            };
        }
        projectSvc.init().then(null, null, update);
        userSvc.init().then(null, null, update);
        update();
    })
    .controller('NewUserCtrl', function($scope, $location, userSvc, authSvc) {
        // temp.user = $scope.user;

        $scope.addUser = function() {
            if ($scope.user && $scope.user.username && $scope.user.email) {
                userSvc.addUser($scope.user);
                authSvc.login($scope.user.username, $scope.user.email);
                $location.path('/user/' + $scope.user.username);
            }
        }
    })
    .controller('NewProjectCtrl', function($scope) {

    })
    .controller('EditUserCtrl', function($scope) {

    })
    .controller('EditProjectCtrl', function($scope) {

    })
    .controller('LoginCtrl', function($scope, $location, authSvc) {
        $scope.login = function() {
            if ($scope.user && $scope.user.username && $scope.user.email) {
                authSvc.login($scope.user.username, $scope.user.email);
                $location.path('/user/' + $scope.user.username);
            }
        }
    })
    .controller('MenuCtrl', function($scope, $location, $q, authSvc) {
        $scope.active = function(path) {
            var location = $location.path().match('^' + path);
            return location !== null;
        }

        authSvc.notifier.promise.then(null, null, function() {
            $scope.loggedIn = authSvc.loggedIn;
        });

        $scope.logout = function() {
            authSvc.logout();
        }

    });
