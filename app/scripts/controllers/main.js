'use strict';

var app = angular.module('reminderApp');

app.factory('Reminders', function($http){
    var URL_BASE = 'http://localhost:3000/needs';

    var remindersService = {};

    remindersService.all = function(){
        return $http.get(URL_BASE+'.json');
      };

    remindersService.create = function(data){
        console.log(data);
        return $http.post(URL_BASE+'.json', data);
      };

    remindersService.delete = function(data){
        return $http.delete(URL_BASE+'/'+data.id+'.json', data);
      };

    return remindersService;

  });


app.factory('Auth', function($http){
    var URL = 'http://localhost:3000/session';
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


app.controller('MainCtrl', function ($scope, Reminders, Auth) {
    $scope.loggedIn = Auth.logged;

    $scope.logout = function() {
        Auth.logout();
      };

    $scope.login = function(){
        Auth.login($scope.credentials)
        .then(
        function(data) {
          console.log(data);
        },function(data) {
          console.log(data);
        }
      );
        $scope.credentials = {};
      };

    $scope.formVisible = false;

    Reminders.all().success( function(data, status, headers, config) {
        $scope.reminders = data;
        console.log(data);
      });

    $scope.createReminder = function() {
        Reminders.create($scope.reminder).success(function(data, status, headers, config) {
          $scope.reminders.push(data);
        });

        $scope.flash = 'Luonti onnistui!';
        $scope.formVisible = false;
        $scope.reminder = {};
      };

    $scope.deleteNeed = function(reminder) {
        Reminders.delete(reminder).success(function(){
          var index = $scope.reminders.indexOf(reminder);
          $scope.reminders.splice(index, 1);
        });
      };

  });