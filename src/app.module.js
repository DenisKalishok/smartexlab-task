angular
    .module('app', [
        'ngRoute',
        'ui.bootstrap',

        'templates',
        'users'
    ])
    .config(['$logProvider', '$locationProvider', '$routeProvider', config])
    .run();

function config(
    $logProvider,
    $locationProvider,
    $routeProvider
) {
    $logProvider.debugEnabled(true);
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise('/users');
}
