angular
    .module('users')
    .controller('UserListController', [
        '$location',
        '$scope',
        'RequestService',

        UserListController
    ]);

function UserListController(
    $location,
    $scope,
    RequestService
) {
    const me = this;

    this.list = [];
    this.isLoading = true;

    RequestService
        .getUsers()
        .then(function (data) {
            $scope.$evalAsync(function () {
                me.list = data;
                me.isLoading = false;
            });
        });

    this.onRowClick = function (user) {
        $location.path('/users/' + user.id);
    }
}
