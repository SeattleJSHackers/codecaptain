'use strict';

/* Controllers */

var temp = [];

angular.module('myApp.controllers', [])
    .controller('OverviewCtrl', function($scope, $q, projectSvc, userSvc) {
        $q.all([
            projectSvc.init(),
            userSvc.init()
        ]).then(function() {
            $scope.model = {
                users: userSvc.getUserList(),
                projects: projectSvc.getProjectList()
            };
            for (var project in $scope.model.projects) {
                var p = $scope.model.projects[project];
                p.followers = userSvc.getProjectFollowers(p.shortname);
            };
       });

    })
    .controller('ProjectCtrl', function($scope, $q, $routeParams, projectSvc, userSvc) {
        $q.all([
            projectSvc.init(),
            userSvc.init()
        ]).then(function() {
            $scope.project = projectSvc.getProject($routeParams.shortname);
            $scope.project.followers = userSvc.getProjectFollowers($routeParams.shortname);
            $scope.project.members = userSvc.getProjectMembers($routeParams.shortname);
        });
    })
    .controller('UserCtrl', function($scope, $q, $routeParams, userSvc, projectSvc) {
        $q.all([
            projectSvc.init(),
            userSvc.init()
        ]).then(function() {
            $scope.user = userSvc.getUser($routeParams.username);
            $scope.getProjectTitle = function (shortname) {
                return projectSvc.getProjectTitle(shortname);
            };
        });
    })
    .controller('NewUserCtrl', function($scope) {

    })
    .controller('NewProjectCtrl', function($scope) {

    })
    .controller('EditUserCtrl', function($scope) {

    })
    .controller('EditProjectCtrl', function($scope) {

    })
    .controller('MenuCtrl', function($scope, $location) {
        $scope.active = function(path) {
            var location = $location.path().match('^' + path);
            return location !== null;
        }
    });
