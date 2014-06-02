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
    .controller('ProjectCtrl', function($scope, $q, $routeParams, projectSvc, userSvc, authSvc) {
        $scope.currentUser = authSvc.username;
        $scope.isFollowing = function() {
            if ($scope.project === null) {
                return false;
            }
            return userSvc.isFollowing($scope.currentUser, $scope.project.shortname);
        }
        $scope.isMember = function() {
            if ($scope.project === null) {
                return false;
            }
            return userSvc.isMember($scope.currentUser, $scope.project.shortname);
        };

        $scope.follow = function() {
            if ($scope.isFollowing()) {
                userSvc.unfollow($scope.currentUser, $scope.project.shortname);
            } else {
                userSvc.follow($scope.currentUser, $scope.project.shortname);
            }
        }

        $scope.join = function() {
            if ($scope.isMember()) {
                userSvc.unjoin($scope.currentUser, $scope.project.shortname);
            } else {
                userSvc.join($scope.currentUser, $scope.project.shortname);
            }
        }

        $scope.deleteComment = function(date, shortname) {
            projectSvc.deleteComment($scope.currentUser, date, shortname);
        }

        $scope.sortComments = function(comment) {
            var date = new Date(comment.date);
            return date.valueOf();
        }

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
    .controller('UserCtrl', function($scope, $q, $routeParams, userSvc, projectSvc, authSvc) {
        var update = function() {
            $scope.user = userSvc.getUser($routeParams.username);
            $scope.getProjectTitle = function (shortname) {
                return projectSvc.getProjectTitle(shortname);
            };
            $scope.userComments = projectSvc.getCommentsByUsername($routeParams.username);
        }

        $scope.sortComments = function(comment) {
            var date = new Date(comment.date);
            return date.valueOf();
        }
        $scope.currentUser = authSvc.username;
        projectSvc.init().then(null, null, update);
        userSvc.init().then(null, null, update);
        update();
    })
    .controller('NewUserCtrl', function($scope, $location, userSvc, authSvc) {
        $scope.addUser = function() {
            if ($scope.user && $scope.user.username && $scope.user.email) {
                userSvc.addUser($scope.user);
                authSvc.login($scope.user.username, $scope.user.email);
                $location.path('/user/' + $scope.user.username);
            }
        }
    })
    .controller('NewProjectCtrl', function($scope, $location, authSvc, projectSvc) {
        $scope.addProject = function() {
            if ($scope.project && $scope.project.shortname && $scope.project.title) {
                $scope.project.creator = authSvc.username;
                projectSvc.addProject($scope.project);
                $location.path('/project/' + $scope.project.shortname);
            }
        }
    })
    .controller('EditUserCtrl', function($scope, $routeParams, $location, userSvc, authSvc) {
        if ($routeParams.username !== authSvc.username) {
            $location.path('/');
        }

        $scope.user = userSvc.getUser($routeParams.username);

        $scope.editUser = function() {
            if ($scope.user && $scope.user.username && $scope.user.email) {
                userSvc.editUser($scope.user);
                $location.path('/user/' + $scope.user.username);
            }
        }
    })
    .controller('EditProjectCtrl', function($scope, $routeParams, $location, userSvc, projectSvc, authSvc) {
        var project = projectSvc.getProject($routeParams.shortname);

        if (!project || (project.owner !== authSvc.username && project.creator !== authSvc.username) ) {
            $location.path('/');
        }

        $scope.users = userSvc.getUsernameList();
        $scope.project = project;
        $scope.error = null;

        $scope.editProject = function() {
            $scope.error = null;
            if ($scope.project && $scope.project.shortname && $scope.project.title) {
                if ($scope.project.owner === '' || userSvc.getUser($scope.project.owner)) {
                    projectSvc.editProject($scope.project);

                    var oldOwner = project.owner;
                    var newOwner = $scope.project.owner;

                    userSvc.unmakeOwner(oldOwner, $scope.project.shortname);
                    userSvc.makeOwner(newOwner, $scope.project.shortname);

                    $location.path('/project/' + $scope.project.shortname);
                } else {
                    $scope.error = 'Owner does not exist.';
                }
            } else {
                $scope.error = 'You must specify a title.';
            }
        }
    })
    .controller('LoginCtrl', function($scope, $location, authSvc) {
        $scope.login = function() {
            $scope.error = null;
            if ($scope.user && $scope.user.username && $scope.user.email) {
                authSvc.login($scope.user.username, $scope.user.email);
                if (authSvc.loggedIn) {
                    $location.path('/user/' + $scope.user.username);
                } else {
                    $scope.error = 'Username or password is incorrect.';
                }
            } else {
                $scope.error = 'Please fill out both fields.';
            }
        }
    })
    .controller('AddCommentCtrl', function($scope, $location, $routeParams, authSvc, projectSvc) {
        var project = $routeParams.shortname;
        $scope.comments = projectSvc.getComments(project);

        $scope.addComment = function() {
            if($scope.comment && authSvc.loggedIn) {
                $scope.comment.author = authSvc.username;
                $scope.comment.date = (new Date()) + '';
                projectSvc.addComment($scope.comment, project)
            }
            $location.path('/project/' + project)
        }

        $scope.sortComments = function(comment) {
            var date = new Date(comment.date);
            return date.valueOf();
        }

    })
    .controller('MenuCtrl', function($scope, $location, $q, authSvc) {
        $scope.active = function(path) {
            var location = $location.path().match('^' + path);
            return location !== null;
        }

        authSvc.notifier.promise.then(null, null, function() {
            $scope.loggedIn = authSvc.loggedIn;
            $scope.currentUser = authSvc.username;
        });

        $scope.logout = function() {
            authSvc.logout();
        }

    });
