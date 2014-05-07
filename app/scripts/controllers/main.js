'use strict';

var app = angular.module('frontendApp');

app.factory('Blogs', function($http){
    var URL_BASE = 'https://ng-project-backend.herokuapp.com/api/blogs';

    var blogsService = {};

    blogsService.all = function(){
        return $http.get(URL_BASE+'.json');
      };

    blogsService.create = function(data){
        console.log('called');
        return $http.post(URL_BASE+'.json', data);
      };

    blogsService.delete = function(data){
        return $http.delete(URL_BASE+'/'+data.id+'.json', data);
      };

    return blogsService;

  });


app.factory('Auth', function($http){
    var URL = 'http://ng-project-backend.herokuapp.com/session';
    var service = {};

    service.logged = {};

    service.login = function(credentials) {
      return $http.post(URL, credentials).then(
        function (token) {
          service.logged.status = true;
          service.logged.user = credentials.user;
          $http.defaults.headers.common['auth-token'] = token.data;
          return token.data;
        }
      );
    };

    service.logout = function(credentials) {
      return $http.delete(URL).then(
        function () {
          service.logged.status = false;
          service.logged.user = null;
          delete $http.defaults.headers.common['auth-token'];
          return null;
        }
      );
    };

    return service;
  });


app.controller('MainCtrl', function ($scope, Blogs, Auth) {
    $scope.loggedIn = Auth.logged;

    $scope.logout = function() {
        Auth.logout();
      };

    $scope.login = function(){
        Auth.login($scope.credentials)
        .then(
        function(data) {
          console.log(data);
        },function( data ) {
          // failure
        }
      );
        $scope.credentials = {};
      };

    $scope.formVisible = false;

    Blogs.all().success( function(data, status, headers, config) {
        $scope.entries = data;
        console.log(data);
      });

    $scope.createBlog = function() {
        Blogs.create($scope.blog).success(function(data, status, headers, config) {
          $scope.entries.push(data);
        });

        $scope.flash = 'Luonti ' +$scope.blog.subject+ ' onnistui!';
        $scope.formVisible = false;
        $scope.blog = {};
      };

    $scope.deleteBlog = function(entry) {
        Blogs.delete(entry).success(function(){
          var index = $scope.entries.indexOf(entry);
          $scope.entries.splice(index, 1);
        });
      };

  });