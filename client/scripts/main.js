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

function MyCtrl($scope) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.items = [
        {"title": "1", "description": "Test"},
        {"title": "2", "description": "Test"},
        {"title": "3", "description": "Test"}
    ];
}
MyCtrl.$inject = ['$scope'];

app.controller('MyCtrl', MyCtrl);

var runDeps = ['$ionicPlatform', '$window'];
var run = function($ionicPlatform, $window) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
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
app.run(run);
module.exports = app;

