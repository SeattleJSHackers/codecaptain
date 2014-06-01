'use strict';

/* Services */

var temp;

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')
    .service('dbSvc', function(){
        this.users = new Firebase('https://blinding-fire-1366.firebaseio.com/users');
        this.projects = new Firebase('https://blinding-fire-1366.firebaseio.com/projects');
    })
    .service('authSvc', function ($q, userSvc) {
        var self = this;
        self.loggedIn = false;
        self.username = '';
        self.notifier = $q.defer();

        self.login = function(username, email) {
            var user = userSvc.getUser(username);
            if (user && (user.email = email)) {
                self.loggedIn = true;
                self.username = username;
            }
            self.notifier.notify();
        }

        self.logout = function() {
            self.loggedIn = false;
            self.username = '';
            self.notifier.notify();
        }
        temp = self;
    })
    .service('userSvc', function($http, $q, dbSvc){

        var _users = [];
        var _loaded = $q.defer();

        dbSvc.users.on('value', function(snapshot) {
            _users = snapshot.val();
            _loaded.notify();
        });

        this.init = function() {
            return _loaded.promise;
        };

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
                if (_users[i].interestedIn) {
                    for (var j = 0; j < _users[i].interestedIn.length; j++ ) {
                            if (_users[i].interestedIn[j] === shortname) {
                                users.push(_users[i].username);
                            }
                    }
                }
            }
            return users;
        };
        this.getProjectMembers = function(shortname) {
            var users = [];
            for (var i = 0; i<_users.length; i++) {
                if (_users[i].memberOf) {
                    for (var j = 0; j < _users[i].memberOf.length; j++ ) {
                        if (_users[i].memberOf[j] === shortname){
                            users.push(_users[i].username);
                        }
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

        this.addUser = function(user) {
            if (user && user.username && !this.getUser(user.username)) {
                var index = _users ? _users.length : 0;
                dbSvc.users.child(''+index).set(user);
            }
        }

    })
    .service('projectSvc', function($http, $q, dbSvc){

        var _projects = [];
        var _loaded = $q.defer();

        dbSvc.projects.on('value', function(snapshot) {
            _projects = snapshot.val();
            _loaded.notify();
        });

        this.init = function() {
            return _loaded.promise;
        };

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