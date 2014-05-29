'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')
    .service('userSvc', function(){
        // Username is unique id
        // Email can be set to anything
        // Projects are the ones the user is interested in
        // Owner is the project the user is sponsoring
        var _users = [
            {
                username: 'joshua',
                firstName: 'Joshua',
                lastName: 'Hutt',
                email: 'joshua@huttj.com',
                interestedIn: [
                    'codecaptain',
                ],
                memberOf: [],
                ownerOf: 'codecaptain'
            },
            {
                username: 'jackson',
                firstName: 'Jackson',
                lastName: 'Pollock',
                email: 'jackson@pollockj.com',
                interestedIn: [
                    'codecaptain'
                ],
                memberOf: [],
                ownerOf: null
            },
            {
                username: 'jane',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe@gmail.com',
                interestedIn: [
                    'codecaptain',
                    'teamcaptain'
                ],
                memberOf: [
                    'codecaptain'
                ],
                ownerOf: 'teamcaptain'
            }
        ];
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
        this.getOwnedProject = function(username) {
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
    .service('projectSvc', function(){
        var _projects = [
            {
                title: 'Code Captain',
                shortname: 'codecaptain',
                description: 'Code Captain is a tool to help coders build and pick teams.',
                owner: 'joshua',
                creator: 'joshua'
            },
            {
                title: 'Team Captain',
                shortname: 'teamcaptain',
                description: 'A fork of Code Captain for teams of all kinds.',
                owner: 'jane',
                creator: 'jackson'
            }
        ];
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
        }
    });