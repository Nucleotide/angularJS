"use strict";var app=angular.module("reminderApp",["ui.bootstrap"]);app.config(["$httpProvider",function(a){a.defaults.useXDomain=!0,delete a.defaults.headers.common["X-Requested-With"]}]);var app=angular.module("reminderApp"),host="http://limitless-mesa-4659.herokuapp.com",ModalInstanceCtrl=function(a,b,c){a.items=c,a.selected={item:a.items[0]},a.ok=function(){b.close(a.selected.item)},a.cancel=function(){b.dismiss("cancel")}},ModalDemoCtrl=function(a,b,c){a.items=["item1","item2","item3"],a.open=function(d){var e=b.open({templateUrl:"myModalContent.html",controller:ModalInstanceCtrl,size:d,resolve:{items:function(){return a.items}}});e.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})}};app.directive("flash",function(){return{restrict:"AE",scope:{message:"="},templateUrl:"views/flash.html",link:function(a,b,c){b.addClass(void 0!==c.type?"alert-"+c.type:"alert-success")}}}),app.factory("Reminders",["$http",function(a){var b=host+"/reminders",c={};return c.all=function(){return a.get(b+".json")},c.create=function(c){return a.post(b+".json",c)},c.delete=function(c){return a.delete(b+"/"+c.id+".json",c)},c.save=function(c){return a.put(b+"/"+c.id+".json",c)},c.complete=function(c){return c.completed=!0,a.put(b+"/"+c.id+".json",c)},c}]),app.factory("Registration",["$http",function(a){var b=host+"/users",c={};return c.all=function(){return a.get(b+".json")},c.register=function(c){return a.post(b+".json",c)},c}]),app.factory("Auth",["$http",function(a){var b=host+"/session",c={};return c.logged={},c.login=function(d){return a.post(b,d).then(function(b){return c.logged.status=!0,c.logged.user=d.user,a.defaults.headers.common["auth-token"]=b.data,b.data})},c.logout=function(){return a.delete(b).then(function(){return c.logged.status=!1,c.logged.user=null,delete a.defaults.headers.common["auth-token"],null})},c}]),app.controller("MainCtrl",["$scope","Reminders","Auth","Registration",function(a,b,c,d){a.loginVisible=!0,a.registrationVisible=!1,a.activeReminders=!0,a.loggedIn=c.logged,a.loginHide=function(){a.loginVisible=!a.loginVisible,a.registrationVisible=!1},a.registrationHide=function(){a.loginVisible=!1,a.registrationVisible=!a.registrationVisible},a.logout=function(){c.logout(),a.flash="Olet kirjautunut ulos."},a.login=function(){c.login(a.credentials).then(function(){a.flash="Kirjautuminen onnistui!",a.loginVisible=!1,a.registrationVisible=!1},function(){a.flash="Kirjautumisessa häikkää, uutta matoa koukkuun.."}),a.credentials={}},b.all().success(function(b){a.registrations=b}),a.register=function(){d.register(a.details).then(function(b){a.registrations.push(b),a.flash="Rekisteröinti onnistui, nyt voit kirjautua sisään.",a.registrationVisible=!1},function(){a.flash="Ei onnistunut"}),a.details={}},a.formVisible=!1,b.all().success(function(b){a.reminders=b}),a.createReminder=function(){b.create(a.reminder).success(function(b){a.reminders.push(b)}),a.flash="Luonti onnistui!",a.formVisible=!1,a.reminder={}},a.deleteReminder=function(c){b.delete(c).success(function(){var b=a.reminders.indexOf(c);a.reminders.splice(b,1),a.flash="Poisto onnistui!"})},a.saveReminder=function(c){b.save(c).success(function(){a.flash="Muokkaus onnistui!"})},a.completeReminder=function(c){b.complete(c).success(function(){a.flash="Tehtävä hoidettu!"})}}]);