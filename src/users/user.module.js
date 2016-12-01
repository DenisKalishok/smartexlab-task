angular
    .module('users', [
        'request'
    ])
    .config(['$routeProvider', config]);

function config($routeProvider) {
    $routeProvider
        .when('/users', {
            templateUrl: 'src/users/list/list.template.html',
            controller: 'UserListController',
            controllerAs: 'ctrl'
        })
        .when('/users/:userId', {
            templateUrl: 'src/users/detail/detail.template.html',
            controller: 'UserDetailController',
            controllerAs: 'ctrl'
        });
}
