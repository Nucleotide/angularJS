'use strict';

var app = angular.module('reminderApp', ['ui.bootstrap', 'ngCookies']);

app.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
	});