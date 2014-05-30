'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')
    .service('userSvc', function($http){

        var _users = [];

        this.load = function() {
            return $http.get('../test/data/users.json').success(function(data) {
                _users = data;
            });
        };

        this.init = function() {
            if (!_users.length) {
                return this.load();
            }
            return true;
        }

        this.getUser = function(username){
            for (var i = 0; i < _users.length; i++) {
                if (_users[i].username === username) {
                    return _users[i];
                }
            }
            return null;
        };
        this.userExists = function(name) {
            return !!this.getUser(username);
        };
        this.getOwnedProjects = function(username) {
            var user = this.getUser(username);
            return user ? user.ownerOf : null;
        };
        this.getProjectFollowers = function(shortname) {
            var users = [];
            for (var i = 0; i<_users.length; i++) {
                for (var j = 0; j < _users[i].interestedIn.length; j++ ) {
                    if (_users[i].interestedIn[j] === shortname){
                        users.push(_users[i].username);
                    }
                }
            }
            return users;
        };
        this.getProjectMembers = function(shortname) {
            var users = [];
            for (var i = 0; i<_users.length; i++) {
                for (var j = 0; j < _users[i].memberOf.length; j++ ) {
                    if (_users[i].memberOf[j] === shortname){
                        users.push(_users[i].username);
                    }
                }
            }
            return users;
        };
        this.getUserList = function() {
            var list = [];
            for (var i = 0; i < _users.length; i++) {
                list.push(_users[i]);
            }
            return list;
        }
    })
    .service('projectSvc', function($http){

        var _projects = [];

        this.load = function() {
            return $http.get('../test/data/projects.json').success(function(data) {
                _projects = data;
            });
        };

        this.init = function() {
            if (!_projects.length) {
                return this.load();
            }
            return true;
        }

        this.getProject = function(shortname){
            for (var i = 0; i < _projects.length; i++) {
                if (_projects[i].shortname === shortname) {
                    return _projects[i];
                }
            }
            return null;
        };
        this.projectExists = function(name) {
            return !!this.getProject(shortname);
        };
        this.getOwner = function(shortname) {
            var project = this.getProject(shortname);
            return project ? project.owner : null;
        };
        this.getCreator = function(shortname) {
            var project = this.getProject(shortname);
            return project ? project.creator : null;
        };
        this.getProjectList = function() {
            var list = [];
            for (var i = 0; i < _projects.length; i++) {
                list.push(_projects[i]);
            }
            return list;
        };
        this.getProjectTitle = function(shortname) {
            var project = this.getProject(shortname);
            return project.title;
        }
    });