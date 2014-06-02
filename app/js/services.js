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
            if (user && (user.email === email)) {
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
        var self = this;
        var _users = [];
        var _loaded = $q.defer();

        dbSvc.users.on('value', function(snapshot) {
            _users = snapshot.val();
            _loaded.notify();
        });

        self.init = function() {
            return _loaded.promise;
        };

        self.getUser = function(username){
            for (var i = 0; i < _users.length; i++) {
                if (_users[i].username === username) {
                    return _users[i];
                }
            }
            return null;
        };

        self.getUserIndex = function(username){
            for (var i = 0; i < _users.length; i++) {
                if (_users[i].username === username) {
                    return i;
                }
            }
            return null;
        };

        self.userExists = function(name) {
            return !!self.getUser(username);
        };
        self.getOwnedProjects = function(username) {
            var user = self.getUser(username);
            return user ? user.ownerOf : null;
        };
        self.getProjectFollowers = function(shortname) {
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
        self.getProjectMembers = function(shortname) {
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
        self.getUserList = function() {
            var list = [];
            for (var i = 0; i < _users.length; i++) {
                list.push(_users[i]);
            }
            return list;
        }

        self.getUsernameList = function () {
            var users = self.getUserList(),
                usernameList = [];
            for (var i=0; i<users.length; i++)  {
                usernameList[i] = users[i].username;
            }
            return usernameList;
        }

        self.addUser = function(user) {
            if (user && user.username && !self.getUser(user.username)) {
                var index = _users ? _users.length : 0;
                dbSvc.users.child(''+index).set(user);
            }
        }

        self.editUser = function(user) {
            console.log(user);
            if (user && user.username && self.getUser(user.username)) {
                var index = self.getUserIndex(user.username);
                if(user.hasOwnProperty('$$hashKey')) {
                    delete user.$$hashKey
                }
                if (index !== null) {
                    dbSvc.users.child('' + index).set(user);
                }
            }
        }

        self.isFollowing = function(username, shortname) {
            var user = self.getUser(username);
            if (user && user.interestedIn) {
                for (var i = 0; i < user.interestedIn.length; i++) {
                    if (user.interestedIn[i] === shortname) {
                        return true;
                    }
                }
            }
            return false;
        }

        self.isMember = function(username, shortname) {
            var user = self.getUser(username);
            if (user && user.memberOf) {
                for (var i = 0; i < user.memberOf.length; i++) {
                    if (user.memberOf[i] === shortname) {
                        return true;
                    }
                }
            }
            return false;
        }

        self.isOwner = function(username, shortname) {
            var user = self.getUser(username);
            if (user && user.ownerOf) {
                for (var i = 0; i < user.ownerOf.length; i++) {
                    if (user.ownerOf[i] === shortname) {
                        return true;
                    }
                }
            }
            return false;
        }

        self.follow = function(username, shortname) {
            var user = self.getUser(username);
            if (user && !self.isFollowing(username, shortname)) {
                if (user.interestedIn) {
                    user.interestedIn.push(shortname);
                } else {
                    user.interestedIn = [shortname];
                }
                self.editUser(user);
            }
        }

        self.unfollow = function(username, shortname) {
            var user = self.getUser(username);
            if (user && self.isFollowing(username, shortname)) {
                for (var i=0; i<user.interestedIn.length; i++) {
                    if (user.interestedIn[i] === shortname) {
                        user.interestedIn.splice(i,1)
                    }
                }
                self.editUser(user);
            }
        }

        self.join = function(username, shortname) {
            var user = self.getUser(username);
            if (user && !self.isMember(username, shortname)) {
                if (user.memberOf) {
                    user.memberOf.push(shortname);
                } else {
                    user.memberOf = [shortname];
                }
                self.editUser(user);
            }
        }

        self.unjoin = function(username, shortname) {
            var user = self.getUser(username);
            if (user && self.isMember(username, shortname)) {
                for (var i=0; i<user.memberOf.length; i++) {
                    if (user.memberOf[i] === shortname) {
                        user.memberOf.splice(i,1)
                    }
                }
                self.editUser(user);
            }
        }

        self.makeOwner = function(username, shortname) {
            var user = self.getUser(username);
            if (user && !self.isOwner(username, shortname)) {
                if (user.ownerOf) {
                    user.ownerOf.push(shortname);
                } else {
                    user.ownerOf = [shortname];
                }
                self.editUser(user);
            }
        }

        self.unmakeOwner = function(username, shortname) {
            var user = self.getUser(username);
            if (user && self.isOwner(username, shortname)) {
                for (var i=0; i<user.ownerOf.length; i++) {
                    if (user.ownerOf[i] === shortname) {
                        user.ownerOf.splice(i,1)
                    }
                }
                self.editUser(user);
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

        this.getProjectIndex = function(shortname){
            for (var i = 0; i < _projects.length; i++) {
                if (_projects[i].shortname === shortname) {
                    return i;
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
            return project ? project.title : shortname;
        }

        this.addProject = function(project) {
            if (project && project.shortname && !this.getProject(project.shortname)) {
                var index = _projects ? _projects.length : 0;
                dbSvc.projects.child(''+index).set(project);
            }
        }

        this.editProject = function(project) {
            if (project && project.shortname && this.getProject(project.shortname)) {
                var index = this.getProjectIndex(project.shortname);
                if (project.hasOwnProperty('$$hashKey')) {
                    delete project.$$hashKey;
                }

                if (project.hasOwnProperty('comments')) {
                    var comments = project.comments;
                    for (var i = 0; i < comments.length; i++) {
                        if (comments[i].hasOwnProperty('$$hashKey')) {
                            delete comments[i].$$hashKey;
                        }
                    }

                    if (comments.hasOwnProperty('$hashKey')) {
                        delete comments.$$hashKey;
                    }
                }

                if (index !== null) {
                    dbSvc.projects.child('' + index).set(project);
                }
            }
        }

        this.setOwner = function(shortname, username) {
            var project = this.getProject(shortname);

            if (project) {
                project.owner = username;
            }

            var index = this.getProjectIndex(user.username);
            if (index) {
                dbSvc.projects.child('' + index).set(project);
            }
        }

        this.getComments = function(shortname) {
            var project = this.getProject(shortname);
            return project ? project.comments : null;
        }

        this.getCommentIndex = function(username, date, shortname) {
            var comments = this.getComments(shortname);
            for (var i = 0; i<comments.length; i++) {
                if (comments[i].date === date && comments[i].author === username) {
                    return i;
                }
            }
            return null;
        }

        this.addComment = function(comment, shortname) {
            var project = this.getProject(shortname);
            var comments = this.getComments(shortname);

            if (comments) {
                comments.push(comment);
            } else {
                comments = [comment];
            }

            project.comments = comments;

            this.editProject(project);

        }

        this.deleteComment = function(username, date, shortname) {
            var index = this.getCommentIndex(username, date, shortname);
            if (index !== null) {
                var comments = this.getComments(shortname);
                comments.splice(index, 1);

                var project = this.getProject(shortname);
                project.comments = comments;

                for (var i=0; i<comments.length; i++) {
                    if (comments[i].hasOwnProperty('$$hashKey')) {
                        delete comments[i].$$hashKey;
                    }
                }

                if (comments.hasOwnProperty('$hashKey')) {
                    delete comments.$$hashKey;
                }

                this.editProject(project);
            }

        }

        this.getCommentsByUsername = function(username) {
            var projects = this.getProjectList();
            var comments = [];
            if (projects) {
                for (var i = 0; i < projects.length; i++) {
                    if (projects[i].comments) {
                        for (var j = 0; j < projects[i].comments.length; j++) {
                            if (projects[i].comments[j].author === username) {
                                var comment = projects[i].comments[j];
                                comment.shortname = projects[i].shortname;
                                comment.projectTitle = projects[i].title;
                                comments.push(comment);
                            }
                        }
                    }
                }
            }
            return comments;
        }

    });