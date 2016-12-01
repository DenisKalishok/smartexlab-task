angular
    .module('app', [
        'ngRoute',
        'ui.bootstrap',

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

    $routeProvider
        .when('/users', {
            template: '<user-list></user-list>'
        })
        .when('/users/:userId', {
            template: '<user-detail></user-detail>'
        })
        .otherwise('/users');
}
