'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('OverviewCtrl', function($scope, projectSvc, userSvc) {
        $scope.model = {
            users: userSvc.getUserList(),
            projects: projectSvc.getProjectList()
        };
        for (var project in $scope.model.projects) {
            project = $scope.model.projects[project];
            project.followers = userSvc.getProjectFollowers(project.shortname);
        }
        console.log($scope.model)
    })
    .controller('ProjectCtrl', function($scope, $routeParams, projectSvc, userSvc) {
        $scope.project = projectSvc.getProject($routeParams.shortname);
        $scope.project.followers = userSvc.getProjectFollowers($routeParams.shortname);
        $scope.project.members = userSvc.getProjectMembers($routeParams.shortname);
        console.log($scope.project)
    })
    .controller('UserCtrl', function($scope, $routeParams, userSvc) {
        $scope.user = userSvc.getUser($routeParams.username);
    })
    .controller('NewUserCtrl', function($scope) {

    })
    .controller('NewProjectCtrl', function($scope) {

    })
    .controller('EditUserCtrl', function($scope) {

    })
    .controller('EditProjectCtrl', function($scope) {

    });
