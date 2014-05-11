'use strict';

var app = angular.module('reminderApp');

var host = 'http://limitless-mesa-4659.herokuapp.com';
//var host = 'http://localhost:3000';

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

app.directive('flash', function() {
  return {
      restrict: 'AE',
      scope: {
        message: '='
      },
      templateUrl: 'views/flash.html',
      link: function(scope, elem, attrs) {
        if ( attrs.type!==undefined) {
          elem.addClass('alert-'+attrs.type);
        } else {
          elem.addClass('alert-success');
        }
      }
    };
});

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};


app.factory('Reminders', function($http){
    var URL_BASE = host+'/reminders';

    var remindersService = {};

    remindersService.all = function(){
        return $http.get(URL_BASE+'.json');
      };

    remindersService.create = function(data){
        return $http.post(URL_BASE+'.json', data);
      };

    remindersService.delete = function(data){
        return $http.delete(URL_BASE+'/'+data.id+'.json', data);
      };

    remindersService.save = function(data){
      return $http.put(URL_BASE+'/'+data.id+'.json', data);
    };

    remindersService.complete = function(data){
      data.completed = true;
      return $http.put(URL_BASE+'/'+data.id+'.json', data);
    };

    return remindersService;

  });

app.factory('Registration', function($http){
    var URL_BASE = host+'/users';

    var registrationService = {};

    registrationService.all = function(){
      return $http.get(URL_BASE+'.json');
    };

    registrationService.register = function(data){
      return $http.post(URL_BASE+'.json', data);
    };

    return registrationService;
  });


app.factory('Auth', function($http){
    var URL = host+'/session';
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


app.controller('MainCtrl', function ($scope, Reminders, Auth, Registration) {

    $scope.loginVisible =true;
    $scope.registrationVisible = false;
    $scope.activeReminders = true;
    $scope.loggedIn = Auth.logged;

    $scope.loginHide = function() {
      $scope.loginVisible = !$scope.loginVisible;
      $scope.registrationVisible = false;
    };

    $scope.registrationHide = function() {
      $scope.loginVisible = false;
      $scope.registrationVisible = !$scope.registrationVisible;
    };

    $scope.logout = function() {
        Auth.logout();
        $scope.flash = 'Olet kirjautunut ulos.';
      };

    $scope.login = function(){
        Auth.login($scope.credentials)
        .then(
        function(data) {
          $scope.flash = 'Kirjautuminen onnistui!';
          $scope.loginVisible =false;
          $scope.registrationVisible = false;
        },function(data) {
          $scope.flash = 'Kirjautumisessa häikkää, uutta matoa koukkuun..';
        }
      );
        
        $scope.credentials = {};
      };

    Reminders.all().success( function(data, status, headers, config) {
        $scope.registrations = data;
      });

    $scope.register = function(){
        Registration.register($scope.details).then(
        function(data, status, headers, config) {
          $scope.registrations.push(data);
          $scope.flash = 'Rekisteröinti onnistui, nyt voit kirjautua sisään.';
          $scope.registrationVisible =false;
        },function(data) {
          $scope.flash = 'Ei onnistunut';
        }
      );
        $scope.details = {};
      };

    $scope.formVisible = false;

    Reminders.all().success( function(data, status, headers, config) {
        $scope.reminders = data;
      });

    $scope.createReminder = function() {
        Reminders.create($scope.reminder).success(function(data, status, headers, config) {
          $scope.reminders.push(data);
        });

        $scope.flash = 'Luonti onnistui!';
        $scope.formVisible = false;
        $scope.reminder = {};
      };

    $scope.deleteReminder = function(reminder) {
        Reminders.delete(reminder).success(function(){
          var index = $scope.reminders.indexOf(reminder);
          $scope.reminders.splice(index, 1);
          $scope.flash = 'Poisto onnistui!';
        });
      };

    $scope.saveReminder = function(reminder) {
        Reminders.save(reminder).success(function(data, status, headers, config){
          $scope.flash = 'Muokkaus onnistui!';
        });
      };

    $scope.completeReminder = function(reminder) {
        Reminders.complete(reminder).success(function(data, status, headers, config){
          $scope.flash = 'Tehtävä hoidettu!';
        });
      };

  });