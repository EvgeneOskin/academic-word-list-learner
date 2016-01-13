'use strict';

var namespace = 'main';
// fix protractor issue
if (window.location.toString().indexOf('localhost:5555') > 0) {
    window.name = 'NG_DEFER_BOOTSTRAP!NG_ENABLE_DEBUG_INFO!';
}
var angular = require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-sanitize');
require('ionic');
require('ionic-angular');
require('angular-material');
require('angular-ui-bootstrap');
var awlList = require('./awl');
var app = angular.module(namespace, ['ionic', 'ngMaterial', 'ui.bootstrap',
    // inject:modules start
    // inject:modules end
]);

if (process.env.SENTRY_MODE === 'prod') {
    var configCompileDeps = ['$compileProvider'];
    var configCompile = function($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    };
    configCompile.$inject = configCompileDeps;
    app.config(configCompile);
}

function SublistsController($scope) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.items = awlList;
};
SublistsController.$inject = ['$scope'];

function SublistController($scope, $stateParams, $state) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.sublistId = $stateParams.sublistId;
    var sublist = awlList[$scope.sublistId];
    $scope.items = sublist.words.map(
        function(value) {
            return {word: value, en: value, ru: sublist.ru[sublist.words.indexOf(value)]}
        }
    );
    $scope.toSublists = function(){
        $state.go('sublist')
    };
};
SublistController.$inject = ['$scope', "$stateParams", "$state"];


function configRouting($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('sublist', {
        url: "/sublist",
        views: {
            sublist: {
                templateUrl: "templates/sublists.html",
                controller: 'SublistsController'
            }
        }
    })
    .state('sublist-detail', {
        url: `/sublist/:sublistId`,
        views: {
            sublist: {
                templateUrl: "templates/sublist.html",
                controller: 'SublistController'
            }
        }
    });
    $urlRouterProvider.otherwise('/sublist');
};
configRouting.$inject = ['$stateProvider', '$urlRouterProvider'];
var runDeps = ['$ionicPlatform', '$window'];
var run = function($ionicPlatform, $window) {
    $ionicPlatform.ready(function() {
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ($window.StatusBar) {
            $window.StatusBar.styleDefault();
        }
        if ($window.TestFairy) {
            $window.TestFairy.begin(process.env.TESTFAIRY_IOS_APP_TOKEN);
        }
    });
};
run.$inject = runDeps;

app
.controller('SublistController', SublistController)
.controller('SublistsController', SublistsController)
.config(configRouting)
.run(run);
module.exports = app;
